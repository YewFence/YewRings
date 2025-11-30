import { getPageContent } from "@/lib/content-loader";
import { NotFoundContent } from "@/components/NotFoundContent";

export default function NotFound() {
  const content = getPageContent("not-found");
  return <NotFoundContent content={content} />;
}
