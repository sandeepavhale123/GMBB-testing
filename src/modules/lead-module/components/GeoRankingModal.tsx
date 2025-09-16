import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useCreateGeoReport } from "@/api/leadApi";
import { toast } from "sonner";
import { getDistanceOptions } from "@/utils/geoRankingUtils";

const geoRankingSchema = z.object({
  keywords: z.string()
    .min(1, "Keywords are required")
    .refine((val) => {
      const keywordsList = val.split(',').map(k => k.trim()).filter(k => k.length > 0);
      return keywordsList.length <= 3;
    }, "Maximum 3 keywords allowed")
    .refine((val) => {
      const keywordsList = val.split(',').map(k => k.trim()).filter(k => k.length > 0);
      return keywordsList.length > 0;
    }, "At least 1 keyword is required"),
  gridSize: z.number().refine((val) => val === 3 || val === 5, "Grid size must be 3 or 5"),
  distanceUnit: z.enum(["Meters", "Miles"]),
  distanceValue: z.number().min(1, "Distance value is required"),
});

type GeoRankingFormData = z.infer<typeof geoRankingSchema>;

interface GeoRankingModalProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
}

export const GeoRankingModal: React.FC<GeoRankingModalProps> = ({
  open,
  onClose,
  leadId,
}) => {
  const createGeoReport = useCreateGeoReport();
  const navigate = useNavigate();

  const form = useForm<GeoRankingFormData>({
    resolver: zodResolver(geoRankingSchema),
    defaultValues: {
      keywords: "",
      gridSize: 3,
      distanceUnit: "Meters",
      distanceValue: 100,
    },
  });

  const distanceUnit = form.watch("distanceUnit");
  const distanceOptions = getDistanceOptions(distanceUnit);

  const onSubmit = async (data: GeoRankingFormData) => {
    const payload = {
      reportId: leadId,
      keywords: data.keywords,
      distanceUnit: data.distanceUnit,
      distanceValue: data.distanceValue,
      gridSize: data.gridSize,
    };

    createGeoReport.mutate(payload, {
      onSuccess: (response) => {
        toast.success("GEO Ranking Report created successfully!");
        
        // Navigate to the report URL or show success
        if (response.data.reportUrl) {
          window.open(response.data.reportUrl, '_blank');
        }
        
        onClose();
        form.reset();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to create GEO ranking report");
      },
    });
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent
        className="sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>Generate GEO Ranking Report</DialogTitle>
          <DialogDescription>
            Enter keywords and configure settings to generate a comprehensive GEO ranking report.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter keywords separated by commas (max 3)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gridSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grid Size *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grid size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="3">3x3</SelectItem>
                      <SelectItem value="5">5x5</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distanceUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance Unit *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Meters" id="meters" />
                        <FormLabel htmlFor="meters" className="font-normal">Meters</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Miles" id="miles" />
                        <FormLabel htmlFor="miles" className="font-normal">Miles</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distanceValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance Value *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseFloat(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select distance" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {distanceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createGeoReport.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createGeoReport.isPending}
              >
                {createGeoReport.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Report
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};