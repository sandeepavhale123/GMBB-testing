import React from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Loader2, ExternalLink, ArrowLeft } from "lucide-react";
import { getDiscoveredPages, startAudit } from "@/services/liveSeoFixer";
import {
  getSupportedPageTypes,
  transformToPageTypeOptions,
  PageTypeOption,
} from "@/services/liveSeoFixer/pageTypeService";
import { useToast } from "@/hooks/use-toast";

interface SelectedPage {
  id: string;
  url: string;
  title: string;
  pageType: string;
  targetKeyword: string;
}

// Utility function to extract and convert last URL segment to title case
const extractKeywordFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname
      .split("/")
      .filter((segment) => segment.length > 0);

    if (pathSegments.length === 0) {
      return "";
    }

    // Get the last segment
    const lastSegment = pathSegments[pathSegments.length - 1];

    // Remove file extensions if any
    const withoutExtension = lastSegment.replace(/\.(html|php|aspx|jsp)$/, "");

    // Convert kebab-case, snake_case, or space-separated to Title Case
    const words = withoutExtension
      .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
      .split(" ")
      .filter((word) => word.length > 0)
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      );

    return words.join(" ");
  } catch (error) {
    return "";
  }
};

const PageSelection: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const auditId = searchParams.get("audit_id");
  const mode = searchParams.get("mode"); // 'auto' or 'manual'

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPages, setSelectedPages] = React.useState<SelectedPage[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageTypes, setPageTypes] = React.useState<Record<string, string>>({});
  const [targetKeywords, setTargetKeywords] = React.useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [autoSelectInitialized, setAutoSelectInitialized] =
    React.useState(false);

  // Fetch supported page types
  const { data: pageTypesResponse } = useQuery({
    queryKey: ["supported-page-types"],
    queryFn: getSupportedPageTypes,
  });

  const pageTypeOptions: PageTypeOption[] = React.useMemo(() => {
    if (!pageTypesResponse?.data) return [];
    return transformToPageTypeOptions(pageTypesResponse.data);
  }, [pageTypesResponse]);

  // Fetch discovered pages
  const { data: pagesResponse, isLoading } = useQuery({
    queryKey: [
      "discovered-pages",
      projectId,
      auditId,
      currentPage,
      searchQuery,
    ],
    queryFn: () =>
      getDiscoveredPages(projectId!, auditId!, currentPage, 50, searchQuery),
    enabled: !!projectId && !!auditId,
  });

  const pages = pagesResponse?.data?.pages || [];
  const totalPages = pagesResponse?.data?.total_pages || 0;

  // Auto-select pages when in auto mode
  React.useEffect(() => {
    if (mode === "auto" && pages.length > 0 && !autoSelectInitialized) {
      // Pre-select only the first 20 pages
      const pagesToPreselect = pages.slice(0, 20);

      const preselectedPages: SelectedPage[] = pagesToPreselect.map((page) => {
        const autoKeyword = extractKeywordFromUrl(page.url);
        return {
          id: page.id,
          url: page.url,
          title: page.title,
          pageType: page.estimated_type,
          targetKeyword: page.suggested_keywords?.[0] || autoKeyword,
        };
      });

      const preselectedTypes: Record<string, string> = {};
      const preselectedKeywords: Record<string, string> = {};

      pagesToPreselect.forEach((page) => {
        const autoKeyword = extractKeywordFromUrl(page.url);
        preselectedTypes[page.id] = page.estimated_type;
        preselectedKeywords[page.id] =
          page.suggested_keywords?.[0] || autoKeyword;
      });

      setSelectedPages(preselectedPages);
      setPageTypes(preselectedTypes);
      setTargetKeywords(preselectedKeywords);
      setAutoSelectInitialized(true);
    }
  }, [mode, pages, autoSelectInitialized]);

  const handlePageSelect = (page: any, checked: boolean) => {
    if (checked) {
      if (selectedPages.length >= 20) {
        return; // Don't allow more than 20 selections
      }

      // Auto-generate keyword from URL if not already set
      const autoKeyword = extractKeywordFromUrl(page.url);
      const keyword =
        targetKeywords[page.id] || page.suggested_keywords?.[0] || autoKeyword;

      // Set the keyword in state
      setTargetKeywords((prev) => ({ ...prev, [page.id]: keyword }));

      setSelectedPages((prev) => [
        ...prev,
        {
          id: page.id,
          url: page.url,
          title: page.title,
          pageType: pageTypes[page.id] || page.estimated_type,
          targetKeyword: keyword,
        },
      ]);
    } else {
      setSelectedPages((prev) => prev.filter((p) => p.id !== page.id));
      // Clean up the state for unselected pages
      setPageTypes((prev) => {
        const newTypes = { ...prev };
        delete newTypes[page.id];
        return newTypes;
      });
      setTargetKeywords((prev) => {
        const newKeywords = { ...prev };
        delete newKeywords[page.id];
        return newKeywords;
      });
    }
  };

  const handlePageTypeChange = (pageId: string, pageType: string) => {
    setPageTypes((prev) => ({ ...prev, [pageId]: pageType }));
    setSelectedPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, pageType } : p))
    );
  };

  const handleKeywordChange = (pageId: string, keyword: string) => {
    setTargetKeywords((prev) => ({ ...prev, [pageId]: keyword }));
    setSelectedPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, targetKeyword: keyword } : p))
    );
  };

  const { toast } = useToast();

  const handleStartAudit = async () => {
    if (selectedPages.length === 0) {
      toast({
        title: "No pages selected",
        description: "Please select at least one page to audit.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPages.some((page) => !page.targetKeyword.trim())) {
      toast({
        title: "Missing keywords",
        description: "Please enter target keywords for all selected pages.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare the data to send to the API
      const auditData = selectedPages.map((page) => ({
        id: page.id,
        url: page.url,
        page_type: page.pageType,
        target_keyword: page.targetKeyword,
      }));

      const response = await startAudit(projectId!, auditId!, auditData);

      if (response.code === 200) {
        toast({
          title: "Audit started successfully",
          description: `Audit started for ${response.data.pages_count} pages.`,
        });
        navigate(`/module/live-seo-fixer/projects/${projectId}/audit-progress`);
      } else {
        throw new Error(response.message || "Failed to start audit");
      }
    } catch (error) {
      console.error("Failed to start audit:", error);
      toast({
        title: "Error starting audit",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPageSelected = (pageId: string) =>
    selectedPages.some((p) => p.id === pageId);

  const handleSelectAllPages = () => {
    const availableSlots = 20 - selectedPages.length;
    const pagesToAdd = pages
      .slice(0, availableSlots)
      .filter((page) => !isPageSelected(page.id));

    const newSelectedPages: SelectedPage[] = [];
    const newPageTypes: Record<string, string> = {};
    const newTargetKeywords: Record<string, string> = {};

    pagesToAdd.forEach((page) => {
      const autoKeyword = extractKeywordFromUrl(page.url);
      const keyword =
        targetKeywords[page.id] || page.suggested_keywords?.[0] || autoKeyword;

      newSelectedPages.push({
        id: page.id,
        url: page.url,
        title: page.title,
        pageType: pageTypes[page.id] || page.estimated_type,
        targetKeyword: keyword,
      });

      newPageTypes[page.id] = pageTypes[page.id] || page.estimated_type;
      newTargetKeywords[page.id] = keyword;
    });

    setSelectedPages((prev) => [...prev, ...newSelectedPages]);
    setPageTypes((prev) => ({ ...prev, ...newPageTypes }));
    setTargetKeywords((prev) => ({ ...prev, ...newTargetKeywords }));
  };

  const handleDeselectAllPages = () => {
    setSelectedPages([]);
    setPageTypes({});
    setTargetKeywords({});
  };

  const allCurrentPagesSelected =
    pages.length > 0 && pages.every((page) => isPageSelected(page.id));
  const someCurrentPagesSelected = pages.some((page) =>
    isPageSelected(page.id)
  );

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              isActive={currentPage === totalPages}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(totalPages);
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading discovered pages...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                navigate(`/module/live-seo-fixer/projects/${projectId}`)
              }
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Project
            </Button>
            {mode === "auto" && (
              <Badge variant="secondary" className="text-xs">
                Auto-Selected by Priority
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Select Pages for Audit
          </h1>
          <p className="text-muted-foreground">
            {mode === "auto"
              ? `We've automatically selected ${selectedPages.length} high-priority pages. Adjust page types and add target keywords before starting the audit.`
              : `Found ${
                  pagesResponse?.data?.total_pages || 0
                } pages. Select up to 20 pages to analyze for SEO issues.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{selectedPages.length}/20 selected</Badge>
          <Button
            onClick={handleStartAudit}
            disabled={selectedPages.length === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Starting Audit...
              </>
            ) : (
              `Start Audit (${selectedPages.length} pages)`
            )}
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search pages by URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pages Table */}
      <Card>
        <CardContent className="pt-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              {pages.length} pages found
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllPages}
                disabled={selectedPages.length >= 20}
              >
                Select All (max 20)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeselectAllPages}
                disabled={selectedPages.length === 0}
              >
                Deselect All
              </Button>
            </div>
          </div>
        </CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <span className="sr-only">Select</span>
              </TableHead>
              <TableHead className="w-1/2">URL</TableHead>
              <TableHead className="w-32">Page Type</TableHead>
              <TableHead className="w-48">Target Keyword</TableHead>
              <TableHead className="w-16">
                <ExternalLink className="h-4 w-4" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow
                key={page.id}
                className={isPageSelected(page.id) ? "bg-muted/50" : ""}
              >
                <TableCell>
                  <Checkbox
                    checked={isPageSelected(page.id)}
                    onCheckedChange={(checked) =>
                      handlePageSelect(page, checked as boolean)
                    }
                    disabled={
                      !isPageSelected(page.id) && selectedPages.length >= 20
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm" title={page.url}>
                      {page.url.length > 50
                        ? `${page.url.substring(0, 50)}...`
                        : page.url}
                    </div>
                    {page.suggested_keywords &&
                      page.suggested_keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {page.suggested_keywords
                            .slice(0, 3)
                            .map((keyword, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                {keyword}
                              </Badge>
                            ))}
                        </div>
                      )}
                  </div>
                </TableCell>
                <TableCell>
                  {isPageSelected(page.id) ? (
                    <Select
                      value={pageTypes[page.id] || page.estimated_type}
                      onValueChange={(value) =>
                        handlePageTypeChange(page.id, value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pageTypeOptions.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <span className="capitalize">
                              {type.value.replace(/-/g, " ")}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-muted-foreground text-sm capitalize">
                      {page.estimated_type}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {isPageSelected(page.id) && (
                    <Input
                      placeholder="Target keyword"
                      value={targetKeywords[page.id] || ""}
                      onChange={(e) =>
                        handleKeywordChange(page.id, e.target.value)
                      }
                      className="h-8"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(page.url, "_blank")}
                    className="h-8 w-8 p-0"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {pagesResponse?.data?.total_pages >= 50 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={
                    currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Start Audit Button (Bottom) */}
      {pages.length > 0 && (
        <div className="flex justify-center pb-6">
          <Button
            onClick={handleStartAudit}
            disabled={selectedPages.length === 0 || isSubmitting}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Starting Audit...
              </>
            ) : (
              `Start Audit (${selectedPages.length} pages)`
            )}
          </Button>
        </div>
      )}

      {pages.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No pages found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search query."
                : "No pages were discovered from the provided sitemaps."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PageSelection;
