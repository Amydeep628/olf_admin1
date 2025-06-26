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
import { CalendarPlus, Users, Loader2, MoreVertical, IndianRupee, Target, TrendingUp } from "lucide-react";
import { format, parseISO, isSameDay } from "date-fns";
import { toast } from "sonner";
import { EventDialog } from "@/components/dialogs/event-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  venue: string;
  capacity?: number;
  category?: string;
  registrationsCount: number;
  remainingCapacity: number;
  totalTargetedAmount?: number;
  pricing?: {
    adult: number;
    seniorCitizen: number;
    children: number;
  };
  registrationBreakdown?: {
    adult: number;
    seniorCitizen: number;
    children: number;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  hasMore: boolean;
}

export default function EventsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    hasMore: false,
  });

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
      
      // Transform the API response to match our Event interface
      const transformedEvents = data.events?.map((event: any) => ({
        id: event.id,
        title: event.title || "Untitled Event",
        description: event.description || "",
        date: event.date,
        time: event.time || "00:00",
        venue: event.venue || "TBD",
        capacity: event.capacity || event.remainingCapacity || 0,
        category: event.category || "General",
        registrationsCount: event.registrationsCount || 0,
        remainingCapacity: event.remainingCapacity || 0,
        totalTargetedAmount: event.totalTargetedAmount || 0,
        pricing: event.pricing || {
          adult: 0,
          seniorCitizen: 0,
          children: 0,
        },
        registrationBreakdown: event.registrationBreakdown || {
          adult: 0,
          seniorCitizen: 0,
          children: 0,
        },
      })) || [];

      console.log("Transformed events:", transformedEvents);
      setEvents(transformedEvents);
      setPagination(data.pagination || { page: 1, limit: 10, hasMore: false });
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
    setSelectedEvent(undefined);
    setDialogOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        `https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  // Calculate raised amount based on registrations and pricing
  const calculateRaisedAmount = (event: Event) => {
    if (!event.pricing || !event.registrationBreakdown) {
      return 0;
    }

    const adultRevenue = (event.registrationBreakdown.adult || 0) * (event.pricing.adult || 0);
    const seniorRevenue = (event.registrationBreakdown.seniorCitizen || 0) * (event.pricing.seniorCitizen || 0);
    const childrenRevenue = (event.registrationBreakdown.children || 0) * (event.pricing.children || 0);

    return adultRevenue + seniorRevenue + childrenRevenue;
  };

  // Calculate progress percentage towards target
  const calculateProgress = (event: Event) => {
    const raised = calculateRaisedAmount(event);
    const target = event.totalTargetedAmount || 0;
    
    if (target === 0) return 0;
    return Math.min((raised / target) * 100, 100);
  };

  // Get event dates for calendar highlighting
  const getEventDates = () => {
    return events.map(event => {
      try {
        return parseISO(event.date);
      } catch {
        return null;
      }
    }).filter(Boolean) as Date[];
  };

  // Check if a date has events
  const hasEvents = (date: Date) => {
    return events.some(event => {
      try {
        const eventDate = parseISO(event.date);
        return isSameDay(eventDate, date);
      } catch {
        return false;
      }
    });
  };

  // Get count of events for a specific date
  const getEventCountForDate = (date: Date) => {
    return events.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        return isSameDay(eventDate, date);
      } catch {
        return false;
      }
    }).length;
  };

  // Get events for selected date
  const getEventsForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return events;
    
    return events.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        return isSameDay(eventDate, selectedDate);
      } catch {
        return false;
      }
    });
  };

  const filteredEvents = getEventsForDate(date);

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `₹${price}`;
  };

  const getPriceRange = (pricing?: { adult: number; seniorCitizen: number; children: number }) => {
    if (!pricing) return "Free";
    
    const prices = [pricing.adult, pricing.seniorCitizen, pricing.children];
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === 0 && maxPrice === 0) return "Free";
    if (minPrice === maxPrice) return formatPrice(minPrice);
    return `₹${minPrice} - ₹${maxPrice}`;
  };

  const formatEventDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP");
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
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
              <CardTitle>
                {date ? `Events for ${format(date, "PPP")}` : "All Events"}
                {date && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Pricing</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Registrations</TableHead>
                      <TableHead>Financial Progress</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredEvents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          {date ? "No events found for this date" : "No events found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEvents.map((event) => {
                        const raisedAmount = calculateRaisedAmount(event);
                        const progress = calculateProgress(event);
                        const targetAmount = event.totalTargetedAmount || 0;

                        return (
                          <TableRow key={event.id}>
                            <TableCell>
                              <div className="font-medium">{event.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {event.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div>{formatEventDate(event.date)}</div>
                                {event.time && (
                                  <div className="text-sm text-muted-foreground">
                                    {event.time}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{event.venue}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <IndianRupee className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{getPriceRange(event.pricing)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {event.remainingCapacity} spots left
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{event.registrationsCount}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                {targetAmount > 0 ? (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <Target className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm font-medium">
                                        {formatCurrency(raisedAmount)} / {formatCurrency(targetAmount)}
                                      </span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2">
                                      <div 
                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <TrendingUp className="h-3 w-3 text-green-600" />
                                      <span className="text-xs text-muted-foreground">
                                        {progress.toFixed(1)}% achieved
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      {formatCurrency(raisedAmount)} raised
                                    </span>
                                  </div>
                                )}
                              </div>
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
                                  <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                                    Edit Event
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteEvent(event.id)}
                                  >
                                    Delete Event
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {!date && (
                <div className="mt-4 flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setDate(new Date())}
                  >
                    Filter by Today
                  </Button>
                </div>
              )}
              
              {date && (
                <div className="mt-4 flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setDate(undefined)}
                  >
                    Show All Events
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Event Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  hasEvent: getEventDates(),
                }}
                modifiersStyles={{
                  hasEvent: {
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    fontWeight: 'bold',
                    position: 'relative',
                  },
                }}
              />
              
              <div className="mt-4 space-y-3">
                <div className="text-sm font-medium">Legend:</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-primary rounded flex items-center justify-center">
                      <span className="text-primary-foreground text-xs font-bold">1</span>
                    </div>
                    <span>Days with events (number shows event count)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 border-2 border-primary rounded"></div>
                    <span>Selected date</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Click on a date to filter events for that day. Highlighted dates show the number of events scheduled.
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium mb-2">Quick Stats</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Events:</span>
                    <span className="font-medium">{events.length}</span>
                  </div>
                  {date && (
                    <div className="flex justify-between">
                      <span>Events Today:</span>
                      <span className="font-medium">{filteredEvents.length}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>This Month:</span>
                    <span className="font-medium">
                      {events.filter(event => {
                        try {
                          const eventDate = parseISO(event.date);
                          const now = new Date();
                          return eventDate.getMonth() === now.getMonth() && 
                                 eventDate.getFullYear() === now.getFullYear();
                        } catch {
                          return false;
                        }
                      }).length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <EventDialog
        event={selectedEvent}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchEvents}
      />
    </DashboardLayout>
  );
}