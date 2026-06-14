import type { Photo, Project, ReportData } from "@/types";

const X_TWEET_LIMIT = 280;

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

export function buildXTweetText(
  project: Project,
  report: ReportData,
  photos: Photo[]
): string {
  const socialPost = report.social_kit.twitter.post.trim();

  if (socialPost) {
    return truncate(socialPost, X_TWEET_LIMIT);
  }

  const highlightPhoto =
    photos.find((photo) => photo.is_highlight && photo.caption) ??
    photos.find((photo) => photo.caption);

  let text = `${project.beneficiaries} lives impacted by ${project.volunteers} volunteers at ${project.project_name}. #CommunityImpact`;

  const reportSnippet = firstSentences(report.executive_summary || report.outcomes, 90);
  if (reportSnippet) {
    const combined = `${text} ${reportSnippet}`;
    if (combined.length <= X_TWEET_LIMIT) {
      text = combined;
    }
  }

  if (highlightPhoto?.caption) {
    const withPhoto = `${text} 📸 ${highlightPhoto.caption.trim()}`;
    if (withPhoto.length <= X_TWEET_LIMIT) {
      text = withPhoto;
    }
  }

  return truncate(text, X_TWEET_LIMIT);
}
