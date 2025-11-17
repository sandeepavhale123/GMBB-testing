import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { NicheSelector } from "../components/NicheSelector";
import {
  GooglePlacesAddressInput,
  AddressComponents,
} from "../components/GooglePlacesAddressInput";
import { createProject } from "@/services/liveSeoFixer";
import { toast } from "sonner";

const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Business name is required")
    .max(100, "Business name must be less than 100 characters"),
  website: z.string().url("Please enter a valid website URL"),
  schema_types: z.array(z.string()).min(1, "Please select a niche"),
  address: z.string().optional(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  place_id: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  phone: z.string().optional(),
});

type CreateProjectForm = z.infer<typeof createProjectSchema>;

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      website: "",
      schema_types: [],
      address: "",
      street_address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      place_id: "",
      latitude: "",
      longitude: "",
      phone: "",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Project created successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate("/module/live-seo-fixer/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create project");
    },
  });

  const handlePlaceSelected = (addressData: AddressComponents) => {
    form.setValue("address", addressData.full_address);
    form.setValue("street_address", addressData.street_address);
    form.setValue("city", addressData.city);
    form.setValue("state", addressData.state);
    form.setValue("postal_code", addressData.postal_code);
    form.setValue("country", addressData.country);
    form.setValue("place_id", addressData.place_id);
    form.setValue("latitude", addressData.latitude);
    form.setValue("longitude", addressData.longitude);

    if (addressData.phone && !form.getValues("phone")) {
      form.setValue("phone", addressData.phone);
    }
  };

  const onSubmit = (data: CreateProjectForm) => {
    createProjectMutation.mutate(data as Parameters<typeof createProject>[0]);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/module/live-seo-fixer/dashboard")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Project
          </h1>
          <p className="text-muted-foreground mt-1">
            Add a new website to monitor and optimize for SEO issues.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Business name, website URL and Niche are required. Address and phone
            are optional but recommended for local business schema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="schema_types"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Niche *</FormLabel>
                    <FormControl>
                      <NicheSelector
                        selectedNiche={field.value?.[0] || ""}
                        onNicheChange={(niche) => field.onChange([niche])}
                        error={form.formState.errors.schema_types?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <GooglePlacesAddressInput
                        value={field.value}
                        onChange={field.onChange}
                        onPlaceSelected={handlePlaceSelected}
                        placeholder="Search business address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/module/live-seo-fixer/dashboard")}
                  disabled={createProjectMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createProjectMutation.isPending}
                >
                  {createProjectMutation.isPending
                    ? "Creating..."
                    : "Create Project"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProject;
