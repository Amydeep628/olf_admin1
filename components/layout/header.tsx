"use client";

import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, Settings, User } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const router = useRouter();

  const handleLogout = () => {
    // Handle logout logic here
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex flex-1 items-center justify-between">
        <div className="hidden md:block">
          <h1 className="text-xl font-bold">OLF Alumni Portal</h1>
        </div>
        
        <div className="flex items-center gap-2 md:ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-2 border-b">
                <span className="font-semibold">Notifications</span>
                <Button variant="ghost" size="sm">
                  Mark all as read
                </Button>
              </div>
              <div className="max-h-80 overflow-auto">
                <div className="p-3 border-b hover:bg-accent transition-colors cursor-pointer">
                  <div className="font-medium">New Alumni Registration</div>
                  <div className="text-sm text-muted-foreground">John Doe registered as an alumni</div>
                  <div className="text-xs text-muted-foreground mt-1">2 minutes ago</div>
                </div>
                <div className="p-3 border-b hover:bg-accent transition-colors cursor-pointer">
                  <div className="font-medium">Event Registration</div>
                  <div className="text-sm text-muted-foreground">5 new registrations for Annual Meet</div>
                  <div className="text-xs text-muted-foreground mt-1">1 hour ago</div>
                </div>
                <div className="p-3 hover:bg-accent transition-colors cursor-pointer">
                  <div className="font-medium">New Business Listing</div>
                  <div className="text-sm text-muted-foreground">ABC Corp added a new business listing</div>
                  <div className="text-xs text-muted-foreground mt-1">Yesterday</div>
                </div>
              </div>
              <div className="p-2 border-t">
                <Button variant="ghost" className="w-full" size="sm">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <ModeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatar.png" alt="Avatar" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}