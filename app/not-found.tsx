import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center p-8 text-center">
      <FileQuestion className="h-12 w-12 text-slate-400" />
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex lux-btn-primary"
      >
        Go Home
      </Link>
    </div>
  );
}
