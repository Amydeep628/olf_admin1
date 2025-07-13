"use client";

import { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(1, "Mobile number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  bio: z.string().optional(),
  areasOfExpertise: z.array(z.object({ value: z.string() })).optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
  education: z.array(z.object({ value: z.string() })).optional(),
  experience: z.array(z.object({ value: z.string() })).optional(),
  achievements: z.array(z.object({ value: z.string() })).optional(),
  distinguishedAlumni: z.boolean().default(false),
  batchAmbassadors: z.boolean().default(false),
  allowPIIDisplay: z.boolean().default(true),
});

interface EditAlumniDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditAlumniDialog({
  userId,
  open,
  onOpenChange,
  onSuccess,
}: EditAlumniDialogProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      areasOfExpertise: [],
      education: [],
      experience: [],
      achievements: [],
      distinguishedAlumni: false,
      batchAmbassadors: false,
      allowPIIDisplay: true,
    },
  });

  const {
    fields: expertiseFields,
    append: appendExpertise,
    remove: removeExpertise,
  } = useFieldArray({
    control: form.control,
    name: "areasOfExpertise",
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
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({
    control: form.control,
    name: "achievements",
  });

  useEffect(() => {
    const fetchAlumniDetails = async () => {
      if (!open) return;

      try {
        setLoading(true);
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await fetch(
          `https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch alumni details");

        const { profile } = await response.json();

        // Transform arrays to the format expected by useFieldArray
        const transformArray = (arr: string[] | undefined) => 
          arr ? arr.map(value => ({ value })) : [];

        form.reset({
          name: profile.name || "",
          email: profile.email || "",
          mobile: profile.mobile || "",
          address: profile.address || "",
          city: profile.city || "",
          state: profile.state || "",
          bio: profile.bio || "",
          linkedin: profile.linkedin || "",
          twitter: profile.twitter || "",
          website: profile.website || "",
          areasOfExpertise: transformArray(profile.areasOfExpertise),
          education: transformArray(profile.education),
          experience: transformArray(profile.experience),
          achievements: transformArray(profile.achievements),
          distinguishedAlumni: profile.distinguishedAlumni || false,
          batchAmbassadors: profile.batchAmbassadors || false,
        });
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to load alumni details");
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniDetails();
  }, [userId, open, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSaving(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      // Transform field arrays back to string arrays
      const transformFieldArray = (arr: { value: string }[] | undefined) =>
        arr ? arr.map(item => item.value).filter(value => value.trim() !== "") : [];

      const payload = {
        ...values,
        id: userId,
        areasOfExpertise: transformFieldArray(values.areasOfExpertise),
        education: transformFieldArray(values.education),
        experience: transformFieldArray(values.experience),
        achievements: transformFieldArray(values.achievements),
      };

      const response = await fetch(
        `https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/users/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to update alumni details");

      toast.success("Alumni details updated successfully");
      onSuccess();
        allowPIIDisplay: profile.allowPIIDisplay !== undefined ? profile.allowPIIDisplay : true,
      onOpenChange(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update alumni details");
    } finally {
      setSaving(false);
    }
  };

  const renderFieldArray = (
    fields: any[],
    append: (value: any) => void,
    remove: (index: number) => void,
    name: string,
    label: string,
    placeholder: string
  ) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">{label}</h3>
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
          <DialogTitle>Edit Alumni Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8 flex-1">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-6 pb-4">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-sm font-medium">Personal Information</h3>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Special Designations */}
                  <div>
                    <h3 className="text-sm font-medium">Special Designations</h3>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="distinguishedAlumni"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Distinguished Alumni</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="batchAmbassadors"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Batch Ambassadors</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <h3 className="text-sm font-medium">Bio</h3>
                    <Separator className="my-2" />
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about yourself..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Areas of Expertise */}
                  <div>
                    <h3 className="text-sm font-medium">Areas of Expertise</h3>
                    <Separator className="my-2" />
                    {renderFieldArray(
                      expertiseFields,
                      appendExpertise,
                      removeExpertise,
                      "areasOfExpertise",
                      "Areas of Expertise",
                      "e.g., Software Development, Data Science"
                    )}
                  </div>

                  {/* Social Links */}
                  <div>
                    <h3 className="text-sm font-medium">Social Links</h3>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/in/username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twitter URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://twitter.com/username" {...field} />
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
                            <FormLabel>Website URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://yourwebsite.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-sm font-medium">Location</h3>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                    {renderFieldArray(
                      educationFields,
                      appendEducation,
                      removeEducation,
                      "education",
                      "Education",
                      "e.g., B.Tech Computer Science, XYZ University (2018-2022)"
                    )}
                  </div>

                  {/* Experience */}
                  <div>
                    <h3 className="text-sm font-medium">Experience</h3>
                    <Separator className="my-2" />
                    {renderFieldArray(
                      experienceFields,
                      appendExperience,
                      removeExperience,
                      "experience",
                      "Experience",
                      "e.g., Software Engineer at ABC Corp (2022-Present)"
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
                      "e.g., Winner of National Coding Competition 2023"
                    )}
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
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}