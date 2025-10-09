import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Loader2 } from "lucide-react";
import { projectService } from "@/services/liveSeoFixer/projectService";
import { pageTypeService } from "@/services/liveSeoFixer/pageTypeService";
import type { PageSelection as PageSelectionType } from "../types";
import { useDebounce } from "@/hooks/useDebounce";

export const PageSelection: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auditId = searchParams.get("auditId");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedPages, setSelectedPages] = useState<Map<string, PageSelectionType>>(
    new Map()
  );

  const debouncedSearch = useDebounce(search, 300);

  const { data: pagesData, isLoading } = useQuery({
    queryKey: ["seo-discovered-pages", projectId, auditId, page, debouncedSearch],
    queryFn: () =>
      projectService.getDiscoveredPages(projectId!, auditId!, page, 20, debouncedSearch),
    enabled: !!projectId && !!auditId,
  });

  const { data: pageTypes } = useQuery({
    queryKey: ["seo-page-types"],
    queryFn: pageTypeService.getSupportedPageTypes,
    staleTime: Infinity,
  });

  const startAuditMutation = useMutation({
    mutationFn: (pages: PageSelectionType[]) =>
      projectService.startAudit(projectId!, auditId!, pages),
    onSuccess: () => {
      toast.success("Audit started successfully");
      navigate(`/module/live-seo-fixer/projects/${projectId}/audit-progress`);
    },
    onError: () => {
      toast.error("Failed to start audit");
    },
  });

  const handleToggleSelect = (pageId: string, url: string) => {
    setSelectedPages((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(pageId)) {
        newMap.delete(pageId);
      } else {
        if (newMap.size >= 10) {
          toast.error("You can select up to 10 pages only");
          return prev;
        }
        newMap.set(pageId, {
          pageId,
          url,
          pageType: "",
          targetKeyword: "",
        });
      }
      return newMap;
    });
  };

  const handleUpdateSelection = (
    pageId: string,
    field: "pageType" | "targetKeyword",
    value: string
  ) => {
    setSelectedPages((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(pageId);
      if (existing) {
        newMap.set(pageId, { ...existing, [field]: value });
      }
      return newMap;
    });
  };

  const handleStartAudit = () => {
    const pages = Array.from(selectedPages.values());
    
    // Validate all pages have required fields
    const invalid = pages.filter((p) => !p.pageType || !p.targetKeyword);
    if (invalid.length > 0) {
      toast.error("Please fill page type and target keyword for all selected pages");
      return;
    }

    if (pages.length === 0) {
      toast.error("Please select at least one page");
      return;
    }

    startAuditMutation.mutate(pages);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Select Pages for Audit</h1>
        <p className="text-muted-foreground mt-1">
          Choose up to 10 pages from your sitemap to audit. Assign page types and target keywords.
        </p>
      </div>

      {/* Selected Count */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Selected: <span className="font-bold text-foreground">{selectedPages.size}/10</span>
            </p>
            <Button
              onClick={handleStartAudit}
              disabled={selectedPages.size === 0 || startAuditMutation.isPending}
            >
              {startAuditMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Start Audit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search pages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Discovered Pages ({pagesData?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Select</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="w-48">Page Type</TableHead>
                <TableHead className="w-48">Target Keyword</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : pagesData?.pages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No pages found
                  </TableCell>
                </TableRow>
              ) : (
                pagesData?.pages.map((pageItem) => {
                  const isSelected = selectedPages.has(pageItem.id);
                  const selection = selectedPages.get(pageItem.id);

                  return (
                    <TableRow key={pageItem.id}>
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() =>
                            handleToggleSelect(pageItem.id, pageItem.url)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{pageItem.url}</TableCell>
                      <TableCell>
                        {isSelected && (
                          <Select
                            value={selection?.pageType}
                            onValueChange={(value) =>
                              handleUpdateSelection(pageItem.id, "pageType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {pageTypes?.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        {isSelected && (
                          <Input
                            placeholder="Enter keyword"
                            value={selection?.targetKeyword}
                            onChange={(e) =>
                              handleUpdateSelection(
                                pageItem.id,
                                "targetKeyword",
                                e.target.value
                              )
                            }
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagesData && pagesData.total > 20 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {page} of {Math.ceil(pagesData.total / 20)}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(pagesData.total / 20)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Action */}
      {selectedPages.size > 0 && (
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleStartAudit}
            disabled={startAuditMutation.isPending}
          >
            {startAuditMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Start Audit ({selectedPages.size} pages)
          </Button>
        </div>
      )}
    </div>
  );
};
