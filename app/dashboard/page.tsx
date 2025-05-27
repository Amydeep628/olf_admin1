"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AreaChart, BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { CalendarIcon, GraduationCap, Newspaper, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  // Sample data for charts
  const areaChartData = [
    { name: "Jan", alumni: 400 },
    { name: "Feb", alumni: 430 },
    { name: "Mar", alumni: 448 },
    { name: "Apr", alumni: 470 },
    { name: "May", alumni: 540 },
    { name: "Jun", alumni: 580 },
    { name: "Jul", alumni: 590 },
    { name: "Aug", alumni: 610 },
    { name: "Sep", alumni: 620 },
    { name: "Oct", alumni: 654 },
    { name: "Nov", alumni: 694 },
    { name: "Dec", alumni: 721 },
  ];

  const pieChartData = [
    { name: "2018-2022", value: 540 },
    { name: "2014-2018", value: 620 },
    { name: "2010-2014", value: 210 },
    { name: "2006-2010", value: 180 },
    { name: "Before 2006", value: 90 },
  ];

  const barChartData = [
    { name: "Annual Meet", attendees: 120 },
    { name: "Webinar", attendees: 80 },
    { name: "Reunion", attendees: 40 },
    { name: "Workshop", attendees: 30 },
    { name: "Career Fair", attendees: 50 },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "John Doe",
      action: "registered as alumni",
      time: "2 hours ago",
      avatar: "JD",
    },
    {
      id: 2,
      user: "Sarah Parker",
      action: "updated business listing",
      time: "5 hours ago",
      avatar: "SP",
    },
    {
      id: 3,
      user: "Michael Chen",
      action: "registered for Annual Meet 2025",
      time: "Yesterday",
      avatar: "MC",
    },
    {
      id: 4,
      user: "David Kumar",
      action: "added a new job posting",
      time: "Yesterday",
      avatar: "DK",
    },
    {
      id: 5,
      user: "Emily Johnson",
      action: "posted a news article",
      time: "2 days ago",
      avatar: "EJ",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Annual Alumni Meet 2025",
      date: "Mar 15, 2025",
      registrations: 84,
      badge: "Featured",
    },
    {
      id: 2,
      title: "Career Development Workshop",
      date: "Feb 28, 2025",
      registrations: 32,
      badge: "New",
    },
    {
      id: 3,
      title: "Industry Connect Webinar",
      date: "Feb 10, 2025",
      registrations: 53,
    },
  ];

  const metrics = [
    {
      title: "Total Alumni",
      value: "721",
      icon: Users,
      change: "+7.4% from last month",
      positive: true,
    },
    {
      title: "Upcoming Events",
      value: "5",
      icon: CalendarIcon,
      change: "+2 from last month",
      positive: true,
    },
    {
      title: "News Articles",
      value: "23",
      icon: Newspaper,
      change: "+4 from last month",
      positive: true,
    },
    {
      title: "Educators",
      value: "42",
      icon: GraduationCap,
      change: "Same as last month",
      positive: null,
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-2">
            <Button>Download Report</Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {metric.title}
                    </CardTitle>
                    <metric.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className={`text-xs ${metric.positive ? 'text-green-500' : metric.positive === false ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {metric.change}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Alumni Growth</CardTitle>
                  <CardDescription>
                    Alumni registrations over the past year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AreaChart
                    data={areaChartData}
                    categories={["alumni"]}
                    index="name"
                    colors={["chart-1"]}
                    valueFormatter={(value: number) => `${value} alumni`}
                    className="h-[300px]"
                  />
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Alumni by Batch</CardTitle>
                  <CardDescription>
                    Distribution of alumni by graduation year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChart
                    data={pieChartData}
                    category="value"
                    index="name"
                    valueFormatter={(value: number) => `${value} alumni`}
                    className="h-[300px]"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest actions from users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`/avatar-${activity.id}.png`} alt={activity.user} />
                          <AvatarFallback>{activity.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            <span className="font-semibold">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    Monitor upcoming event registrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex flex-col space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{event.title}</span>
                              {event.badge && (
                                <Badge variant="outline">{event.badge}</Badge>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              {event.date}
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            {event.registrations} registrations
                          </div>
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-7">
                <CardHeader>
                  <CardTitle>Event Attendance</CardTitle>
                  <CardDescription>
                    Number of attendees per event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={barChartData}
                    categories={["attendees"]}
                    index="name"
                    colors={["chart-2"]}
                    valueFormatter={(value: number) => `${value} attendees`}
                    className="h-[300px]"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Detailed analytics information will be displayed here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[400px] border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">Analytics content will be loaded here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  Generate and view reports for different activities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[400px] border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">Reports content will be loaded here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  View all system notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[400px] border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">Notifications content will be loaded here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}