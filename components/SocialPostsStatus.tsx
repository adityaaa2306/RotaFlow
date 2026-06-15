import Link from "next/link";
import { CheckCircle2, ExternalLink, Instagram } from "lucide-react";
import type { SocialPosts } from "@/types";

export interface SocialPostsStatusProps {
  socialPosts?: SocialPosts;
}

const PLATFORMS = [
  {
    key: "instagram" as const,
    label: "Instagram",
    icon: Instagram,
    accent: "text-pink-600",
  },
  {
    key: "linkedin" as const,
    label: "LinkedIn",
    icon: null,
    accent: "text-blue-700",
  },
  {
    key: "x" as const,
    label: "X",
    icon: null,
    accent: "text-slate-900",
  },
];

function formatPublishedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SocialPostsStatus({ socialPosts }: SocialPostsStatusProps) {
  return (
    <div className="lux-card">
      <h3 className="text-base font-semibold text-slate-800">Publication Status</h3>
      <p className="mt-1 text-sm text-slate-500">
        See where this project&apos;s content has been shared.
      </p>

      <ul className="mt-4 space-y-3">
        {PLATFORMS.map(({ key, label, icon: Icon, accent }) => {
          const post = socialPosts?.[key];

          return (
            <li
              key={key}
              className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3"
            >
              <div className="flex items-start gap-3">
                {Icon ? (
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${accent}`} />
                ) : key === "x" ? (
                  <svg
                    viewBox="0 0 24 24"
                    className={`mt-0.5 h-5 w-5 shrink-0 fill-current ${accent}`}
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ) : (
                  <span className={`mt-0.5 text-sm font-bold ${accent}`}>in</span>
                )}
                <div>
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  {post ? (
                    <p className="mt-0.5 text-xs text-slate-500">
                      Published
                      {post.username ? ` as @${post.username}` : ""}
                      {" · "}
                      {formatPublishedAt(post.published_at)}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {key === "linkedin"
                        ? "Not published via app — copy content below to post manually"
                        : "Not published yet"}
                    </p>
                  )}
                </div>
              </div>

              {post ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Live
                </span>
              ) : null}

              {post?.url ? (
                <Link
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-rota-blue hover:underline"
                >
                  View
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
