"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ChangeStatusDialogProps {
  userId: string;
  currentStatus: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ChangeStatusDialog({
  userId,
  currentStatus,
  open,
  onOpenChange,
  onSuccess,
}: ChangeStatusDialogProps) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        `https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/users/profile`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: userId,
            membership_status: status,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to update status');

      toast.success("Status updated successfully");
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Membership Status</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LifeTime Member">Lifetime Member</SelectItem>
              <SelectItem value="Annual Member">Annual Member</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
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
      </DialogContent>
    </Dialog>
  );
}