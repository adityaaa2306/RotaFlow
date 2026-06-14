import { SubmitDemoPanel } from "@/components/SubmitDemoPanel";

export default function SubmitPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Submit Project</h1>
        <p className="text-muted-foreground">
          Describe your event in natural language. Manual form and AI extraction coming next.
        </p>
      </div>
      <SubmitDemoPanel />
    </div>
  );
}
