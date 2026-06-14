"use client";

import { useState } from "react";
import { CheckCheck, Copy, Share2 } from "lucide-react";
import type { SocialKit } from "@/types";

export interface SocialMediaKitProps {
  socialKit: SocialKit;
}

function formatHashtag(tag: string): string {
  return tag.startsWith("#") ? tag : `#${tag}`;
}

function buildInstagramCopyText(socialKit: SocialKit): string {
  const hashtags = socialKit.instagram.hashtags.map(formatHashtag).join(" ");
  return hashtags
    ? `${socialKit.instagram.caption}\n\n${hashtags}`
    : socialKit.instagram.caption;
}

export function SocialMediaKit({ socialKit }: SocialMediaKitProps) {
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  async function handleCopy(platform: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedPlatform(platform);
    window.setTimeout(() => setCopiedPlatform(null), 2000);
  }

  function CopyButton({ platform, text }: { platform: string; text: string }) {
    const isCopied = copiedPlatform === platform;

    return (
      <button
        type="button"
        onClick={() => handleCopy(platform, text)}
        className={
          isCopied
            ? "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-green-600"
            : "inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        }
      >
        {isCopied ? (
          <>
            <CheckCheck className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy
          </>
        )}
      </button>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 rounded-t-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-3">
          <Share2 className="h-4 w-4 text-white" />
          <span className="text-sm font-semibold text-white">Instagram</span>
        </div>
        <div className="space-y-4 p-4">
          <p className="text-sm text-slate-700">{socialKit.instagram.caption}</p>
          {socialKit.instagram.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {socialKit.instagram.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-600"
                >
                  {formatHashtag(tag)}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-slate-200 p-4">
          <CopyButton platform="instagram" text={buildInstagramCopyText(socialKit)} />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="rounded-t-xl bg-blue-700 px-4 py-3">
          <span className="text-sm font-semibold text-white">LinkedIn</span>
        </div>
        <div className="p-4">
          <p className="text-sm text-slate-700">{socialKit.linkedin.post}</p>
        </div>
        <div className="border-t border-slate-200 p-4">
          <CopyButton platform="linkedin" text={socialKit.linkedin.post} />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="rounded-t-xl bg-slate-900 px-4 py-3">
          <span className="text-sm font-semibold text-white">X (Twitter)</span>
        </div>
        <div className="space-y-2 p-4">
          <p className="text-sm text-slate-700">{socialKit.twitter.post}</p>
          <p className="text-xs text-slate-400">
            {socialKit.twitter.post.length} / 280 characters
          </p>
        </div>
        <div className="border-t border-slate-200 p-4">
          <CopyButton platform="twitter" text={socialKit.twitter.post} />
        </div>
      </div>
    </div>
  );
}
