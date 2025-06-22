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
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const educatorSchema = z.object({
  prefix: z.string().min(1, "Prefix is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  role: z.string().min(1, "Role is required"),
  contact: z.object({
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
  }),
  subjects: z.string().min(1, "Subjects are required"),
  startYear: z.string().min(1, "Start year is required"),
  endYear: z.string().min(1, "End year is required"),
  education: z.string().min(1, "Education details are required"),
  achievements: z.string().optional(),
  photo: z.string().url("Invalid photo URL").optional().or(z.literal("")),
  documents: z.string().optional(),
  message: z.string().optional(),
});

interface EducatorDialogProps {
  educator?: {
    id: string;
    prefix: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    role: string;
    contact: {
      email: string;
      phone: string;
    };
    subjects: string[];
    serviceYears: string[];
    education: string[];
    achievements: string[];
    photo?: string;
    documents?: string[];
    message?: string;
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
      middleName: "",
      lastName: "",
      role: "",
      contact: {
        email: "",
        phone: "",
      },
      subjects: "",
      startYear: "",
      endYear: "",
      education: "",
      achievements: "",
      photo: "",
      documents: "",
      message: "",
    },
  });

  useEffect(() => {
    if (educator && open) {
      form.reset({
        prefix: educator.prefix,
        firstName: educator.firstName,
        middleName: educator.middleName || "",
        lastName: educator.lastName,
        role: educator.role,
        contact: {
          email: educator.contact?.email,
          phone: educator.contact?.phone,
        },
        subjects: educator.subjects.join(", "),
        startYear: educator.serviceYears[0] || "",
        endYear: educator.serviceYears[1] || "",
        education: educator.education.join("\n"),
        achievements: educator.achievements?.join("\n") || "",
        photo: educator.photo || "",
        documents: educator.documents?.join("\n") || "",
        message: educator.message || "",
      });
    } else if (!educator && open) {
      form.reset({
        prefix: "",
        firstName: "",
        middleName: "",
        lastName: "",
        role: "",
        contact: {
          email: "",
          phone: "",
        },
        subjects: "",
        startYear: "",
        endYear: "",
        education: "",
        achievements: "",
        photo: "",
        documents: "",
        message: "",
      });
    }
  }, [educator, open, form]);

  const onSubmit = async (values: z.infer<typeof educatorSchema>) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      // Format the data according to the API requirements
      const formattedValues = {
        prefix: values.prefix,
        firstName: values.firstName,
        middleName: values.middleName || undefined,
        lastName: values.lastName,
        role: values.role,
        contact: values.contact,
        subjects: values.subjects.split(",").map(s => s.trim()).filter(s => s),
        serviceYears: [values.startYear, values.endYear],
        education: values.education.split("\n").filter(e => e.trim()),
        achievements: values.achievements ? values.achievements.split("\n").filter(a => a.trim()) : [],
        photo: values.photo || undefined,
        documents: values.documents ? values.documents.split("\n").filter(d => d.trim()) : [],
        message: values.message || undefined,
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
      <DialogContent className="max-w-4xl h-[95vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{isEditing ? "Edit Educator" : "Add Educator"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6 pb-4">
                {/* Personal Information */}
                <div>
                  <h3 className="text-sm font-medium">Personal Information</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="prefix"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel>Prefix *</FormLabel>
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
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="middleName"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel>Middle Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Middle name" {...field} />
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
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <h3 className="text-sm font-medium">Role Information</h3>
                  <Separator className="my-2" />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role *</FormLabel>
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
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="professor">Professor</SelectItem>
                            <SelectItem value="assistant_professor">Assistant Professor</SelectItem>
                            <SelectItem value="lecturer">Lecturer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-sm font-medium">Contact Information</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contact.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contact.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone *</FormLabel>
                          <FormControl>
                            <Input placeholder="+919876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Subjects */}
                <div>
                  <h3 className="text-sm font-medium">Subjects</h3>
                  <Separator className="my-2" />
                  <FormField
                    control={form.control}
                    name="subjects"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subjects *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter subjects (comma-separated): Mathematics, Physics"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Service Years */}
                <div>
                  <h3 className="text-sm font-medium">Service Years</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Year *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="2010"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Year *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="2020"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-sm font-medium">Education</h3>
                  <Separator className="my-2" />
                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter education details (one per line):&#10;M.Sc. Physics&#10;B.Sc. Mathematics"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-sm font-medium">Achievements</h3>
                  <Separator className="my-2" />
                  <FormField
                    control={form.control}
                    name="achievements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Achievements</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter achievements (one per line):&#10;Best Teacher Award 2018&#10;Science Fair Coordinator"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Photo */}
                <div>
                  <h3 className="text-sm font-medium">Photo</h3>
                  <Separator className="my-2" />
                  <FormField
                    control={form.control}
                    name="photo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photo URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/photos/educator.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-sm font-medium">Documents</h3>
                  <Separator className="my-2" />
                  <FormField
                    control={form.control}
                    name="documents"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Documents</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter document URLs (one per line):&#10;https://example.com/docs/degree.pdf&#10;https://example.com/docs/certificate.pdf"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Message */}
                <div>
                  <h3 className="text-sm font-medium">Message</h3>
                  <Separator className="my-2" />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Excited to continue shaping young minds!"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="flex-shrink-0 pt-4 border-t">
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