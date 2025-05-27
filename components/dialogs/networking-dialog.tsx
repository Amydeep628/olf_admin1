"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const networkingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  company: z.string().min(1, "Company/Organization is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  deadline: z.string().min(1, "Deadline is required"),
});

interface NetworkingDialogProps {
  opportunity?: {
    id: string;
    title: string;
    description: string;
    type: string;
    category: string;
    location: string;
    company: string;
    contactPerson: string;
    email: string;
    phone: string;
    deadline: string;
    status: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function NetworkingDialog({
  opportunity,
  open,
  onOpenChange,
  onSuccess,
}: NetworkingDialogProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!opportunity;

  const form = useForm<z.infer<typeof networkingSchema>>({
    resolver: zodResolver(networkingSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      category: "",
      location: "",
      company: "",
      contactPerson: "",
      email: "",
      phone: "",
      deadline: "",
    },
  });

  useEffect(() => {
    if (opportunity && open) {
      form.reset({
        title: opportunity.title,
        description: opportunity.description,
        type: opportunity.type,
        category: opportunity.category,
        location: opportunity.location,
        company: opportunity.company,
        contactPerson: opportunity.contactPerson,
        email: opportunity.email,
        phone: opportunity.phone,
        deadline: opportunity?.deadline?.split('T')[0], // Format date for input
      });
    } else if (!opportunity && open) {
      form.reset({
        title: "",
        description: "",
        type: "",
        category: "",
        location: "",
        company: "",
        contactPerson: "",
        email: "",
        phone: "",
        deadline: "",
      });
    }
  }, [opportunity, open, form]);

  const onSubmit = async (values: z.infer<typeof networkingSchema>) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const url = isEditing 
        ? `https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/networking/${opportunity.id}`
        : "https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/networking";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(isEditing ? "Failed to update opportunity" : "Failed to create opportunity");
      }

      toast.success(isEditing ? "Opportunity updated successfully" : "Opportunity created successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(isEditing ? "Failed to update opportunity" : "Failed to create opportunity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Opportunity" : "Create Opportunity"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter opportunity title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="job">Job</SelectItem>
                      <SelectItem value="mentorship">Mentorship</SelectItem>
                      <SelectItem value="collaboration">Collaboration</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter opportunity description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company/Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact person name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEditing ? "Update Opportunity" : "Create Opportunity"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}