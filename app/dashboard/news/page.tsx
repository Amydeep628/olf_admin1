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
import { FileText, MoreVertical, PenSquare, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample data - replace with actual API call
const articles = [
  {
    id: 1,
    title: "Alumni Success Story: Tech Startup Revolution",
    excerpt:
      "John Doe's journey from graduation to founding a successful tech startup...",
    author: "Admin Team",
    date: "2024-01-15",
    category: "Success Stories",
    status: "published",
    featured: true,
  },
  {
    id: 2,
    title: "Upcoming Campus Expansion Project",
    excerpt:
      "Details about the new campus facilities and development plans...",
    author: "Admin Team",
    date: "2024-01-10",
    category: "Campus News",
    status: "draft",
    featured: false,
  },
  {
    id: 3,
    title: "Annual Alumni Meet Highlights",
    excerpt:
      "Recap of the successful alumni gathering and key announcements...",
    author: "Admin Team",
    date: "2024-01-05",
    category: "Events",
    status: "published",
    featured: true,
  },
];

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">News & Updates</h2>
          <Button>
            <PenSquare className="mr-2 h-4 w-4" />
            Create Article
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <Card key={article.id}>
              <CardHeader className="space-y-1">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <CardDescription>
                      {new Date(article.date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Preview</DropdownMenuItem>
                      {article.status === "draft" ? (
                        <DropdownMenuItem>Publish</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>Unpublish</DropdownMenuItem>
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
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{article.category}</Badge>
                    <Badge
                      variant={article.status === "published" ? "default" : "secondary"}
                    >
                      {article.status}
                    </Badge>
                    {article.featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>By {article.author}</span>
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