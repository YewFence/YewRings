import { HealthContent } from "@/components/HealthContent";
import { getPageContent, getPageMetadata } from "@/lib/content-loader";

export const metadata = getPageMetadata("health");

export default function HealthPage() {
  const content = getPageContent("health");
  return <HealthContent content={content} />;
}
