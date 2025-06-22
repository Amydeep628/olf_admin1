"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
  subjects: z.array(z.object({ value: z.string() })).min(1, "At least one subject is required"),
  serviceYears: z.array(z.object({ value: z.string() })).min(2, "Start and end years are required").max(2, "Only start and end years allowed"),
  education: z.array(z.object({ value: z.string() })).min(1, "At least one education entry is required"),
  achievements: z.array(z.object({ value: z.string() })).optional(),
  photo: z.string().url("Invalid photo URL").optional().or(z.literal("")),
  documents: z.array(z.object({ value: z.string() })).optional(),
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
      subjects: [],
      serviceYears: [],
      education: [],
      achievements: [],
      photo: "",
      documents: [],
      message: "",
    },
  });

  const {
    fields: subjectFields,
    append: appendSubject,
    remove: removeSubject,
  } = useFieldArray({
    control: form.control,
    name: "subjects",
  });

  const {
    fields: serviceYearFields,
    append: appendServiceYear,
    remove: removeServiceYear,
  } = useFieldArray({
    control: form.control,
    name: "serviceYears",
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({
    control: form.control,
    name: "achievements",
  });

  const {
    fields: documentFields,
    append: appendDocument,
    remove: removeDocument,
  } = useFieldArray({
    control: form.control,
    name: "documents",
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
          email: educator.contact.email,
          phone: educator.contact.phone,
        },
        subjects: educator.subjects.map(subject => ({ value: subject })),
        serviceYears: educator.serviceYears.map(year => ({ value: year })),
        education: educator.education.map(edu => ({ value: edu })),
        achievements: educator.achievements?.map(achievement => ({ value: achievement })) || [],
        photo: educator.photo || "",
        documents: educator.documents?.map(doc => ({ value: doc })) || [],
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
        subjects: [],
        serviceYears: [],
        education: [],
        achievements: [],
        photo: "",
        documents: [],
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
        subjects: values.subjects.map(s => s.value).filter(s => s.trim()),
        serviceYears: values.serviceYears.map(y => y.value).filter(y => y.trim()),
        education: values.education.map(e => e.value).filter(e => e.trim()),
        achievements: values.achievements?.map(a => a.value).filter(a => a.trim()) || [],
        photo: values.photo || undefined,
        documents: values.documents?.map(d => d.value).filter(d => d.trim()) || [],
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

  const renderFieldArray = (
    fields: any[],
    append: (value: any) => void,
    remove: (index: number) => void,
    name: string,
    label: string,
    placeholder: string,
    required: boolean = false
  ) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">{label} {required && <span className="text-red-500">*</span>}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ value: "" })}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <FormField
              control={form.control}
              name={`${name}.${index}.value` as any}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder={placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No {label.toLowerCase()} added yet. Click "Add" to add one.
          </p>
        )}
      </div>
    </div>
  );

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
                  {renderFieldArray(
                    subjectFields,
                    appendSubject,
                    removeSubject,
                    "subjects",
                    "Subjects",
                    "e.g., Mathematics, Physics",
                    true
                  )}
                </div>

                {/* Service Years */}
                <div>
                  <h3 className="text-sm font-medium">Service Years</h3>
                  <Separator className="my-2" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Add start year and end year (2 entries required)</p>
                    {renderFieldArray(
                      serviceYearFields,
                      appendServiceYear,
                      removeServiceYear,
                      "serviceYears",
                      "Service Years",
                      "e.g., 2010, 2020",
                      true
                    )}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-sm font-medium">Education</h3>
                  <Separator className="my-2" />
                  {renderFieldArray(
                    educationFields,
                    appendEducation,
                    removeEducation,
                    "education",
                    "Education",
                    "e.g., M.Sc. Physics, B.Sc. Mathematics",
                    true
                  )}
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-sm font-medium">Achievements</h3>
                  <Separator className="my-2" />
                  {renderFieldArray(
                    achievementFields,
                    appendAchievement,
                    removeAchievement,
                    "achievements",
                    "Achievements",
                    "e.g., Best Teacher Award 2018"
                  )}
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
                  {renderFieldArray(
                    documentFields,
                    appendDocument,
                    removeDocument,
                    "documents",
                    "Documents",
                    "e.g., https://example.com/docs/degree.pdf"
                  )}
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