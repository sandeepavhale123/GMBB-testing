import React, { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  ArrowLeft,
  FileText,
  File,
  Globe,
  Mail,
  Clock,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Calendar as CalendarLucide } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BulkReplyListingSelector } from "@/components/BulkAutoReply/BulkReplyListingSelector";
import { type ReportSectionId } from "@/types/reportTypes";
import { useToast } from "@/hooks/use-toast";
import { reportsApi } from "@/api/reportsApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

// Force refresh - Specific report sections for bulk report generation
type GenerateBulkReportProps = {
  isSingleListingDashboard?: boolean; // make it optional
};

export const GenerateBulkReport: React.FC<GenerateBulkReportProps> = ({
  isSingleListingDashboard = false,
}) => {
  const { t } = useI18nNamespace("MultidashboardPages/generateBulkReport");

  const generateBulkReportSchema = z
    .object({
      projectName: z
        .string()
        .min(1, t("GenerateBulkReport.validation.projectNameRequired")),
      selectedListings: z
        .array(z.string())
        .min(1, t("GenerateBulkReport.validation.selectedListingsRequired")),
      reportSections: z
        .array(z.string())
        .min(1, t("GenerateBulkReport.validation.reportSectionsRequired")),
      scheduleType: z.enum(["one-time", "weekly", "monthly"]),
      frequency: z.string().optional(),
      emailWeek: z.string().optional(),
      emailDay: z.string().optional(),
      fromDate: z.date().optional(),
      toDate: z.date().optional(),
      deliveryFormat: z
        .array(z.enum(["csv", "pdf", "html"]))
        .min(1, t("GenerateBulkReport.validation.deliveryFormatRequired")),
      emailTo: z
        .string()
        .min(1, t("GenerateBulkReport.validation.emailToRequired"))
        .refine(
          (value) => {
            const emails = value.split(",").map((email) => email.trim());
            return emails.every(
              (email) =>
                email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            );
          },
          { message: t("GenerateBulkReport.validation.invalidEmails") }
        ),
      emailCc: z
        .string()
        .optional()
        .refine(
          (value) => {
            if (!value || value.trim() === "") return true;
            const emails = value.split(",").map((email) => email.trim());
            return emails.every(
              (email) =>
                email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            );
          },
          { message: t("GenerateBulkReport.validation.invalidEmails") }
        ),
      emailBcc: z
        .string()
        .optional()
        .refine(
          (value) => {
            if (!value || value.trim() === "") return true;
            const emails = value.split(",").map((email) => email.trim());
            return emails.every(
              (email) =>
                email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            );
          },
          { message: t("GenerateBulkReport.validation.invalidEmails") }
        ),
      emailSubject: z
        .string()
        .min(1, t("GenerateBulkReport.validation.emailSubjectRequired")),
      emailMessage: z
        .string()
        .min(1, t("GenerateBulkReport.validation.emailMessageRequired")),
    })
    .superRefine((data, ctx) => {
      // Individual field validation based on schedule type
      if (data.scheduleType === "one-time") {
        if (!data.fromDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("GenerateBulkReport.validation.fromDateRequired"),
            path: ["fromDate"],
          });
        }
        if (!data.toDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("GenerateBulkReport.validation.toDateRequired"),
            path: ["toDate"],
          });
        }
      }

      if (data.scheduleType === "weekly" || data.scheduleType === "monthly") {
        if (!data.frequency) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("GenerateBulkReport.validation.frequencyRequired"),
            path: ["frequency"],
          });
        }
        if (!data.emailDay) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("GenerateBulkReport.validation.emailDayRequired"),
            path: ["emailDay"],
          });
        }
      }

      if (data.scheduleType === "monthly" && !data.emailWeek) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("GenerateBulkReport.validation.emailWeekRequired"),
          path: ["emailWeek"],
        });
      }
    });

  type GenerateBulkReportForm = z.infer<typeof generateBulkReportSchema>;
  const BULK_REPORT_SECTIONS = [
    { id: "posts", name: t("GenerateBulkReport.reportTypes.sections.posts") },
    { id: "media", name: t("GenerateBulkReport.reportTypes.sections.media") },
    {
      id: "reviews",
      name: t("GenerateBulkReport.reportTypes.sections.reviews"),
    },
    { id: "qa", name: t("GenerateBulkReport.reportTypes.sections.qa") },
    {
      id: "insights",
      name: t("GenerateBulkReport.reportTypes.sections.insights"),
    },
  ] as const;

  const weeklyFrequencyOptions = [
    {
      value: "last-week",
      label: t("GenerateBulkReport.scheduleConfig.frequencies.lastWeek"),
    },
    {
      value: "last-2-weeks",
      label: t("GenerateBulkReport.scheduleConfig.frequencies.last2Weeks"),
    },
    {
      value: "last-3-weeks",
      label: t("GenerateBulkReport.scheduleConfig.frequencies.last3Weeks"),
    },
    {
      value: "last-4-weeks",
      label: t("GenerateBulkReport.scheduleConfig.frequencies.last4Weeks"),
    },
    {
      value: "last-5-weeks",
      label: t("GenerateBulkReport.scheduleConfig.frequencies.last5Weeks"),
    },
  ];

  const monthlyFrequencyOptions = [
    {
      value: "last-month",
      label: t("GenerateBulkReport.scheduleConfig.frequencies.lastMonth"),
    },
    {
      value: "last-2-months",
      label: t("GenerateBulkReport.scheduleConfig.frequencies.last2Months"),
    },
    {
      value: "last-3-months",
      label: t("GenerateBulkReport.scheduleConfig.frequencies.last3Months"),
    },
    {
      value: "last-6-months",
      label: t("GenerateBulkReport.scheduleConfig.frequencies.last6Months"),
    },
    {
      value: "last-12-months",
      label: t("GenerateBulkReport.scheduleConfig.frequencies.last2Weeks"),
    },
  ];

  const weekDays = [
    {
      value: "monday",
      label: t("GenerateBulkReport.scheduleConfig.days.monday"),
    },
    {
      value: "tuesday",
      label: t("GenerateBulkReport.scheduleConfig.days.tuesday"),
    },
    {
      value: "wednesday",
      label: t("GenerateBulkReport.scheduleConfig.days.wednesday"),
    },
    {
      value: "thursday",
      label: t("GenerateBulkReport.scheduleConfig.days.thursday"),
    },
    {
      value: "friday",
      label: t("GenerateBulkReport.scheduleConfig.days.friday"),
    },
    {
      value: "saturday",
      label: t("GenerateBulkReport.scheduleConfig.days.saturday"),
    },
    {
      value: "sunday",
      label: t("GenerateBulkReport.scheduleConfig.days.sunday"),
    },
  ];

  const weekOptions = [
    {
      value: "first",
      label: t("GenerateBulkReport.scheduleConfig.weekOptions.first"),
    },
    {
      value: "second",
      label: t("GenerateBulkReport.scheduleConfig.weekOptions.second"),
    },
    {
      value: "third",
      label: t("GenerateBulkReport.scheduleConfig.weekOptions.third"),
    },
    {
      value: "fourth",
      label: t("GenerateBulkReport.scheduleConfig.weekOptions.first"),
    },
    {
      value: "last",
      label: t("GenerateBulkReport.scheduleConfig.weekOptions.last"),
    },
  ];

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Section refs for auto-scrolling
  const reportDetailsRef = useRef<HTMLDivElement>(null);
  const reportTypesRef = useRef<HTMLDivElement>(null);
  const scheduleConfigRef = useRef<HTMLDivElement>(null);
  const deliveryFormatRef = useRef<HTMLDivElement>(null);
  const emailComposerRef = useRef<HTMLDivElement>(null);
  const form = useForm<GenerateBulkReportForm>({
    resolver: zodResolver(generateBulkReportSchema),
    defaultValues: {
      projectName: "",
      selectedListings: [],
      reportSections: [],
      scheduleType: "one-time",
      deliveryFormat: ["pdf"],
      emailTo: "",
      emailCc: "",
      emailBcc: "",
      emailSubject: "Your Generated Reports - {projectName}",
      emailMessage:
        "As requested, we’ve generated the following Google My Business (GMB) reports.",
    },
  });
  const watchScheduleType = form.watch("scheduleType");
  const watchReportSections = form.watch("reportSections");
  const watchSelectedListings = form.watch("selectedListings");
  const watchProjectName = form.watch("projectName");

  // Update email subject when project name changes
  useEffect(() => {
    const currentSubject = form.getValues("emailSubject");
    if (watchProjectName && watchProjectName.trim() !== "") {
      // Update the subject to include the new project name
      const newSubject = `Your Generated Reports - ${watchProjectName}`;
      form.setValue("emailSubject", newSubject);
    }
  }, [watchProjectName, form]);
  const handleReportSectionChange = (sectionId: string, checked: boolean) => {
    const currentSections = form.getValues("reportSections");
    if (checked) {
      form.setValue("reportSections", [...currentSections, sectionId]);
    } else {
      form.setValue(
        "reportSections",
        currentSections.filter((id) => id !== sectionId)
      );
    }
  };
  const handleSelectAllReports = () => {
    const allSectionIds = BULK_REPORT_SECTIONS.map((section) => section.id);
    form.setValue("reportSections", allSectionIds);
  };
  const handleDeselectAllReports = () => {
    form.setValue("reportSections", []);
  };

  // Field to section mapping for auto-scroll
  const fieldToSectionMap: Record<string, React.RefObject<HTMLDivElement>> = {
    projectName: reportDetailsRef,
    selectedListings: reportDetailsRef,
    reportSections: reportTypesRef,
    scheduleType: scheduleConfigRef,
    fromDate: scheduleConfigRef,
    toDate: scheduleConfigRef,
    frequency: scheduleConfigRef,
    emailWeek: scheduleConfigRef,
    emailDay: scheduleConfigRef,
    deliveryFormat: deliveryFormatRef,
    emailTo: emailComposerRef,
    emailSubject: emailComposerRef,
    emailMessage: emailComposerRef,
  };

  const scrollToFirstError = () => {
    const { isValid } = form.formState;
    if (isValid) return;

    const errors = form.formState.errors;

    // Dynamic field-to-section mapping based on schedule type
    const currentScheduleType = watchScheduleType;

    const getFieldToSectionMap = () => {
      const baseMap: Record<string, React.RefObject<HTMLDivElement>> = {
        projectName: reportDetailsRef,
        selectedListings: reportDetailsRef,
        reportSections: reportTypesRef,
        deliveryFormat: deliveryFormatRef,
        emailTo: emailComposerRef,
        emailCc: emailComposerRef,
        emailBcc: emailComposerRef,
        emailSubject: emailComposerRef,
        emailMessage: emailComposerRef,
      };

      // Add schedule-specific field mappings
      if (currentScheduleType === "one-time") {
        baseMap["fromDate"] = scheduleConfigRef;
        baseMap["toDate"] = scheduleConfigRef;
      } else if (
        currentScheduleType === "weekly" ||
        currentScheduleType === "monthly"
      ) {
        baseMap["frequency"] = scheduleConfigRef;
        baseMap["emailDay"] = scheduleConfigRef;
        if (currentScheduleType === "monthly") {
          baseMap["emailWeek"] = scheduleConfigRef;
        }
      }

      return baseMap;
    };

    const dynamicFieldToSectionMap = getFieldToSectionMap();

    // Define field priority order based on form flow
    const fieldPriority = [
      "projectName",
      "selectedListings",
      "reportSections",
      ...(currentScheduleType === "one-time" ? ["fromDate", "toDate"] : []),
      ...(currentScheduleType === "weekly" || currentScheduleType === "monthly"
        ? ["frequency", "emailDay"]
        : []),
      ...(currentScheduleType === "monthly" ? ["emailWeek"] : []),
      "deliveryFormat",
      "emailTo",
      "emailSubject",
      "emailMessage",
    ];

    // Find the first error field based on priority
    let firstErrorField = null;
    for (const field of fieldPriority) {
      if (errors[field as keyof typeof errors]) {
        firstErrorField = field;
        break;
      }
    }

    // If no priority field found, check all error fields
    if (!firstErrorField) {
      const errorFields = Object.keys(errors);
      if (errorFields.length > 0) {
        // Try to find a field that maps to a section
        for (const field of errorFields) {
          if (dynamicFieldToSectionMap[field]) {
            firstErrorField = field;
            break;
          }
        }
        // Fallback to first error field
        if (!firstErrorField) {
          firstErrorField = errorFields[0];
        }
      }
    }

    if (firstErrorField) {
      const targetSection = dynamicFieldToSectionMap[firstErrorField];

      if (targetSection?.current) {
        // Scroll with proper offset for headers
        const headerOffset = 120;
        const elementPosition =
          targetSection.current.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Add visual feedback and focus
        setTimeout(() => {
          // Add temporary highlight to the section
          targetSection.current?.classList.add(
            "ring-2",
            "ring-destructive",
            "ring-opacity-50",
            "rounded-lg"
          );
          setTimeout(() => {
            targetSection.current?.classList.remove(
              "ring-2",
              "ring-destructive",
              "ring-opacity-50",
              "rounded-lg"
            );
          }, 2500);

          // Find and focus the specific field with error
          const fieldSelector = `[name="${firstErrorField}"], [data-field="${firstErrorField}"]`;
          let focusableElement = targetSection.current?.querySelector(
            fieldSelector
          ) as HTMLElement;

          // Fallback: find any input with error in this section
          if (!focusableElement) {
            focusableElement = targetSection.current?.querySelector(
              '[aria-invalid="true"]'
            ) as HTMLElement;
          }

          // Fallback: find first focusable element in section
          if (!focusableElement) {
            focusableElement = targetSection.current?.querySelector(
              'input, select, textarea, button[role="combobox"]'
            ) as HTMLElement;
          }

          if (focusableElement) {
            // For select components, look for the trigger button
            if (
              focusableElement.getAttribute("role") === "combobox" ||
              focusableElement.tagName === "SELECT"
            ) {
              const trigger =
                focusableElement.closest('[role="combobox"]') ||
                focusableElement;
              (trigger as HTMLElement)?.focus();
            } else {
              focusableElement.focus();
            }
          }
        }, 400);
      } else {
        // Fallback: scroll to first available section with errors
        const allSections = [
          reportDetailsRef,
          reportTypesRef,
          scheduleConfigRef,
          deliveryFormatRef,
          emailComposerRef,
        ];
        for (const section of allSections) {
          if (
            section.current &&
            section.current.querySelector(
              '[aria-invalid="true"], .text-destructive'
            )
          ) {
            section.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            break;
          }
        }
      }
    }
  };

  const onSubmit = async (data: GenerateBulkReportForm) => {
    // Check for validation errors and scroll to first error if any
    const isValid = await form.trigger();
    if (!isValid) {
      scrollToFirstError();
      return;
    }

    setIsSubmitting(true);
    try {
      // Transform form data to API format
      const apiPayload = {
        reportTitle: data.projectName,
        selectedListings: data.selectedListings,
        reportSections: data.reportSections,
        scheduleType:
          data.scheduleType === "one-time"
            ? "one-time"
            : data.scheduleType === "weekly"
            ? "weekly"
            : "monthly",
        frequency: data.frequency,
        emailWeek: data.emailWeek,
        emailDay: data.emailDay,
        formDate: data.fromDate
          ? format(data.fromDate, "yyyy-MM-dd")
          : undefined,
        toDate: data.toDate ? format(data.toDate, "yyyy-MM-dd") : undefined,
        deliveryFormat: data.deliveryFormat,
        emailTo: data.emailTo,
        emailCc: data.emailCc,
        emailBcc: data.emailBcc,
        emailSubject: data.emailSubject,
        emailMessage: data.emailMessage,
      };

      const response = await reportsApi.createBulkReport(apiPayload);

      toast({
        title: t("GenerateBulkReport.toasts.reportCreatedTitle"),
        description: t("GenerateBulkReport.toasts.reportCreatedDescription", {
          projectName: data.projectName,
          projectId: response.data.projectId,
        }),
        //  `${data.projectName} has been successfully created with project ID: ${response.data.projectId}`,
      });

      // Invalidate bulk reports query to refresh the reports table
      queryClient.invalidateQueries({ queryKey: ["bulk-reports"] });

      const redirectPath = isSingleListingDashboard
        ? "/bulk-reports"
        : "/main-dashboard/reports";

      navigate(redirectPath);
    } catch (error: any) {
      toast({
        title: t("GenerateBulkReport.toasts.errorTitle"),
        description:
          error.response.data.message ||
          error.message ||
          t("GenerateBulkReport.toasts.errorMessage"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const getFrequencyOptions = () => {
    return watchScheduleType === "weekly"
      ? weeklyFrequencyOptions
      : monthlyFrequencyOptions;
  };
  const getDeliveryFormatIcon = (format: string) => {
    switch (format) {
      case "csv":
        return <File className="w-4 h-4" />;
      case "pdf":
        return <FileText className="w-4 h-4" />;
      case "html":
        return <Globe className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("GenerateBulkReport.pageTitle")}
          </h1>
          <p className="text-muted-foreground">
            {t("GenerateBulkReport.pageDescription")}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Report Details */}
          <Card ref={reportDetailsRef}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t("GenerateBulkReport.reportDetails.title")}
              </CardTitle>
              <CardDescription>
                {t("GenerateBulkReport.reportDetails.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("GenerateBulkReport.reportDetails.reportTitleLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "GenerateBulkReport.reportDetails.reportTitlePlaceholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selectedListings"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-3">
                      {/* <Label className="text-sm font-medium">Select Locations</Label> */}

                      <div className="space-y-3">
                        <BulkReplyListingSelector
                          selectedListings={field.value}
                          onListingsChange={field.onChange}
                          hideStatusBadges={true}
                        />

                        <div className="flex items-center justify-end">
                          <Badge variant="outline" className="text-xs">
                            {t(
                              "GenerateBulkReport.reportDetails.locationsSelected",
                              { count: watchSelectedListings.length }
                            )}
                            {/* {watchSelectedListings.length} locations selected */}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Report Types */}
          <Card ref={reportTypesRef}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="w-5 h-5" />
                {t("GenerateBulkReport.reportTypes.title")}
              </CardTitle>
              <CardDescription>
                {t("GenerateBulkReport.reportTypes.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <Label className="text-sm font-medium">
                    {t("GenerateBulkReport.reportTypes.availableReports")}
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllReports}
                    >
                      {t("GenerateBulkReport.reportTypes.selectAll")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAllReports}
                    >
                      {t("GenerateBulkReport.reportTypes.deselectAll")}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {BULK_REPORT_SECTIONS.map((section) => (
                    <div
                      key={section.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() =>
                        handleReportSectionChange(
                          section.id,
                          !watchReportSections.includes(section.id)
                        )
                      }
                    >
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          id={section.id}
                          checked={watchReportSections.includes(section.id)}
                          onCheckedChange={(checked) =>
                            handleReportSectionChange(
                              section.id,
                              checked as boolean
                            )
                          }
                        />
                      </div>
                      <Label
                        htmlFor={section.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {section.name}
                      </Label>
                    </div>
                  ))}
                </div>

                <FormField
                  control={form.control}
                  name="reportSections"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Schedule Configuration */}
          <Card ref={scheduleConfigRef}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarLucide className="w-5 h-5" />
                {t("GenerateBulkReport.scheduleConfig.title")}
              </CardTitle>
              <CardDescription>
                {t("GenerateBulkReport.scheduleConfig.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="scheduleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("GenerateBulkReport.scheduleConfig.scheduleTypeLabel")}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="one-time" id="one-time" />
                          <Label htmlFor="one-time">
                            {t(
                              "GenerateBulkReport.scheduleConfig.scheduleTypes.oneTime"
                            )}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="weekly" id="weekly" />
                          <Label htmlFor="weekly">
                            {t(
                              "GenerateBulkReport.scheduleConfig.scheduleTypes.weekly"
                            )}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <Label htmlFor="monthly">
                            {t(
                              "GenerateBulkReport.scheduleConfig.scheduleTypes.monthly"
                            )}
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchScheduleType === "one-time" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fromDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          {t("GenerateBulkReport.scheduleConfig.fromDateLabel")}
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>
                                    {t(
                                      "GenerateBulkReport.scheduleConfig.fromDatePlaceholder"
                                    )}
                                  </span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date()}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="toDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          {t("GenerateBulkReport.scheduleConfig.toDateLabel")}
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>
                                    {t(
                                      "GenerateBulkReport.scheduleConfig.toDatePlaceholder"
                                    )}
                                  </span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date()}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {(watchScheduleType === "weekly" ||
                watchScheduleType === "monthly") && (
                <div className="flex flex-col md:flex-row gap-4 w-full md:[&>*]:flex-1">
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "GenerateBulkReport.scheduleConfig.selectFrequency"
                          )}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  "GenerateBulkReport.scheduleConfig.selectFrequencyPlaceholder"
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getFrequencyOptions().map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchScheduleType === "monthly" && (
                    <FormField
                      control={form.control}
                      name="emailWeek"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("GenerateBulkReport.scheduleConfig.selectWeek")}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    "GenerateBulkReport.scheduleConfig.selectWeekPlaceholder"
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {weekOptions.map((week) => (
                                <SelectItem key={week.value} value={week.value}>
                                  {week.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="emailDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("GenerateBulkReport.scheduleConfig.selectDay")}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  "GenerateBulkReport.scheduleConfig.selectDayPlaceholder"
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {weekDays.map((day) => (
                              <SelectItem key={day.value} value={day.value}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Format */}
          <Card ref={deliveryFormatRef}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t("GenerateBulkReport.deliveryFormat.title")}
              </CardTitle>
              <CardDescription>
                {watchSelectedListings.length === 1
                  ? t("GenerateBulkReport.deliveryFormat.descriptionSingle")
                  : t("GenerateBulkReport.deliveryFormat.descriptionMultiple")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="deliveryFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col md:flex-row gap-4">
                        {[
                          {
                            value: "csv",
                            label: t("GenerateBulkReport.deliveryFormat.csv"),
                            icon: File,
                          },
                          {
                            value: "pdf",
                            label: t("GenerateBulkReport.deliveryFormat.pdf"),
                            icon: FileText,
                          },
                          {
                            value: "html",
                            label: t("GenerateBulkReport.deliveryFormat.html"),
                            icon: Globe,
                          },
                        ].map((format) => {
                          const isSelected = field.value.includes(
                            format.value as "csv" | "pdf" | "html"
                          );
                          return (
                            <div
                              key={format.value}
                              className={`flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors flex-1 cursor-pointer ${
                                isSelected ? "bg-accent border-primary" : ""
                              }`}
                              onClick={() => {
                                const currentFormats = field.value;
                                if (isSelected) {
                                  field.onChange(
                                    currentFormats.filter(
                                      (f) => f !== format.value
                                    )
                                  );
                                } else {
                                  // If multiple listings selected, only allow one format at a time
                                  if (watchSelectedListings.length > 1) {
                                    field.onChange([format.value]);
                                  } else {
                                    // Single listing: allow multiple formats
                                    field.onChange([
                                      ...currentFormats,
                                      format.value,
                                    ]);
                                  }
                                }
                              }}
                            >
                              <div
                                className={`w-4 h-4 border rounded flex items-center justify-center ${
                                  isSelected
                                    ? "bg-primary border-primary"
                                    : "border-input"
                                }`}
                              >
                                {isSelected && (
                                  <svg
                                    className="w-3 h-3 text-primary-foreground"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <format.icon className="w-4 h-4" />
                                <Label className="cursor-pointer">
                                  {format.label}
                                </Label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </FormControl>
                    {/* Selection behavior note */}
                    <div className="mt-3 p-3 bg-muted/50 rounded-md border-l-4 border-primary/30">
                      <div className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="text-sm text-muted-foreground">
                          <strong className="text-foreground">
                            {t(
                              "GenerateBulkReport.deliveryFormat.selectionGuide"
                            )}
                          </strong>
                          {watchSelectedListings.length === 1 ? (
                            <span>
                              {t(
                                "GenerateBulkReport.deliveryFormat.selectionNoteSingle"
                              )}
                            </span>
                          ) : (
                            <span>
                              {t(
                                "GenerateBulkReport.deliveryFormat.selectionNoteMultiple"
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Email Composer */}
          <Card ref={emailComposerRef}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                {t("GenerateBulkReport.emailComposer.title")}
              </CardTitle>
              <CardDescription>
                {t("GenerateBulkReport.emailComposer.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="emailTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("GenerateBulkReport.emailComposer.to")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "GenerateBulkReport.emailComposer.toPlaceholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailCc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("GenerateBulkReport.emailComposer.cc")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "GenerateBulkReport.emailComposer.ccPlaceholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailBcc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("GenerateBulkReport.emailComposer.bcc")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "GenerateBulkReport.emailComposer.bccPlaceholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="emailSubject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("GenerateBulkReport.emailComposer.subject")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "GenerateBulkReport.emailComposer.subjectPlaceholder",
                          { projectName: watchProjectName || "Report Title" }
                        )}
                        // {`Your Generated Reports - ${
                        //   watchProjectName || "Report Title"
                        // }`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("GenerateBulkReport.emailComposer.message")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          "GenerateBulkReport.emailComposer.messagePlaceholder"
                        )}
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/main-dashboard/reports")}
            >
              {t("GenerateBulkReport.actions.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Send className="w-4 h-4 mr-1" />
                  {t("GenerateBulkReport.actions.creating")}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-1" />
                  {t("GenerateBulkReport.actions.create")}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
