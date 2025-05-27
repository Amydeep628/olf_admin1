"use client";

import { useState, useEffect } from "react";
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
import { CalendarPlus, Users, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  registrations: number;
  status: string;
}

export default function EventsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        "https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = () => {
    // TODO: Implement create event dialog
    toast.info("Create event functionality coming soon!");
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Events</h2>
          <Button onClick={handleCreateEvent}>
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : events.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No events found
                        </TableCell>
                      </TableRow>
                    ) : (
                      events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>
                            <div className="font-medium">{event.title}</div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                {format(new Date(event.date), "PPP")}
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
                      ))
                    )}
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