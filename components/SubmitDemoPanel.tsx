"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SAMPLE_NARRATIVE_1 } from "@/lib/sample-data";

export function SubmitDemoPanel() {
  const [narrative, setNarrative] = useState("");

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" onClick={() => setNarrative(SAMPLE_NARRATIVE_1)}>
          Load Demo
        </Button>
        <span className="text-sm text-muted-foreground">
          Pre-fills Sample Narrative 1 (blood donation camp)
        </span>
      </div>
      <textarea
        className="min-h-[160px] w-full rounded-md border bg-background px-3 py-2 text-sm"
        placeholder="Describe your project in natural language, or click Load Demo..."
        value={narrative}
        onChange={(event) => setNarrative(event.target.value)}
      />
    </div>
  );
}
