"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarPlus, Users } from "lucide-react";

// Sample data - replace with actual API call
const events = [
  {
    id: 1,
    title: "Annual Alumni Meet 2025",
    date: "2025-03-15",
    time: "10:00 AM",
    location: "Main Campus",
    category: "Reunion",
    registrations: 84,
    status: "upcoming",
  },
  {
    id: 2,
    title: "Career Development Workshop",
    date: "2025-02-28",
    time: "2:00 PM",
    location: "Virtual",
    category: "Workshop",
    registrations: 32,
    status: "upcoming",
  },
  {
    id: 3,
    title: "Industry Connect Webinar",
    date: "2025-02-10",
    time: "11:00 AM",
    location: "Virtual",
    category: "Webinar",
    registrations: 53,
    status: "upcoming",
  },
];

export default function EventsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Events</h2>
          <Button>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Registrations</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div className="font-medium">{event.title}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {event.time}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{event.registrations}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}