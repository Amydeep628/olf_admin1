"use client";

import { useState } from "react";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample data - replace with actual API call
const educators = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    avatar: "SW",
    department: "Computer Science",
    specialization: "Artificial Intelligence",
    email: "sarah.wilson@example.com",
    phone: "+1234567890",
    experience: "15 years",
    achievements: [
      "Best Teacher Award 2023",
      "Published 25 research papers",
      "IEEE Senior Member",
    ],
    status: "active",
  },
  {
    id: 2,
    name: "Prof. Michael Brown",
    avatar: "MB",
    department: "Electrical Engineering",
    specialization: "Power Systems",
    email: "michael.brown@example.com",
    phone: "+0987654321",
    experience: "20 years",
    achievements: [
      "Excellence in Teaching 2022",
      "5 Patents",
      "Department Head",
    ],
    status: "active",
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    avatar: "EC",
    department: "Mathematics",
    specialization: "Applied Mathematics",
    email: "emily.chen@example.com",
    phone: "+1122334455",
    experience: "12 years",
    achievements: [
      "Research Excellence Award",
      "Published 3 books",
      "PhD Supervisor",
    ],
    status: "active",
  },
];

export default function EducatorsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEducators = educators.filter((educator) =>
    educator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Educators</h2>
          <Button>
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
          {filteredEducators.map((educator) => (
            <Card key={educator.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`/avatars/${educator.id}.png`}
                        alt={educator.name}
                      />
                      <AvatarFallback>{educator.avatar}</AvatarFallback>
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
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>Manage Documents</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
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
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}