import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Search,
  Download,
  Star,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Clock,
  CheckCircle,
  Eye,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
interface Feedback {
  id: string;
  campaignType: string;
  campaignName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  rating: number;
  message: string;
  channel: "google" | "facebook" | "yelp" | "direct" | "email";
  submittedDate: string;
  status: "pending" | "reviewed" | "resolved";
  adminNotes?: string;
}
const mockFeedbackData: Feedback[] = [
  {
    id: "1",
    campaignType: "Review Campaign",
    campaignName: "Summer sale 2025",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    customerPhone: "+1 (555) 123-4567",
    rating: 2,
    message: "The service was slow and the staff was not very friendly. Expected much better quality.",
    channel: "google",
    submittedDate: "2025-10-25",
    status: "pending",
  },
  {
    id: "2",
    campaignType: "Survey Campaign",
    campaignName: "Citation service",
    customerName: "Maria Garcia",
    customerEmail: "maria.g@example.com",
    rating: 1,
    message: "Terrible experience! The product arrived damaged and customer support was unhelpful.",
    channel: "facebook",
    submittedDate: "2025-10-24",
    status: "reviewed",
    adminNotes: "Contacted customer via email. Refund processed.",
  },
  {
    id: "3",
    campaignType: "Survey Campaign",
    campaignName: "Web 20 service",
    customerName: "David Chen",
    customerEmail: "david.chen@example.com",
    customerPhone: "+1 (555) 234-5678",
    rating: 2,
    message: "Long waiting time and the order was incorrect. Not impressed at all.",
    channel: "yelp",
    submittedDate: "2025-10-23",
    status: "resolved",
    adminNotes: "Offered 20% discount on next order. Customer satisfied.",
  },
  {
    id: "4",
    campaignType: "Review Campaign",
    campaignName: "common review",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@example.com",
    rating: 1,
    message: "Worst experience ever. Will never come back. Food was cold and tasteless.",
    channel: "direct",
    submittedDate: "2025-10-22",
    status: "pending",
  },
  {
    id: "5",
    campaignType: "Survey Campaign",
    campaignName: "web 20 service",
    customerName: "Michael Brown",
    customerEmail: "m.brown@example.com",
    customerPhone: "+1 (555) 345-6789",
    rating: 2,
    message: "Service was below average. Expected better quality for the price.",
    channel: "email",
    submittedDate: "2025-10-21",
    status: "reviewed",
    adminNotes: "Manager followed up personally. Apologized for inconvenience.",
  },
  {
    id: "6",
    campaignType: "Review Campaign",
    campaignName: "Diwali sale 2025",
    customerName: "Emma Wilson",
    customerEmail: "emma.wilson@example.com",
    rating: 1,
    message: "Extremely disappointed. The product quality was terrible and nothing like advertised.",
    channel: "google",
    submittedDate: "2025-10-20",
    status: "resolved",
    adminNotes: "Full refund issued. Customer appreciated the quick response.",
  },
  {
    id: "7",
    campaignType: "Review Campaign",
    campaignName: "Diwali sale 2025",
    customerName: "James Martinez",
    customerEmail: "j.martinez@example.com",
    rating: 2,
    message: "Poor customer service. Staff seemed uninterested in helping.",
    channel: "facebook",
    submittedDate: "2025-10-19",
    status: "pending",
  },
  {
    id: "8",
    campaignType: "Review Campaign",
    campaignName: "Diwali sale 2025",
    customerName: "Olivia Taylor",
    customerEmail: "olivia.t@example.com",
    customerPhone: "+1 (555) 456-7890",
    rating: 1,
    message: "Horrible experience. The place was dirty and staff was rude.",
    channel: "yelp",
    submittedDate: "2025-10-18",
    status: "reviewed",
    adminNotes: "Deep cleaning scheduled. Staff training planned.",
  },
  {
    id: "9",
    campaignType: "Review Campaign",
    campaignName: "Diwali sale 2025",
    customerName: "William Anderson",
    customerEmail: "w.anderson@example.com",
    rating: 2,
    message: "Not worth the money. Quality has really gone downhill.",
    channel: "direct",
    submittedDate: "2025-10-17",
    status: "pending",
  },
  {
    id: "10",
    campaignType: "Review Campaign",
    campaignName: "Diwali sale 2025",
    customerName: "Sophia Thomas",
    customerEmail: "sophia.thomas@example.com",
    rating: 1,
    message: "Very unsatisfied with the service. Would not recommend to anyone.",
    channel: "email",
    submittedDate: "2025-10-16",
    status: "resolved",
    adminNotes: "Sent apology letter with voucher for free service.",
  },
  {
    id: "11",
    campaignType: "Review Campaign",
    campaignName: "Diwali sale 2025",
    customerName: "Daniel Jackson",
    customerEmail: "d.jackson@example.com",
    customerPhone: "+1 (555) 567-8901",
    rating: 2,
    message: "Mediocre at best. Many better options available nearby.",
    channel: "google",
    submittedDate: "2025-10-15",
    status: "pending",
  },
  {
    id: "12",
    campaignType: "Survey Campaign",
    campaignName: "Diwali sale 2025",
    customerName: "Isabella White",
    customerEmail: "isabella.w@example.com",
    rating: 1,
    message: "Complete disaster. Nothing went right during our visit.",
    channel: "facebook",
    submittedDate: "2025-10-14",
    status: "reviewed",
    adminNotes: "Meeting scheduled with management team.",
  },
  {
    id: "13",
    campaignType: "Review Campaign",
    campaignName: "Diwali sale 2025",
    customerName: "Ethan Harris",
    customerEmail: "ethan.h@example.com",
    rating: 2,
    message: "Disappointed with the overall experience. Expected much more.",
    channel: "yelp",
    submittedDate: "2025-10-13",
    status: "pending",
  },
  {
    id: "14",
    campaignType: "Survey Campaign",
    campaignName: "Diwali sale 2025",
    customerName: "Mia Martin",
    customerEmail: "mia.martin@example.com",
    customerPhone: "+1 (555) 678-9012",
    rating: 1,
    message: "Absolutely terrible. Will be sharing this experience with everyone.",
    channel: "direct",
    submittedDate: "2025-10-12",
    status: "resolved",
    adminNotes: "Compensation package sent. Customer agreed to update review.",
  },
  {
    id: "15",
    campaignType: "Survey Campaign",
    campaignName: "Diwali sale 2025",
    customerName: "Alexander Lee",
    customerEmail: "alex.lee@example.com",
    rating: 2,
    message: "Not up to standard. Many issues that need to be addressed.",
    channel: "email",
    submittedDate: "2025-10-11",
    status: "pending",
  },
];
const Feedback: React.FC = () => {
  const { t } = useTranslation("Reputation/feedback");
  const [feedbackData, setFeedbackData] = useState<Feedback[]>(mockFeedbackData);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [filterChannel, setFilterChannel] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalStatus, setModalStatus] = useState<string>("");
  const [modalNotes, setModalNotes] = useState<string>("");
  const itemsPerPage = 10;
  const totalFeedback = feedbackData.length;
  const averageRating = (feedbackData.reduce((sum, f) => sum + f.rating, 0) / totalFeedback).toFixed(1);
  const pendingCount = feedbackData.filter((f) => f.status === "pending").length;
  const resolvedCount = feedbackData.filter((f) => f.status === "resolved").length;
  const filteredData = feedbackData.filter((feedback) => {
    const matchesSearch =
      feedback.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = filterRating === "all" || feedback.rating === parseInt(filterRating);
    const matchesChannel = filterChannel === "all" || feedback.channel === filterChannel;
    const matchesStatus = filterStatus === "all" || feedback.status === filterStatus;
    return matchesSearch && matchesRating && matchesChannel && matchesStatus;
  });
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const handleViewDetails = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setModalStatus(feedback.status);
    setModalNotes(feedback.adminNotes || "");
    setIsModalOpen(true);
  };
  const handleSaveChanges = () => {
    if (selectedFeedback) {
      setFeedbackData((prev) =>
        prev.map((f) =>
          f.id === selectedFeedback.id
            ? {
              ...f,
              status: modalStatus as any,
              adminNotes: modalNotes,
            }
            : f,
        ),
      );
      toast.success(t("toast.updateSuccess"));
      setIsModalOpen(false);
    }
  };
  const handleExportCSV = () => {
    const headers = ["Customer Name", "Rating", "Message", "Channel", "Submitted Date", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((f) =>
        [f.customerName, f.rating, `"${f.message}"`, f.channel, f.submittedDate, f.status].join(","),
      ),
    ].join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedback-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success(t("toast.exportSuccess"));
  };
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "reviewed":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "resolved":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "";
    }
  };
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>
    );
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("pageTitle")}</h1>
          <p className="text-muted-foreground">{t("pageDescription")}</p>
        </div>

        <Button onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          {t("filters.exportCSV")}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("summary.totalFeedback")}</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFeedback}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("summary.averageRating")}</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating} / 5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("summary.pendingCount")}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("summary.resolvedCount")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t("filters.search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger>
                <SelectValue placeholder={t("filters.rating")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterChannel} onValueChange={setFilterChannel}>
              <SelectTrigger>
                <SelectValue placeholder={t("filters.channel")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="google">{t("channels.google")}</SelectItem>
                <SelectItem value="facebook">{t("channels.facebook")}</SelectItem>
                <SelectItem value="yelp">{t("channels.yelp")}</SelectItem>
                <SelectItem value="direct">{t("channels.direct")}</SelectItem>
                <SelectItem value="email">{t("channels.email")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder={t("filters.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">{t("status.pending")}</SelectItem>
                <SelectItem value="reviewed">{t("status.reviewed")}</SelectItem>
                <SelectItem value="resolved">{t("status.resolved")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>{t("table.customerName")}</TableHead>
                  <TableHead>Campaign Type</TableHead>
                  <TableHead className="max-w-xs">{t("table.review")}</TableHead>
                  <TableHead>{t("table.submittedDate")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead className="text-center">{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <MessageCircle className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">{t("empty.title")}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((feedback) => (
                    <TableRow key={feedback.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{feedback.customerName}</TableCell>
                      <TableCell className="max-w-xs">
                        <p>{feedback.campaignType}</p>
                        <p className="truncate">{feedback.campaignName}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {renderStars(feedback.rating)}
                          <span className="text-sm text-muted-foreground">({feedback.rating})</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>{feedback.submittedDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadgeClass(feedback.status)}>
                          {t(`status.${feedback.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(feedback)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredData.length > 0 && (
            <div className="flex items-center flex-col md:flex-row justify-between px-6 py-4 border-t gap-4">
              <p className="text-sm text-muted-foreground">
                {t("pagination.showing", {
                  from: startIndex + 1,
                  to: Math.min(startIndex + itemsPerPage, filteredData.length),
                  total: filteredData.length,
                })}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <span className="hidden md:block">{t("pagination.previous")}</span>
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <span className="hidden md:block">{t("pagination.next")}</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("modal.title")}</DialogTitle>
          </DialogHeader>

          {selectedFeedback && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">{t("modal.customerInfo")}</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p>
                    <strong>{t("modal.customerName")}:</strong> {selectedFeedback.customerName}
                  </p>
                  {selectedFeedback.customerEmail && (
                    <p>
                      <strong>{t("modal.customerEmail")}:</strong> {selectedFeedback.customerEmail}
                    </p>
                  )}
                  {selectedFeedback.customerPhone && (
                    <p>
                      <strong>{t("modal.customerPhone")}:</strong> {selectedFeedback.customerPhone}
                    </p>
                  )}
                  <p>
                    <strong>{t("modal.channel")}:</strong>{" "}
                    <span className="capitalize">{selectedFeedback.channel}</span>
                  </p>
                  <p>
                    <strong>{t("modal.submittedOn")}:</strong> {selectedFeedback.submittedDate}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t("table.rating")}</h3>
                {renderStars(selectedFeedback.rating)}
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t("modal.feedbackMessage")}</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p>{selectedFeedback.message}</p>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-2">{t("modal.currentStatus")}</label>
                <Select value={modalStatus} onValueChange={setModalStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{t("status.pending")}</SelectItem>
                    <SelectItem value="reviewed">{t("status.reviewed")}</SelectItem>
                    <SelectItem value="resolved">{t("status.resolved")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="font-semibold block mb-2">{t("modal.adminNotes")}</label>
                <Textarea
                  placeholder={t("modal.adminNotesPlaceholder")}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              {t("modal.closeButton")}
            </Button>
            <Button onClick={handleSaveChanges}>{t("modal.saveButton")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Feedback;
