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
  prefix: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  role: string;
  contact: {
    email?: string; // Made optional
    phone?: string; // Made optional for consistency
  };
  subjects: string[];
  serviceYears: string[];
  education: string[];
  achievements: string[];
  photo?: string;
  documents?: string[];
  message?: string;
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getFullName = (educator: Educator) => {
    const middleName = educator.middleName ? ` ${educator.middleName}` : "";
    return `${educator.prefix} ${educator.firstName}${middleName} ${educator.lastName}`;
  };

  const getServiceYears = (years: string[]) => {
    if (years.length === 2) {
      return `${years[0]} - ${years[1]}`;
    }
    return years.join(", ");
  };

  const filteredEducators = educators.filter((educator) =>
    `${educator.firstName} ${educator.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
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
                        {educator.photo ? (
                          <AvatarImage src={educator.photo} alt={getFullName(educator)} />
                        ) : (
                          <AvatarFallback>
                            {getInitials(educator.firstName, educator.lastName)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{getFullName(educator)}</CardTitle>
                        <CardDescription>{educator.role}</CardDescription>
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
                    {/* Contact Information */}
                    <div className="space-y-2">
                      {educator.contact?.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{educator.contact.email}</span>
                        </div>
                      )}
                      {educator.contact?.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{educator.contact.phone}</span>
                        </div>
                      )}
                      {!educator.contact?.email && !educator.contact?.phone && (
                        <div className="text-sm text-muted-foreground">
                          No contact information available
                        </div>
                      )}
                    </div>

                    {/* Subjects */}
                    {educator.subjects && educator.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {educator.subjects.map((subject, index) => (
                          <Badge key={index} variant="outline">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Education & Achievements */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Education & Achievements</span>
                      </div>
                      <div className="space-y-2">
                        {educator.education && educator.education.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Education:</strong>
                            <ul className="list-disc list-inside mt-1">
                              {educator.education.map((edu, index) => (
                                <li key={index}>{edu}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {educator.achievements && educator.achievements.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Achievements:</strong>
                            <ul className="list-disc list-inside mt-1">
                              {educator.achievements.map((achievement, index) => (
                                <li key={index}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Service Years */}
                    {educator.serviceYears && educator.serviceYears.length > 0 && (
                      <div className="pt-2 border-t">
                        <div className="text-sm text-muted-foreground">
                          <strong>Service Years:</strong> {getServiceYears(educator.serviceYears)}
                        </div>
                      </div>
                    )}
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