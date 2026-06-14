import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">ImpactPilot AI</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Tell us what happened. We&apos;ll handle the paperwork.
        </p>
        <p className="max-w-2xl text-muted-foreground">
          Describe your event through text or voice. We extract structured data,
          generate impact reports, SDG alignment, social media kits, and PDF exports.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/submit">Submit a Project</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Submit</CardTitle>
            <CardDescription>Manual form or conversational AI input</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" asChild className="w-full">
              <Link href="/submit">Get started</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Track impact metrics across projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" asChild className="w-full">
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Archive</CardTitle>
            <CardDescription>Browse past projects and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" asChild className="w-full">
              <Link href="/archive">Browse archive</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
