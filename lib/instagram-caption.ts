import type { Photo, Project, ReportData } from "@/types";

const INSTAGRAM_CAPTION_LIMIT = 2200;

function formatHashtag(tag: string): string {
  return tag.startsWith("#") ? tag : `#${tag}`;
}

function truncate(text: string, maxLength: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return `${trimmed.slice(0, maxLength - 3).trim()}...`;
}

function firstSentences(text: string, maxLength: number): string {
  if (!text.trim()) {
    return "";
  }

  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  let result = "";

  for (const sentence of sentences) {
    const next = `${result}${sentence}`.trim();
    if (next.length > maxLength) {
      break;
    }
    result = next;
  }

  return result || truncate(text, maxLength);
}

export function buildInstagramCaption(
  project: Project,
  report: ReportData,
  photos: Photo[]
): string {
  const socialCaption = report.social_kit.instagram.caption.trim();
  const hashtags = report.social_kit.instagram.hashtags
    .map(formatHashtag)
    .join(" ");

  const highlightPhoto =
    photos.find((photo) => photo.is_highlight && photo.caption) ??
    photos.find((photo) => photo.caption);

  const reportLines = [
    firstSentences(report.executive_summary, 400),
    firstSentences(report.outcomes, 300),
    firstSentences(report.closing_statement, 200),
  ].filter(Boolean);

  const reportBlock = reportLines.join("\n\n");

  const parts = [
    socialCaption || `${project.project_name} by ${project.club_name}`,
    reportBlock,
    highlightPhoto?.caption ? `📸 ${highlightPhoto.caption.trim()}` : "",
    hashtags,
  ].filter(Boolean);

  let caption = parts.join("\n\n");

  if (caption.length > INSTAGRAM_CAPTION_LIMIT) {
    const withoutHashtags = parts.slice(0, -1).join("\n\n");
    const hashtagBudget = INSTAGRAM_CAPTION_LIMIT - hashtags.length - 2;
    caption = `${truncate(withoutHashtags, Math.max(hashtagBudget, 500))}\n\n${hashtags}`;
  }

  return truncate(caption, INSTAGRAM_CAPTION_LIMIT);
}
