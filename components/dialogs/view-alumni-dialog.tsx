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
import { Loader2, ExternalLink, Linkedin, Twitter, Globe, Award, Users } from "lucide-react";

interface ViewAlumniDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewAlumniDialog({ userId, open, onOpenChange }: ViewAlumniDialogProps) {
  const [alumni, setAlumni] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumniDetails = async () => {
      if (!open) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await fetch(
          `https://7wgbsyva7h.execute-api.ap-south-1.amazonaws.com/dev/profile/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch alumni details');
        const { profile } = await response.json();
        
        // Transform array fields to ensure they contain only strings
        const transformedProfile = {
          ...profile,
          areasOfExpertise: profile.areasOfExpertise?.map((item: any) => 
            typeof item === 'object' && item.value ? item.value : String(item || '')
          ).filter((item: string) => item.trim() !== '') || [],
          education: profile.education?.map((item: any) => 
            typeof item === 'object' && item.value ? item.value : String(item || '')
          ).filter((item: string) => item.trim() !== '') || [],
          experience: profile.experience?.map((item: any) => 
            typeof item === 'object' && item.value ? item.value : String(item || '')
          ).filter((item: string) => item.trim() !== '') || [],
          achievements: profile.achievements?.map((item: any) => 
            typeof item === 'object' && item.value ? item.value : String(item || '')
          ).filter((item: string) => item.trim() !== '') || [],
        };
        
        setAlumni(transformedProfile);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniDetails();
  }, [userId, open]);

  const renderMultipleEntries = (entries: string[] | undefined, title: string) => {
    if (!entries || entries.length === 0) return null;
    
    return (
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <Separator className="my-2" />
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <div key={index} className="p-3 bg-muted/50 rounded-md">
              <p className="text-sm">{entry}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAreasOfExpertise = (areas: string[] | undefined) => {
    if (!areas || areas.length === 0) return null;
    
    return (
      <div>
        <h3 className="text-lg font-semibold">Areas of Expertise</h3>
        <Separator className="my-2" />
        <div className="flex flex-wrap gap-2">
          {areas.map((area, index) => (
            <Badge key={index} variant="secondary">
              {area}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const renderSpecialDesignations = () => {
    const hasDesignations = alumni?.distinguishedAlumni || alumni?.batchAmbassadors;
    if (!hasDesignations) return null;

    return (
      <div>
        <h3 className="text-lg font-semibold">Special Designations</h3>
        <Separator className="my-2" />
        <div className="flex flex-wrap gap-2">
          {alumni.distinguishedAlumni && (
            <Badge variant="default" className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              Distinguished Alumni
            </Badge>
          )}
          {alumni.batchAmbassadors && (
            <Badge variant="default" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Batch Ambassador
            </Badge>
          )}
        </div>
      </div>
    );
  };

  const renderSocialLinks = () => {
    const hasLinks = alumni?.linkedin || alumni?.twitter || alumni?.website;
    if (!hasLinks) return null;

    return (
      <div>
        <h3 className="text-lg font-semibold">Social Links</h3>
        <Separator className="my-2" />
        <div className="flex flex-wrap gap-2">
          {alumni.linkedin && (
            <Button variant="outline" size="sm" asChild>
              <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          )}
          {alumni.twitter && (
            <Button variant="outline" size="sm" asChild>
              <a href={alumni.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          )}
          {alumni.website && (
            <Button variant="outline" size="sm" asChild>
              <a href={alumni.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-2" />
                Website
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Alumni Profile</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : alumni ? (
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <Separator className="my-2" />
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">Name</dt>
                    <dd className="text-sm font-medium">{alumni.name || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Batch</dt>
                    <dd className="text-sm font-medium">{alumni.batch || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Email</dt>
                    <dd className="text-sm font-medium">{alumni.email || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Mobile</dt>
                    <dd className="text-sm font-medium">{alumni.mobile || 'Not provided'}</dd>
                  </div>
                </dl>
              </div>

              {/* Special Designations */}
              {renderSpecialDesignations()}

              {/* Bio */}
              {alumni.bio && alumni.bio.trim() !== '' && (
                <div>
                  <h3 className="text-lg font-semibold">Bio</h3>
                  <Separator className="my-2" />
                  <div className="p-3 bg-muted/50 rounded-md">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{alumni.bio}</p>
                  </div>
                </div>
              )}

              {/* Areas of Expertise */}
              {renderAreasOfExpertise(alumni.areasOfExpertise)}

              {/* Social Links */}
              {renderSocialLinks()}

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold">Location</h3>
                <Separator className="my-2" />
                <dl className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <dt className="text-sm text-muted-foreground">Address</dt>
                    <dd className="text-sm font-medium">{alumni.address || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">City</dt>
                    <dd className="text-sm font-medium">{alumni.city || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">State</dt>
                    <dd className="text-sm font-medium">{alumni.state || 'Not provided'}</dd>
                  </div>
                </dl>
              </div>

              {/* Education */}
              {renderMultipleEntries(alumni.education, "Education")}

              {/* Experience */}
              {renderMultipleEntries(alumni.experience, "Experience")}

              {/* Achievements */}
              {renderMultipleEntries(alumni.achievements, "Achievements")}

              {/* Membership Details */}
              <div>
                <h3 className="text-lg font-semibold">Membership Details</h3>
                <Separator className="my-2" />
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">Membership Status</dt>
                    <dd className="text-sm font-medium">{alumni.membership_status || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Membership Number</dt>
                    <dd className="text-sm font-medium">{alumni.membership_no || 'Not provided'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Failed to load alumni details
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}