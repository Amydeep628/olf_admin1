"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, MoreVertical, Search, UserPlus, Loader2 } from "lucide-react";
import { ViewAlumniDialog } from "@/components/dialogs/view-alumni-dialog";
import { EditAlumniDialog } from "@/components/dialogs/edit-alumni-dialog";
import { ChangeStatusDialog } from "@/components/dialogs/change-status-dialog";

interface Alumni {
  id: string;
  name: string;
  batch: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  membership_status: string;
  isActive: boolean;
}

interface PaginationInfo {
  page: number;
  limit: number;
  hasMore: boolean;
  total: number;
}

interface DialogState {
  type: "view" | "edit" | "status" | null;
  userId: string | null;
}

export default function AlumniPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    hasMore: false,
    total: 0,
  });
  const [dialog, setDialog] = useState<DialogState>({
    type: null,
    userId: null,
  });

  const fetchAlumni = async (page: number, search: string = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const response = await fetch(
        `https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/directory?t=1&page=${page}&limit=20&name=${encodeURIComponent(search)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAlumni(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching alumni:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      fetchAlumni(1, searchQuery);
    }, 300);

    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);

  const loadMore = () => {
    if (pagination.hasMore) {
      fetchAlumni(pagination.page + 1, searchQuery);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleRefresh = () => {
    fetchAlumni(pagination.page, searchQuery);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Alumni Directory</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Alumni
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alumni..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline">Filters</Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && alumni.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : alumni.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No alumni found
                  </TableCell>
                </TableRow>
              ) : (
                alumni.map((alumnus) => (
                  <TableRow key={alumnus.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/avatars/${alumnus.id}.png`} alt={alumnus.name} />
                          <AvatarFallback>{getInitials(alumnus.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{alumnus.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{alumnus.batch}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{alumnus.email}</div>
                        <div className="text-xs text-muted-foreground">
                          {alumnus.mobile}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{alumnus.city}</div>
                        <div className="text-xs text-muted-foreground">
                          {alumnus.state}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={alumnus.isActive ? "default" : "secondary"}>
                        {alumnus.membership_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setDialog({ type: "view", userId: alumnus.id })}
                          >
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDialog({ type: "edit", userId: alumnus.id })}
                          >
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDialog({ type: "status", userId: alumnus.id })}
                          >
                            Change Status
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination.hasMore && !loading && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={loadMore}>
              Load More
            </Button>
          </div>
        )}

        {dialog.type === "view" && dialog.userId && (
          <ViewAlumniDialog
            userId={dialog.userId}
            open={true}
            onOpenChange={(open) => !open && setDialog({ type: null, userId: null })}
          />
        )}

        {dialog.type === "edit" && dialog.userId && (
          <EditAlumniDialog
            userId={dialog.userId}
            open={true}
            onOpenChange={(open) => !open && setDialog({ type: null, userId: null })}
            onSuccess={handleRefresh}
          />
        )}

        {dialog.type === "status" && dialog.userId && (
          <ChangeStatusDialog
            userId={dialog.userId}
            currentStatus={alumni.find(a => a.id === dialog.userId)?.membership_status || ""}
            open={true}
            onOpenChange={(open) => !open && setDialog({ type: null, userId: null })}
            onSuccess={handleRefresh}
          />
        )}
      </div>
    </DashboardLayout>
  );
}