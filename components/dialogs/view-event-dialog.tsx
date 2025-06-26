"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Calendar, 
  MapPin, 
  Users, 
  IndianRupee, 
  Target, 
  TrendingUp,
  User,
  Building,
  Wrench,
  Mail,
  Phone,
  Clock
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Registration {
  userId: string;
  registrationType: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
  // Participant specific
  adults?: number;
  children?: number;
  childrenUnder5?: number;
  seniors?: number;
  dietaryRestrictions?: string;
  amount?: number;
  // Sponsor specific
  sponsorshipLevel?: string;
  amountSponsored?: number;
  // Service Provider specific
  serviceType?: string;
  contractValue?: number;
}

interface EventDetails {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  category: string;
  registrationsCount: number;
  remainingCapacity: number;
  totalTargetedAmount: number;
  pricing: {
    adult: number;
    seniorCitizen: number;
    children: number;
  };
  registrationBreakdown: {
    adult: number;
    seniorCitizen: number;
    children: number;
  };
  registrationsByType: {
    participant: Registration[];
    sponsor: Registration[];
    serviceProvider: Registration[];
  };
}

interface ViewEventDialogProps {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewEventDialog({ eventId, open, onOpenChange }: ViewEventDialogProps) {
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!open || !eventId) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await fetch(
          `https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/events/${eventId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch event details');
        const data = await response.json();
        
        setEvent(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, open]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP");
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      return format(parseISO(dateTimeString), "PPp");
    } catch {
      return dateTimeString;
    }
  };

  const calculateRaisedAmount = () => {
    if (!event) return 0;
    
    const participantRevenue = (event.registrationBreakdown.adult * event.pricing.adult) +
                              (event.registrationBreakdown.seniorCitizen * event.pricing.seniorCitizen) +
                              (event.registrationBreakdown.children * event.pricing.children);
    
    const sponsorRevenue = event.registrationsByType.sponsor.reduce((sum, sponsor) => 
      sum + (sponsor.amountSponsored || 0), 0);
    
    const serviceProviderRevenue = event.registrationsByType.serviceProvider.reduce((sum, provider) => 
      sum + (provider.contractValue || 0), 0);
    
    return participantRevenue + sponsorRevenue + serviceProviderRevenue;
  };

  const calculateProgress = () => {
    if (!event || event.totalTargetedAmount === 0) return 0;
    const raised = calculateRaisedAmount();
    return Math.min((raised / event.totalTargetedAmount) * 100, 100);
  };

  const getRegistrationIcon = (type: string) => {
    switch (type) {
      case 'participant':
        return <User className="h-4 w-4" />;
      case 'sponsor':
        return <Building className="h-4 w-4" />;
      case 'serviceProvider':
        return <Wrench className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const renderParticipantDetails = (registration: Registration) => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Adults:</span> {registration.adults || 0}
        </div>
        <div>
          <span className="font-medium">Children:</span> {registration.children || 0}
        </div>
        <div>
          <span className="font-medium">Children Under 5:</span> {registration.childrenUnder5 || 0}
        </div>
        <div>
          <span className="font-medium">Seniors:</span> {registration.seniors || 0}
        </div>
      </div>
      {registration.dietaryRestrictions && (
        <div className="text-sm">
          <span className="font-medium">Dietary Restrictions:</span> {registration.dietaryRestrictions}
        </div>
      )}
      <div className="text-sm">
        <span className="font-medium">Amount Paid:</span> {formatCurrency(registration.amount || 0)}
      </div>
    </div>
  );

  const renderSponsorDetails = (registration: Registration) => (
    <div className="space-y-2">
      <div className="text-sm">
        <span className="font-medium">Sponsorship Level:</span> {registration.sponsorshipLevel || 'N/A'}
      </div>
      <div className="text-sm">
        <span className="font-medium">Amount Sponsored:</span> {formatCurrency(registration.amountSponsored || 0)}
      </div>
    </div>
  );

  const renderServiceProviderDetails = (registration: Registration) => (
    <div className="space-y-2">
      <div className="text-sm">
        <span className="font-medium">Service Type:</span> {registration.serviceType || 'N/A'}
      </div>
      <div className="text-sm">
        <span className="font-medium">Contract Value:</span> {formatCurrency(registration.contractValue || 0)}
      </div>
    </div>
  );

  const renderRegistrationTable = (registrations: Registration[], type: string) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>Registered At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
              No {type} registrations found
            </TableCell>
          </TableRow>
        ) : (
          registrations.map((registration) => (
            <TableRow key={registration.userId}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getRegistrationIcon(registration.registrationType)}
                  <span className="font-medium">{registration.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Mail className="h-3 w-3" />
                    <span>{registration.email}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3" />
                    <span>{registration.phone}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {type === 'participant' && renderParticipantDetails(registration)}
                {type === 'sponsor' && renderSponsorDetails(registration)}
                {type === 'serviceProvider' && renderServiceProviderDetails(registration)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3" />
                  <span>{formatDateTime(registration.registeredAt)}</span>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[95vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Event Details</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8 flex-1">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : event ? (
          <ScrollArea className="flex-1 h-full">
            <div className="space-y-6 pr-4 pb-4">
              {/* Event Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{event.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(event.date)} at {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {event.registrationsCount} registered / {event.capacity} capacity
                      </span>
                    </div>
                    <Badge variant="outline">{event.category}</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Financial Overview</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Target Amount:</span>
                          <span className="font-medium">{formatCurrency(event.totalTargetedAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Raised Amount:</span>
                          <span className="font-medium">{formatCurrency(calculateRaisedAmount())}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 mt-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${calculateProgress()}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span>{calculateProgress().toFixed(1)}% achieved</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {event.description && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Pricing Information */}
              <div>
                <h4 className="font-medium mb-3">Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm font-medium">Adult</div>
                    <div className="text-lg font-bold">{formatCurrency(event.pricing.adult)}</div>
                    <div className="text-xs text-muted-foreground">
                      {event.registrationBreakdown.adult} registered
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm font-medium">Senior Citizen</div>
                    <div className="text-lg font-bold">{formatCurrency(event.pricing.seniorCitizen)}</div>
                    <div className="text-xs text-muted-foreground">
                      {event.registrationBreakdown.seniorCitizen} registered
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm font-medium">Children</div>
                    <div className="text-lg font-bold">{formatCurrency(event.pricing.children)}</div>
                    <div className="text-xs text-muted-foreground">
                      {event.registrationBreakdown.children} registered
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Registrations by Type */}
              <div>
                <h4 className="font-medium mb-4">Registrations</h4>
                <Tabs defaultValue="participants" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="participants" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Participants ({event.registrationsByType.participant?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="sponsors" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Sponsors ({event.registrationsByType.sponsor?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="providers" className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Service Providers ({event.registrationsByType.serviceProvider?.length || 0})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="participants" className="mt-4">
                    {renderRegistrationTable(event.registrationsByType.participant || [], 'participant')}
                  </TabsContent>
                  
                  <TabsContent value="sponsors" className="mt-4">
                    {renderRegistrationTable(event.registrationsByType.sponsor || [], 'sponsor')}
                  </TabsContent>
                  
                  <TabsContent value="providers" className="mt-4">
                    {renderRegistrationTable(event.registrationsByType.serviceProvider || [], 'serviceProvider')}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center text-muted-foreground flex-1">
            Failed to load event details
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}