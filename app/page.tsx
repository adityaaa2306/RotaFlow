import Link from "next/link";
import { FileText, MessageSquare, Target } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Extraction",
    description:
      "Describe your event in plain language and let AI structure the data for you.",
  },
  {
    icon: Target,
    title: "SDG Mapping",
    description:
      "Every project is automatically aligned to the right UN Sustainable Development Goals.",
  },
  {
    icon: FileText,
    title: "Instant Reports",
    description:
      "Generate professional impact reports, social posts, and PDF exports in one click.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <section className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <h1 className="text-4xl font-bold text-slate-900">Tell us what happened.</h1>
        <p className="text-4xl font-bold text-blue-600">We&apos;ll handle the paperwork.</p>
        <p className="mt-6 max-w-2xl text-sm text-slate-600">
          ImpactPilot AI is a conversational documentation copilot that turns volunteer
          stories into structured reports, SDG alignment, and share-ready content.
        </p>
        <Link
          href="/submit"
          className="mt-8 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Submit a Project →
        </Link>
      </section>

      <section className="mx-auto mt-16 grid w-full max-w-4xl gap-6 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <Icon className="mb-4 h-8 w-8 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-800">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
