import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">OLF Alumni Portal Admin</h1>
          <p className="text-muted-foreground">
            Welcome to the administrative dashboard for OLF Alumni Portal.
          </p>
        </div>
        <div className="space-y-3">
          <Link href="/login" className="w-full">
            <Button className="w-full gap-2">
              Log In <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            Access the admin panel to manage alumni, events, and more.
          </p>
        </div>
      </Card>
    </div>
  );
}