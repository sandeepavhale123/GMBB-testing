import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { useListingContext } from "../../context/ListingContext";
import { useScheduledPosts } from "../../hooks/useScheduledPosts";
import { useNavigate, useParams } from "react-router-dom";
import { formatScheduledDate } from "../../utils/dateUtils";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  scheduledDate: string;
  image: string;
}

interface ScheduledPostCardProps {
  onApprovePost: (post: ScheduledPost) => void;
}

export const ScheduledPostCard: React.FC<ScheduledPostCardProps> = ({
  onApprovePost,
}) => {
  const { t } = useI18nNamespace("Dashboard/scheduledPostCard");
  const { selectedListing } = useListingContext();
  const { listingId } = useParams();
  const navigate = useNavigate();

  const { scheduledPosts, loading, error } = useScheduledPosts(
    selectedListing?.id ? parseInt(selectedListing.id) : null,
    5 // Limit to 5 posts for dashboard
  );

  const handleViewAll = () => {
    if (listingId) {
      navigate(`/posts/${listingId}?filter=scheduled`);
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">{t("title")}</span>
          </div>
          <Button
            variant="link"
            className="text-xs sm:text-sm p-0 h-auto"
            onClick={handleViewAll}
          >
            {t("viewAll")}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex gap-3 p-3">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-600 mb-2">{t()}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              {t("loading.retry")}
            </Button>
          </div>
        ) : scheduledPosts.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-500 mb-2">{t("empty.title")}</p>
            <p className="text-xs text-gray-400">{t("empty.subtitle")}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">
                      {t("table.postImage")}
                    </TableHead>
                    <TableHead>{t("table.postDescription")}</TableHead>
                    <TableHead className="w-40">
                      {t("table.scheduledDate")}
                    </TableHead>
                    <TableHead className="w-32 text-right">
                      {t("table.action")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm">{post.title}</h4>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {post.content}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{formatScheduledDate(post.scheduledDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => onApprovePost(post)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {scheduledPosts.map((post) => (
                <Card key={post.id} className="border border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {post.title}
                          </h4>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 flex-shrink-0"
                            onClick={() => onApprovePost(post)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatScheduledDate(post.scheduledDate)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
