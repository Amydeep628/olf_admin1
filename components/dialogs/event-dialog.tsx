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
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(1, "Venue is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  category: z.string().min(1, "Category is required"),
  totalTargetedAmount: z.number().min(0, "Target amount must be 0 or greater"),
  pricing: z.object({
    adult: z.number().min(0, "Adult price must be 0 or greater"),
    seniorCitizen: z.number().min(0, "Senior citizen price must be 0 or greater"),
    children: z.number().min(0, "Children price must be 0 or greater"),
  }),
  eventPhoto: z.string().optional(),
});

interface EventDialogProps {
  event?: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    capacity: number;
    category: string;
    totalTargetedAmount?: number;
    pricing?: {
      adult: number;
      seniorCitizen: number;
      children: number;
    };
    eventPhoto?: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EventDialog({
  event,
  open,
  onOpenChange,
  onSuccess,
}: EventDialogProps) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const isEditing = !!event;

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      capacity: 0,
      category: "",
      totalTargetedAmount: 0,
      pricing: {
        adult: 0,
        seniorCitizen: 0,
        children: 0,
      },
      eventPhoto: "",
    },
  });

  // Reset form with event data when editing
  useEffect(() => {
    if (event && open) {
      form.reset({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        venue: event.venue,
        capacity: event.capacity,
        category: event.category,
        totalTargetedAmount: event.totalTargetedAmount || 0,
        pricing: {
          adult: event.pricing?.adult || 0,
          seniorCitizen: event.pricing?.seniorCitizen || 0,
          children: event.pricing?.children || 0,
        },
        eventPhoto: event.eventPhoto || "",
      });
      
      // Set image preview if editing and has photo
      if (event.eventPhoto) {
        setImagePreview(event.eventPhoto);
      }
    } else if (!event && open) {
      form.reset({
        title: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        capacity: 0,
        category: "",
        totalTargetedAmount: 0,
        pricing: {
          adult: 0,
          seniorCitizen: 0,
          children: 0,
        },
        eventPhoto: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [event, open, form]);

  // Convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      setImageFile(file);
      setImagePreview(base64);
      form.setValue("eventPhoto", base64);
    } catch (error) {
      console.error("Error converting image:", error);
      toast.error("Failed to process image");
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    form.setValue("eventPhoto", "");
    
    // Reset file input
    const fileInput = document.getElementById("event-photo") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (values: z.infer<typeof eventSchema>) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const url = isEditing 
        ? `https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/events/${event.id}`
        : "https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/events";

      // Prepare payload - only include eventPhoto if it exists
      const payload: any = {
        title: values.title,
        description: values.description,
        date: values.date,
        time: values.time,
        venue: values.venue,
        capacity: values.capacity,
        category: values.category,
        totalTargetedAmount: values.totalTargetedAmount,
        pricing: values.pricing,
      };

      // Only include eventPhoto if it exists and is not empty
      if (values.eventPhoto && values.eventPhoto.trim() !== "") {
        payload.eventPhoto = values.eventPhoto;
      }

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(isEditing ? "Failed to update event" : "Failed to create event");
      }

      toast.success(isEditing ? "Event updated successfully" : "Event created successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(isEditing ? "Failed to update event" : "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{isEditing ? "Edit Event" : "Create Event"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6 pb-4">
                {/* Event Cover Image */}
                <div>
                  <h3 className="text-sm font-medium">Event Cover Image</h3>
                  <Separator className="my-2" />
                  <div className="space-y-4">
                    {/* Image Preview */}
                    {imagePreview ? (
                      <div className="relative">
                        <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Event cover preview"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {imageFile ? `${imageFile.name} (${(imageFile.size / 1024 / 1024).toFixed(2)} MB)` : "Current event image"}
                        </p>
                      </div>
                    ) : (
                      /* Upload Area */
                      <div className="w-full">
                        <label
                          htmlFor="event-photo"
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> event cover image
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                          </div>
                          <input
                            id="event-photo"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      <p>• Upload a high-quality image that represents your event</p>
                      <p>• Recommended size: 1200x600 pixels or 2:1 aspect ratio</p>
                      <p>• Supported formats: PNG, JPG, JPEG</p>
                      <p>• Maximum file size: 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div>
                  <h3 className="text-sm font-medium">Basic Information</h3>
                  <Separator className="my-2" />
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Event title" {...field} />
                          </FormControl>
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
                              placeholder="Event description" 
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
                            <Input placeholder="Event category" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Date, Time & Venue */}
                <div>
                  <h3 className="text-sm font-medium">Date, Time & Venue</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="venue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Venue</FormLabel>
                          <FormControl>
                            <Input placeholder="Event venue" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Capacity & Target Amount */}
                <div>
                  <h3 className="text-sm font-medium">Capacity & Financial Target</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Capacity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Event capacity" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="totalTargetedAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Amount (₹)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                className="pl-8"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p>• Set target amount to 0 if no fundraising goal</p>
                    <p>• This represents the total amount you aim to raise from this event</p>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h3 className="text-sm font-medium">Pricing (Per Person in INR)</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="pricing.adult"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adult Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                className="pl-8"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.seniorCitizen"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senior Citizen Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                className="pl-8"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.children"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Children Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                className="pl-8"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p>• Set price to 0 for free admission</p>
                    <p>• Senior citizens are typically 60+ years old</p>
                    <p>• Children are typically under 12 years old</p>
                    <p>• Revenue from registrations will count towards the target amount</p>
                  </div>
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
                  isEditing ? "Update Event" : "Create Event"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}