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
  Building2,
  MapPin,
  MoreVertical,
  Phone,
  Search,
  Mail,
  Globe,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample data - replace with actual API call
const businesses = [
  {
    id: 1,
    name: "Tech Solutions Inc",
    owner: "John Smith",
    category: "Technology",
    location: "New York, USA",
    phone: "+1234567890",
    email: "contact@techsolutions.com",
    website: "www.techsolutions.com",
    status: "approved",
    description:
      "Leading provider of innovative technology solutions for businesses...",
  },
  {
    id: 2,
    name: "Creative Design Studio",
    owner: "Sarah Johnson",
    category: "Design",
    location: "London, UK",
    phone: "+0987654321",
    email: "hello@creativedesign.com",
    website: "www.creativedesign.com",
    status: "pending",
    description:
      "Professional design services specializing in branding and digital media...",
  },
  {
    id: 3,
    name: "Global Consulting Group",
    owner: "Michael Chen",
    category: "Consulting",
    location: "Singapore",
    phone: "+1122334455",
    email: "info@globalconsulting.com",
    website: "www.globalconsulting.com",
    status: "approved",
    description:
      "International consulting firm offering strategic business solutions...",
  },
];

export default function BusinessPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Business Directory
          </h2>
          <Button>
            <Building2 className="mr-2 h-4 w-4" />
            Add Business
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search businesses..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBusinesses.map((business) => (
            <Card key={business.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{business.name}</CardTitle>
                    <CardDescription>{business.owner}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Listing</DropdownMenuItem>
                      {business.status === "pending" && (
                        <DropdownMenuItem>Approve</DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {business.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{business.category}</Badge>
                    <Badge
                      variant={
                        business.status === "approved"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {business.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{business.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{business.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{business.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span>{business.website}</span>
                    </div>
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