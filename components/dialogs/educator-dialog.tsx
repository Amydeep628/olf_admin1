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

const educatorSchema = z.object({
  prefix: z.string().min(1, "Prefix is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.string().min(1, "Role is required"),
  subjects: z.string().min(1, "Subjects are required"),
  serviceYears: z.string().min(1, "Service years are required"),
  education: z.string().min(1, "Education details are required"),
  achievements: z.string().min(1, "Achievements are required"),
  photo: z.string().optional(),
});

interface EducatorDialogProps {
  educator?: {
    id: string;
    prefix: string;
    firstName: string;
    lastName: string;
    role: string;
    subjects: string[];
    serviceYears: string[];
    education: string[];
    achievements: string[];
    photo: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EducatorDialog({
  educator,
  open,
  onOpenChange,
  onSuccess,
}: EducatorDialogProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!educator;

  const form = useForm<z.infer<typeof educatorSchema>>({
    resolver: zodResolver(educatorSchema),
    defaultValues: {
      prefix: "",
      firstName: "",
      lastName: "",
      role: "",
      subjects: "",
      serviceYears: "",
      education: "",
      achievements: "",
      photo: "",
    },
  });

  useEffect(() => {
    if (educator && open) {
      form.reset({
        prefix: educator.prefix,
        firstName: educator.firstName,
        lastName: educator.lastName,
        role: educator.role,
        subjects: educator.subjects.join(", "),
        serviceYears: educator.serviceYears.join(" - "),
        education: educator.education.join("\n"),
        achievements: educator.achievements.join("\n"),
        photo: educator.photo,
      });
    } else if (!educator && open) {
      form.reset({
        prefix: "",
        firstName: "",
        lastName: "",
        role: "",
        subjects: "",
        serviceYears: "",
        education: "",
        achievements: "",
        photo: "",
      });
    }
  }, [educator, open, form]);

  const onSubmit = async (values: z.infer<typeof educatorSchema>) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      // Format the data according to the API requirements
      const formattedValues = {
        ...values,
        subjects: values.subjects.split(",").map(s => s.trim()),
        serviceYears: values.serviceYears.split("-").map(y => y.trim()),
        education: values.education.split("\n").filter(e => e.trim()),
        achievements: values.achievements.split("\n").filter(a => a.trim()),
      };
      
      const url = isEditing 
        ? `https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/educators/${educator.id}`
        : "https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/educators";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) {
        throw new Error(isEditing ? "Failed to update educator" : "Failed to create educator");
      }

      toast.success(isEditing ? "Educator updated successfully" : "Educator created successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(isEditing ? "Failed to update educator" : "Failed to create educator");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Educator" : "Add Educator"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="prefix"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Prefix</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mr">Mr</SelectItem>
                        <SelectItem value="Mrs">Mrs</SelectItem>
                        <SelectItem value="Ms">Ms</SelectItem>
                        <SelectItem value="Dr">Dr</SelectItem>
                        <SelectItem value="Prof">Prof</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="principal">Principal</SelectItem>
                      <SelectItem value="professor">Professor</SelectItem>
                      <SelectItem value="assistant_professor">Assistant Professor</SelectItem>
                      <SelectItem value="lecturer">Lecturer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subjects</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter subjects (comma-separated)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Years</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Start year - End year (e.g., 2020 - 2024)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter education details (one per line)"
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
              name="achievements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Achievements</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter achievements (one per line)"
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
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter photo URL (optional)"
                      {...field}
                    />
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
                  isEditing ? "Update Educator" : "Add Educator"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}