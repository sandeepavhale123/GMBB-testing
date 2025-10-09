import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { projectService } from "@/services/liveSeoFixer/projectService";
import type { CreateProjectRequest } from "@/modules/live-seo-fixer/types";

const projectCreateSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Name must be less than 100 characters"),
  website: z.string().url("Please enter a valid URL"),
  address: z.string().optional(),
  phone: z.string().optional(),
});

type ProjectCreateForm = z.infer<typeof projectCreateSchema>;

interface ProjectCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectCreateModal: React.FC<ProjectCreateModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectCreateForm>({
    resolver: zodResolver(projectCreateSchema),
  });

  const createMutation = useMutation({
    mutationFn: projectService.createProject,
    onSuccess: () => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["seo-projects"] });
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create project");
    },
  });

  const onSubmit = (data: ProjectCreateForm) => {
    createMutation.mutate(data as CreateProjectRequest);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New SEO Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">
              Project Name <span className="text-destructive">*</span>
            </Label>
            <Input id="name" {...register("name")} placeholder="My Website SEO" />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="website">
              Website URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="website"
              {...register("website")}
              placeholder="https://example.com"
            />
            {errors.website && (
              <p className="text-sm text-destructive mt-1">{errors.website.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address">Address (Optional)</Label>
            <Input id="address" {...register("address")} placeholder="123 Main St" />
          </div>

          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input id="phone" {...register("phone")} placeholder="+1 (555) 123-4567" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
