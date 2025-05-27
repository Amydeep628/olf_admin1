"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GraduationCap,
  Mail,
  MoreVertical,
  Phone,
  Search,
  Trophy,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EducatorDialog } from "@/components/dialogs/educator-dialog";
import { toast } from "sonner";

interface Educator {
  id: string;
  name: string;
  department: string;
  specialization: string;
  email: string;
  phone: string;
  experience: string;
  achievements: string[];
  status: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  hasMore: boolean;
}

export default function EducatorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [educators, setEducators] = useState<Educator[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEducator, setSelectedEducator] = useState<Educator | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    hasMore: false,
  });

  const fetchEducators = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        "https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/educators",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch educators");
      }

      const data = await response.json();
      setEducators(data.educators);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching educators:", error);
      toast.error("Failed to load educators");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducators();
  }, []);

  const handleCreateEducator = () => {
    setSelectedEducator(undefined);
    setDialogOpen(true);
  };

  const handleEditEducator = (educator: Educator) => {
    setSelectedEducator(educator);
    setDialogOpen(true);
  };

  const handleDeleteEducator = async (educatorId: string) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        `https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/educators/${educatorId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete educator");
      }

      toast.success("Educator deleted successfully");
      fetchEducators();
    } catch (error) {
      console.error("Error deleting educator:", error);
      toast.error("Failed to delete educator");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const filteredEducators = educators.filter((educator) =>
    educator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Educators</h2>
          <Button onClick={handleCreateEducator}>
            <GraduationCap className="mr-2 h-4 w-4" />
            Add Educator
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search educators..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <Card className="col-span-full">
              <CardContent className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : filteredEducators.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-8 text-muted-foreground">
                No educators found
              </CardContent>
            </Card>
          ) : (
            filteredEducators.map((educator) => (
              <Card key={educator.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`/avatars/${educator.id}.png`}
                          alt={educator.name}
                        />
                        <AvatarFallback>{getInitials(educator.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{educator.name}</CardTitle>
                        <CardDescription>{educator.department}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditEducator(educator)}>
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteEducator(educator.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Badge variant="outline">{educator.specialization}</Badge>
                      <Badge variant="secondary" className="ml-2">
                        {educator.experience}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{educator.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{educator.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Achievements</span>
                      </div>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {educator.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <EducatorDialog
        educator={selectedEducator}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchEducators}
      />
    </DashboardLayout>
  );
}