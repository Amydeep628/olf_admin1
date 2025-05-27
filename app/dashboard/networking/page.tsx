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
import {
  Briefcase,
  Building,
  Calendar,
  GraduationCap,
  MoreVertical,
  Network,
  Search,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data - replace with actual API call
const mentorshipPrograms = [
  {
    id: 1,
    title: "Tech Career Guidance",
    mentor: "John Smith",
    industry: "Technology",
    duration: "6 months",
    participants: 15,
    status: "active",
    description:
      "Guidance for students interested in technology careers...",
  },
  {
    id: 2,
    title: "Business Leadership",
    mentor: "Sarah Johnson",
    industry: "Management",
    duration: "3 months",
    participants: 10,
    status: "upcoming",
    description:
      "Leadership development program for aspiring managers...",
  },
];

const jobOpportunities = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Corp",
    location: "New York, USA",
    type: "Full-time",
    postedBy: "Alumni HR Team",
    postedDate: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    title: "Marketing Manager",
    company: "Global Brands",
    location: "London, UK",
    type: "Full-time",
    postedBy: "Career Cell",
    postedDate: "2024-01-10",
    status: "active",
  },
];

const alumniConnections = [
  {
    id: 1,
    title: "Tech Alumni Network",
    members: 150,
    category: "Technology",
    events: 5,
    status: "active",
    description:
      "Network of alumni working in technology sector...",
  },
  {
    id: 2,
    title: "Business Leaders Forum",
    members: 100,
    category: "Business",
    events: 3,
    status: "active",
    description:
      "Forum for alumni in leadership positions...",
  },
];

export default function NetworkingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Networking</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Create Group
            </Button>
            <Button>
              <Briefcase className="mr-2 h-4 w-4" />
              Post Job
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        <Tabs defaultValue="mentorship" className="space-y-4">
          <TabsList>
            <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
            <TabsTrigger value="jobs">Job Opportunities</TabsTrigger>
            <TabsTrigger value="connections">Alumni Connections</TabsTrigger>
          </TabsList>

          <TabsContent value="mentorship" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {mentorshipPrograms.map((program) => (
                <Card key={program.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle>{program.title}</CardTitle>
                        <CardDescription>
                          Mentor: {program.mentor}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Program</DropdownMenuItem>
                          <DropdownMenuItem>Manage Participants</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {program.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{program.industry}</Badge>
                        <Badge variant="secondary">{program.duration}</Badge>
                        <Badge
                          variant={
                            program.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {program.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{program.participants} participants</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {jobOpportunities.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>{job.company}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Posting</DropdownMenuItem>
                          <DropdownMenuItem>View Applications</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{job.type}</Badge>
                        <Badge variant="secondary">{job.location}</Badge>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>Posted by: {job.postedBy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Posted on:{" "}
                            {new Date(job.postedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="connections" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {alumniConnections.map((connection) => (
                <Card key={connection.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle>{connection.title}</CardTitle>
                        <CardDescription>
                          {connection.members} members
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Manage Members</DropdownMenuItem>
                          <DropdownMenuItem>Schedule Event</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {connection.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{connection.category}</Badge>
                        <Badge variant="secondary">
                          {connection.events} upcoming events
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Network className="h-4 w-4" />
                          <span>{connection.members} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          <span>{connection.category}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}