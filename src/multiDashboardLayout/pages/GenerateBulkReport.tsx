import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ArrowLeft, FileText, File, Globe, Mail, Calendar, Clock, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BulkReplyListingSelector } from "@/components/BulkAutoReply/BulkReplyListingSelector";
import { REPORT_SECTIONS, type ReportSectionId } from "@/types/reportTypes";
import { useToast } from "@/hooks/use-toast";
const weeklyFrequencyOptions = [{
  value: "last-week",
  label: "Last Week"
}, {
  value: "last-2-weeks",
  label: "Last 2 Weeks"
}, {
  value: "last-3-weeks",
  label: "Last 3 Weeks"
}, {
  value: "last-4-weeks",
  label: "Last 4 Weeks"
}, {
  value: "last-5-weeks",
  label: "Last 5 Weeks"
}];
const monthlyFrequencyOptions = [{
  value: "last-month",
  label: "Last Month"
}, {
  value: "last-2-months",
  label: "Last 2 Months"
}, {
  value: "last-3-months",
  label: "Last 3 Months"
}, {
  value: "last-6-months",
  label: "Last 6 Months"
}, {
  value: "last-12-months",
  label: "Last 12 Months"
}];
const weekDays = [{
  value: "monday",
  label: "Monday"
}, {
  value: "tuesday",
  label: "Tuesday"
}, {
  value: "wednesday",
  label: "Wednesday"
}, {
  value: "thursday",
  label: "Thursday"
}, {
  value: "friday",
  label: "Friday"
}, {
  value: "saturday",
  label: "Saturday"
}, {
  value: "sunday",
  label: "Sunday"
}];

const weekOptions = [{
  value: "first",
  label: "First Week"
}, {
  value: "second",
  label: "Second Week"
}, {
  value: "third",
  label: "Third Week"
}, {
  value: "fourth",
  label: "Fourth Week"
}, {
  value: "last",
  label: "Last Week"
}];
const generateBulkReportSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  selectedListings: z.array(z.string()).min(1, "Select at least one location").max(20, "Maximum 20 locations allowed"),
  reportSections: z.array(z.string()).min(1, "Select at least one report type"),
  scheduleType: z.enum(["one-time", "weekly", "monthly"]),
  frequency: z.string().optional(),
  emailWeek: z.string().optional(),
  emailDay: z.string().optional(),
  dateRange: z.custom<DateRange>().optional(),
  deliveryFormat: z.array(z.enum(["csv", "pdf", "html"])).min(1, "Select at least one delivery format"),
  emailTo: z.string().min(1, "Email recipient is required").email("Invalid email format"),
  emailCc: z.string().optional(),
  emailBcc: z.string().optional(),
  emailSubject: z.string().min(1, "Email subject is required"),
  emailMessage: z.string().min(1, "Email message is required")
});
type GenerateBulkReportForm = z.infer<typeof generateBulkReportSchema>;
export const GenerateBulkReport: React.FC = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      emailMessage: "Please find your generated reports attached.\n\nBest regards,\nYour Team"
    }
  });
  const watchScheduleType = form.watch("scheduleType");
  const watchReportSections = form.watch("reportSections");
  const watchSelectedListings = form.watch("selectedListings");
  const handleReportSectionChange = (sectionId: string, checked: boolean) => {
    const currentSections = form.getValues("reportSections");
    if (checked) {
      form.setValue("reportSections", [...currentSections, sectionId]);
    } else {
      form.setValue("reportSections", currentSections.filter(id => id !== sectionId));
    }
  };
  const handleSelectAllReports = () => {
    const allSectionIds = REPORT_SECTIONS.map(section => section.id);
    form.setValue("reportSections", allSectionIds);
  };
  const handleDeselectAllReports = () => {
    form.setValue("reportSections", []);
  };

  const onSubmit = async (data: GenerateBulkReportForm) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Report Project Created",
        description: `${data.projectName} has been successfully created and scheduled.`
      });
      navigate("/main-dashboard/reports");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create report project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const getFrequencyOptions = () => {
    return watchScheduleType === "weekly" ? weeklyFrequencyOptions : monthlyFrequencyOptions;
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
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        
        <div>
          <h1 className="text-2xl font-bold text-foreground">Generate Bulk Report</h1>
          <p className="text-muted-foreground">Create and schedule automated reports for multiple locations</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Project Details
              </CardTitle>
              <CardDescription>
                Give your report project a name and select locations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="projectName" render={({
              field
            }) => <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="selectedListings" render={({
              field
            }) => <FormItem>
                    <div className="space-y-3">
                      {/* <Label className="text-sm font-medium">Select Locations</Label> */}
                      
                      <div className="space-y-3">
                        <BulkReplyListingSelector 
                          selectedListings={field.value} 
                          onListingsChange={field.onChange} 
                          hideStatusBadges={true}
                        />
                        
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            For optimal performance, bulk reports are limited to 20 locations per project.
                          </p>
                          <Badge variant={watchSelectedListings.length >= 20 ? "destructive" : watchSelectedListings.length >= 18 ? "secondary" : "outline"} className="text-xs">
                            {watchSelectedListings.length}/20 locations
                          </Badge>
                        </div>
                      </div>
                      
                      {watchSelectedListings.length >= 18 && watchSelectedListings.length < 20 && (
                        <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200">
                          ⚠️ You're approaching the limit of 20 locations for optimal performance.
                        </div>
                      )}
                      
                      {watchSelectedListings.length >= 20 && (
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
                          🚫 Maximum limit reached. You can deselect locations to make changes.
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>} />
            </CardContent>
          </Card>

          {/* Report Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="w-5 h-5" />
                Report Types
              </CardTitle>
              <CardDescription>
                Select which reports to include in your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Available Reports</Label>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={handleSelectAllReports}>
                      Select All
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleDeselectAllReports}>
                      Deselect All
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {REPORT_SECTIONS.map(section => <div key={section.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <Checkbox id={section.id} checked={watchReportSections.includes(section.id)} onCheckedChange={checked => handleReportSectionChange(section.id, checked as boolean)} />
                      <Label htmlFor={section.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                        {section.name}
                      </Label>
                    </div>)}
                </div>

                <FormField control={form.control} name="reportSections" render={() => <FormItem>
                      <FormMessage />
                    </FormItem>} />
              </div>
            </CardContent>
          </Card>

          {/* Schedule Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule Configuration
              </CardTitle>
              <CardDescription>
                Configure when and how often reports should be generated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField control={form.control} name="scheduleType" render={({
              field
            }) => <FormItem>
                    <FormLabel>Schedule Type</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="one-time" id="one-time" />
                          <Label htmlFor="one-time">One Time</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="weekly" id="weekly" />
                          <Label htmlFor="weekly">Weekly</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <Label htmlFor="monthly">Monthly</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              {watchScheduleType === "one-time" && <FormField control={form.control} name="dateRange" render={({
              field
            }) => <FormItem>
                      <FormLabel>Date Range</FormLabel>
                      <FormControl>
                        <DateRangePicker date={field.value} onDateChange={field.onChange} placeholder="Select date range for one-time report" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />}

              {(watchScheduleType === "weekly" || watchScheduleType === "monthly") && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="frequency" render={({
                field
              }) => <FormItem>
                        <FormLabel>Select Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getFrequencyOptions().map(option => <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>} />

                  {watchScheduleType === "monthly" && <FormField control={form.control} name="emailWeek" render={({
                field
              }) => <FormItem>
                        <FormLabel>Send Email On This Week</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select week..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {weekOptions.map(week => <SelectItem key={week.value} value={week.value}>
                                {week.label}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>} />}

                  <FormField control={form.control} name="emailDay" render={({
                field
              }) => <FormItem>
                        <FormLabel>Send Email On</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select day..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {weekDays.map(day => <SelectItem key={day.value} value={day.value}>
                                {day.label}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>} />
                </div>}
            </CardContent>
          </Card>

          {/* Delivery Format */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Delivery Format
              </CardTitle>
              <CardDescription>
                Choose how you want to receive your reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField control={form.control} name="deliveryFormat" render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-row gap-4">
                      {[
                        { value: "csv", label: "CSV Format", icon: File },
                        { value: "pdf", label: "PDF Format", icon: FileText },
                        { value: "html", label: "HTML Public Report", icon: Globe }
                      ].map((format) => (
                        <div
                          key={format.value}
                          className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors flex-1 cursor-pointer"
                          onClick={() => {
                            const currentFormats = field.value;
                            const isChecked = currentFormats.includes(format.value as "csv" | "pdf" | "html");
                            if (isChecked) {
                              field.onChange(currentFormats.filter(f => f !== format.value));
                            } else {
                              field.onChange([...currentFormats, format.value]);
                            }
                          }}
                        >
                          <Checkbox
                            id={format.value}
                            checked={field.value.includes(format.value as "csv" | "pdf" | "html")}
                            disabled
                          />
                          <div className="flex items-center gap-2">
                            <format.icon className="w-4 h-4" />
                            <Label htmlFor={format.value} className="cursor-pointer">
                              {format.label}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          {/* Email Composer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Composer
              </CardTitle>
              <CardDescription>
                Configure how reports will be sent via email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="emailTo" render={({
                field
              }) => <FormItem>
                      <FormLabel>To *</FormLabel>
                      <FormControl>
                        <Input placeholder="recipient@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="emailCc" render={({
                field
              }) => <FormItem>
                      <FormLabel>CC</FormLabel>
                      <FormControl>
                        <Input placeholder="cc@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="emailBcc" render={({
                field
              }) => <FormItem>
                      <FormLabel>BCC</FormLabel>
                      <FormControl>
                        <Input placeholder="bcc@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </div>

              <FormField control={form.control} name="emailSubject" render={({
              field
            }) => <FormItem>
                    <FormLabel>Subject *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email subject..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="emailMessage" render={({
              field
            }) => <FormItem>
                    <FormLabel>Message *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your email message..." className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <Button type="button" variant="outline" onClick={() => navigate("/main-dashboard/reports")}>
              Cancel
            </Button>
            <Button type="button" variant="secondary" disabled={isSubmitting}>
              Save Draft
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </> : <>
                  <Send className="w-4 h-4 mr-2" />
                  Create Project
                </>}
            </Button>
          </div>
        </form>
      </Form>
    </div>;
};