"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface ViewAlumniDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewAlumniDialog({ userId, open, onOpenChange }: ViewAlumniDialogProps) {
  const [alumni, setAlumni] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumniDetails = async () => {
      if (!open) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await fetch(
          `https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/profile/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch alumni details');
        const { profile } = await response.json();
        setAlumni(profile);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniDetails();
  }, [userId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Alumni Profile</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : alumni ? (
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <Separator className="my-2" />
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">Name</dt>
                    <dd className="text-sm font-medium">{alumni.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Batch</dt>
                    <dd className="text-sm font-medium">{alumni.batch}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Email</dt>
                    <dd className="text-sm font-medium">{alumni.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Mobile</dt>
                    <dd className="text-sm font-medium">{alumni.mobile}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Location</h3>
                <Separator className="my-2" />
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">Address</dt>
                    <dd className="text-sm font-medium">{alumni.address}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">City</dt>
                    <dd className="text-sm font-medium">{alumni.city}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">State</dt>
                    <dd className="text-sm font-medium">{alumni.state}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Membership Details</h3>
                <Separator className="my-2" />
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">Membership Status</dt>
                    <dd className="text-sm font-medium">{alumni.membership_status}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Membership Number</dt>
                    <dd className="text-sm font-medium">{alumni.membership_no}</dd>
                  </div>
                </dl>
              </div>

              {alumni.achievements && alumni.achievements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold">Achievements</h3>
                  <Separator className="my-2" />
                  <ul className="list-disc list-inside space-y-1">
                    {alumni.achievements.map((achievement: string, index: number) => (
                      <li key={index} className="text-sm">{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Failed to load alumni details
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}