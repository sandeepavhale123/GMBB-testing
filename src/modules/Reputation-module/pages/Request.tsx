import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Mail, MessageSquare, Send, Eye, Inbox, Menu, Plus, Trash2, Link, Pencil } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddContactModal } from "@/modules/Reputation-module/components/AddContactModal";
import { SendReviewRequestModal } from "@/modules/Reputation-module/components/SendReviewRequestModal";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { getAllFormsFromLocalStorage, clearFormFromLocalStorage } from "../utils/formBuilder.utils";

interface Campaign {
  id: string;
  name: string;
  channel: "SMS" | "Email";
  status: "sent" | "pending" | "scheduled";
  date: string;
  contacts: number;
  delivered: number | null;
}

interface Template {
  id: string;
  name: string;
  channel: "SMS" | "Email";
  status: "active" | "draft";
  date: string;
  content?: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addedOn: string;
}

interface FeedbackForm {
  id: string;
  name: string;
  createdAt: string;
  formData?: any;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Winter Blvd",
    channel: "SMS",
    status: "sent",
    date: "25/08/2025",
    contacts: 85,
    delivered: 68,
  },
  {
    id: "2",
    name: "Holiday Fee",
    channel: "Email",
    status: "pending",
    date: "25/08/2025",
    contacts: 115,
    delivered: null,
  },
  {
    id: "3",
    name: "Q1 Customer",
    channel: "SMS",
    status: "sent",
    date: "25/08/2025",
    contacts: 352,
    delivered: 70,
  },
  {
    id: "4",
    name: "Spring Rev",
    channel: "SMS",
    status: "scheduled",
    date: "25/08/2025",
    contacts: 21,
    delivered: null,
  },
];

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Simple Review Request",
    channel: "SMS",
    status: "active",
    date: "25/08/2025",
    content: "Hi {customer_name}, thank you for choosing us! Please share your experience...",
  },
  {
    id: "2",
    name: "Friendly Follow-up",
    channel: "Email",
    status: "draft",
    date: "25/08/2025",
    content: "Dear {customer_name}, we'd love to hear your feedback...",
  },
  {
    id: "3",
    name: "Professional Request",
    channel: "SMS",
    status: "active",
    date: "25/08/2025",
  },
  {
    id: "4",
    name: "Casual & Fun",
    channel: "SMS",
    status: "draft",
    date: "25/08/2025",
  },
];

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Winter Revi",
    phone: "+39 02 3742964",
    email: "winter.revi@example.com",
    addedOn: "25/08/2025",
  },
  {
    id: "2",
    name: "Holiday Fee",
    phone: "+39 0471 10586",
    email: "holiday.fee@example.com",
    addedOn: "25/08/2025",
  },
  {
    id: "3",
    name: "Q1 Custome",
    phone: "+39 0471 10586",
    email: "q1.custome@example.com",
    addedOn: "25/08/2025",
  },
  {
    id: "4",
    name: "Spring Rev",
    phone: "+39 010 437091",
    email: "spring.rev@example.com",
    addedOn: "25/08/2025",
  },
];

const mockFeedbackForms: FeedbackForm[] = [
  {
    id: "1",
    name: "Customer Satisfaction Survey",
    createdAt: "2025-10-20",
  },
  {
    id: "2",
    name: "Service Quality Feedback",
    createdAt: "2025-10-18",
  },
  {
    id: "3",
    name: "Product Feedback Form",
    createdAt: "2025-10-15",
  },
];

const Request: React.FC = () => {
  const { t } = useTranslation("Reputation/request");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("campaign");
  const isMobile = useIsMobile(1024);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);
  const [deleteTemplateName, setDeleteTemplateName] = useState<string>("");
  const [contactViewType, setContactViewType] = useState<"phone" | "email">("phone");
  const [deleteContactId, setDeleteContactId] = useState<string | null>(null);
  const [deleteContactName, setDeleteContactName] = useState<string>("");
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [selectedContactForSend, setSelectedContactForSend] = useState<Contact | null>(null);
  const [feedbackForms, setFeedbackForms] = useState<FeedbackForm[]>([]);
  const [deleteFeedbackFormId, setDeleteFeedbackFormId] = useState<string | null>(null);
  const [deleteFeedbackFormName, setDeleteFeedbackFormName] = useState<string>("");

  // Load feedback forms from localStorage on mount
  useEffect(() => {
    const loadedForms = getAllFormsFromLocalStorage();
    const formattedForms: FeedbackForm[] = loadedForms.map((form) => ({
      id: form.id || "",
      name: form.name,
      createdAt: form.createdAt
        ? new Date(form.createdAt).toLocaleDateString("en-GB")
        : new Date().toLocaleDateString("en-GB"),
      formData: form,
    }));
    setFeedbackForms(formattedForms);
  }, []);

  // Handle tab query parameter on mount
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "templates") {
      setActiveTab("templates");
    } else if (tabParam === "feedbackForms") {
      setActiveTab("feedbackForms");
    }
  }, [searchParams]);

  const getChannelIcon = (channel: "SMS" | "Email") => {
    return channel === "SMS" ? <MessageSquare className="w-4 h-4" /> : <Mail className="w-4 h-4" />;
  };

  const getStatusBadgeClass = (status: Campaign["status"]) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-700 border-green-300";
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "scheduled":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "";
    }
  };

  const calculateDelivered = (delivered: number | null, contacts: number) => {
    if (delivered === null) return "-";
    return `${Math.round((delivered / contacts) * 100)}%`;
  };

  const handleCreateCampaign = () => {
    navigate("/module/reputation/create-campaign");
  };

  const handleViewCampaign = (campaignName: string) => {
    toast.info(`Campaign details view coming soon for "${campaignName}"`);
  };

  const handleCreateTemplate = () => {
    navigate("/module/reputation/create-template");
  };

  const handleViewTemplate = (templateId: string) => {
    navigate(`/module/reputation/edit-template/${templateId}`);
  };

  const handleDeleteTemplate = () => {
    if (deleteTemplateId) {
      toast.success(`${t("templates.deleteDialog.title")}: "${deleteTemplateName}"`);
      setDeleteTemplateId(null);
      setDeleteTemplateName("");
    }
  };

  const handleViewContact = (contactName: string) => {
    toast.info(`Contact details view coming soon for "${contactName}"`);
  };

  const handleDeleteContact = () => {
    if (deleteContactId) {
      setContacts((prev) => prev.filter((contact) => contact.id !== deleteContactId));
      toast.success(`Contact deleted: "${deleteContactName}"`);
      setDeleteContactId(null);
      setDeleteContactName("");
    }
  };

  const handleAddContact = () => {
    setIsAddContactModalOpen(true);
  };

  const handleContactAdded = (newContact: { name: string; countryCode: string; phoneNumber: string }) => {
    const contact: Contact = {
      id: String(contacts.length + 1),
      name: newContact.name,
      phone: `${newContact.countryCode} ${newContact.phoneNumber}`,
      email: undefined,
      addedOn: new Date().toLocaleDateString("en-GB"),
    };
    setContacts((prev) => [...prev, contact]);
  };

  const handleSendReviewRequest = async (contactId: string, templateId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const contact = contacts.find((c) => c.id === contactId);
    const template = mockTemplates.find((t) => t.id === templateId);

    // Show success toast
    toast.success(t("sendReviewRequest.success.title"), {
      description: t("sendReviewRequest.success.description", {
        contactName: contact?.name,
      }),
    });

    // Close modal
    setSendModalOpen(false);
    setSelectedContactForSend(null);
  };

  const handleOpenSendModal = (contact: Contact) => {
    // Check if there are active templates
    const activeTemplates = mockTemplates.filter((t) => t.status === "active");

    if (activeTemplates.length === 0) {
      toast.error(t("sendReviewRequest.title"), {
        description: t("sendReviewRequest.createTemplateFirst"),
      });
      return;
    }

    setSelectedContactForSend(contact);
    setSendModalOpen(true);
  };

  const handleDeleteFeedbackForm = () => {
    if (deleteFeedbackFormId) {
      // Remove from localStorage
      clearFormFromLocalStorage(deleteFeedbackFormId);

      // Update state
      setFeedbackForms((prev) => prev.filter((form) => form.id !== deleteFeedbackFormId));
      toast.success(`Feedback form deleted: "${deleteFeedbackFormName}"`);
      setDeleteFeedbackFormId(null);
      setDeleteFeedbackFormName("");
    }
  };

  const handleCreateFeedbackForm = () => {
    navigate("/module/reputation/create-feedback-form");
  };

  const handleEditFeedbackForm = (formId: string) => {
    navigate(`/module/reputation/edit-feedback-form/${formId}`);
  };

  const handleViewFeedbackForm = (formId: string) => {
    window.open(`/feedback/form/${formId}`, "_blank");
  };

  const getTemplateStatusBadgeClass = (status: Template["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-300";
      case "draft":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "";
    }
  };

  const tabItems = [
    { value: "campaign", label: t("tabs.campaign") },
    { value: "templates", label: t("tabs.templates") },
    { value: "contacts", label: t("tabs.contacts") },
    { value: "reviewLink", label: t("tabs.reviewLink"), isNavigation: true },
    { value: "feedbackForms", label: t("tabs.feedbackForms") },
  ];

  const TabNavigation = () => (
    <nav className="space-y-1">
      {tabItems.map((item) => {
        const isActive = activeTab === item.value;
        return (
          <button
            key={item.value}
            onClick={() => {
              if (item.isNavigation) {
                navigate("/module/reputation/review-link");
                if (isMobile) setIsSheetOpen(false);
              } else {
                setActiveTab(item.value);
                if (isMobile) setIsSheetOpen(false);
              }
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-start ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );

  const renderTabContent = () => {
    if (activeTab === "campaign") {
      return (
        <div className="lg:p-5">
          {/* Campaign Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Campaign</h1>
              <p className="text-muted-foreground mt-1">Send feedback request campaigns to your customers</p>
            </div>
            <Button onClick={handleCreateCampaign}>
              <Plus className="w-4 h-4 mr-1" />
              {t("createButton")}
            </Button>
          </div>

          {mockCampaigns.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <Inbox className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{t("empty.title")}</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">{t("empty.description")}</p>
                  <Button onClick={handleCreateCampaign}>{t("empty.button")}</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-medium">{t("table.name")}</TableHead>
                        <TableHead className="font-medium">{t("table.channel")}</TableHead>
                        <TableHead className="font-medium">{t("table.status")}</TableHead>
                        <TableHead className="font-medium">{t("table.date")}</TableHead>
                        <TableHead className="text-right font-medium">{t("table.contacts")}</TableHead>
                        <TableHead className="text-right font-medium">{t("table.delivered")}</TableHead>
                        <TableHead className="text-center font-medium">{t("table.action")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCampaigns.map((campaign) => (
                        <TableRow key={campaign.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getChannelIcon(campaign.channel)}
                              <span>{t(`channel.${campaign.channel.toLowerCase()}`)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeClass(campaign.status)}>
                              {t(`status.${campaign.status}`)}
                            </Badge>
                          </TableCell>
                          <TableCell>{campaign.date}</TableCell>
                          <TableCell className="text-right">{campaign.contacts}</TableCell>
                          <TableCell className="text-right">
                            {calculateDelivered(campaign.delivered, campaign.contacts)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewCampaign(campaign.name)}
                              aria-label={t("actions.view")}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    if (activeTab === "templates") {
      return (
        <div className="lg:p-5">
          {/* Template Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("templates.title")}</h1>
            </div>
            <Button onClick={handleCreateTemplate}>
              <Plus className="w-4 h-4 mr-1" />
              {t("templates.createButton")}
            </Button>
          </div>

          {mockTemplates.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <Inbox className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{t("templates.empty.title")}</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">{t("templates.empty.description")}</p>
                  <Button onClick={handleCreateTemplate}>{t("templates.empty.button")}</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-medium">{t("templates.table.name")}</TableHead>
                        <TableHead className="font-medium">{t("templates.table.channel")}</TableHead>
                        <TableHead className="font-medium">{t("templates.table.status")}</TableHead>
                        <TableHead className="font-medium">{t("templates.table.date")}</TableHead>
                        <TableHead className="text-right font-medium">{t("templates.table.action")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTemplates.map((template) => (
                        <TableRow key={template.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium">{template.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getChannelIcon(template.channel)}
                              <span>{t(`channel.${template.channel.toLowerCase()}`)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getTemplateStatusBadgeClass(template.status)}>
                              {t(`templates.status.${template.status}`)}
                            </Badge>
                          </TableCell>
                          <TableCell>{template.date}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewTemplate(template.id)}
                                aria-label={t("templates.actions.view")}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setDeleteTemplateId(template.id);
                                  setDeleteTemplateName(template.name);
                                }}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                aria-label={t("templates.actions.delete")}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    // Contacts tab
    if (activeTab === "contacts") {
      return (
        <div className="lg:p-5">
          {/* Header with Toggle and Add Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-foreground">Contacts</h2>
            <div className="flex items-center gap-3">
              {/* Toggle Buttons */}
              <div className="inline-flex rounded-lg border border-border bg-background p-1">
                <Button
                  variant={contactViewType === "phone" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setContactViewType("phone")}
                  className="rounded-md px-4"
                >
                  Contact No
                </Button>
                <Button
                  variant={contactViewType === "email" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setContactViewType("email")}
                  className="rounded-md px-4"
                >
                  Email
                </Button>
              </div>
              {/* Add Button */}
              <Button onClick={handleAddContact} className="bg-blue-500 hover:bg-blue-600">
                Add
              </Button>
            </div>
          </div>

          {/* Contacts Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">{contactViewType === "phone" ? "Phone" : "Email"}</TableHead>
                      <TableHead className="font-semibold">Added on</TableHead>
                      <TableHead className="text-right font-semibold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contactViewType === "phone" ? contact.phone : contact.email}</TableCell>
                        <TableCell>{contact.addedOn}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenSendModal(contact)}
                              aria-label={t("actions.send")}
                              className="text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewContact(contact.name)}
                              aria-label="View contact"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setDeleteContactId(contact.id);
                                setDeleteContactName(contact.name);
                              }}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              aria-label="Delete contact"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Feedback Forms tab
    return (
      <div className="lg:p-5">
        {/* Feedback Forms Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("feedbackForms.title")}</h1>
            <p className="text-muted-foreground mt-1">{t("feedbackForms.description")}</p>
          </div>
          <Button onClick={handleCreateFeedbackForm}>
            <Plus className="w-4 h-4 mr-1" />
            {t("feedbackForms.createButton")}
          </Button>
        </div>

        {feedbackForms.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Inbox className="w-16 h-16 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{t("feedbackForms.empty.title")}</h3>
                <p className="text-muted-foreground max-w-md mx-auto">{t("feedbackForms.empty.description")}</p>
                <Button onClick={handleCreateFeedbackForm}>{t("feedbackForms.empty.button")}</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-medium">{t("feedbackForms.table.name")}</TableHead>
                      <TableHead className="font-medium">{t("feedbackForms.table.createdAt")}</TableHead>
                      <TableHead className="text-right font-medium">{t("feedbackForms.table.action")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedbackForms.map((form) => (
                      <TableRow key={form.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{form.name}</TableCell>
                        <TableCell>{form.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewFeedbackForm(form.id)}
                              aria-label={t("feedbackForms.actions.view")}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditFeedbackForm(form.id)}
                              aria-label={t("feedbackForms.actions.edit")}
                              className="text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setDeleteFeedbackFormId(form.id);
                                setDeleteFeedbackFormName(form.name);
                              }}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              aria-label={t("feedbackForms.actions.delete")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Delete Template Confirmation Dialog */}
      <AlertDialog
        open={deleteTemplateId !== null}
        onOpenChange={() => {
          setDeleteTemplateId(null);
          setDeleteTemplateName("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("templates.deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("templates.deleteDialog.description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("templates.deleteDialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTemplate} className="bg-destructive hover:bg-destructive/90">
              {t("templates.deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Contact Confirmation Dialog */}
      <AlertDialog
        open={deleteContactId !== null}
        onOpenChange={() => {
          setDeleteContactId(null);
          setDeleteContactName("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteContactName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContact} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Feedback Form Confirmation Dialog */}
      <AlertDialog
        open={deleteFeedbackFormId !== null}
        onOpenChange={() => {
          setDeleteFeedbackFormId(null);
          setDeleteFeedbackFormName("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("feedbackForms.deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("feedbackForms.deleteDialog.description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("feedbackForms.deleteDialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFeedbackForm} className="bg-destructive hover:bg-destructive/90">
              {t("feedbackForms.deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
        {/* Mobile Menu Button */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 bg-white border border-border rounded-lg lg:hidden">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{t("title")}</h3>
            </div>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground">{t("title")}</h3>
                </div>
                <TabNavigation />
              </SheetContent>
            </Sheet>
          </div>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="w-48 bg-white border border-border rounded-lg p-4" style={{ minWidth: "192px" }}>
            <TabNavigation />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-lg">{renderTabContent()}</div>
      </div>

      {/* Add Contact Modal */}
      <AddContactModal
        open={isAddContactModalOpen}
        onOpenChange={setIsAddContactModalOpen}
        onContactAdded={handleContactAdded}
      />

      {/* Send Review Request Modal */}
      <SendReviewRequestModal
        open={sendModalOpen}
        onOpenChange={setSendModalOpen}
        contact={selectedContactForSend}
        templates={mockTemplates.filter((t) => t.status === "active")}
        onSend={handleSendReviewRequest}
      />
    </div>
  );
};

export default Request;
