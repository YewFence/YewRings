import { getPageContent } from "@/lib/content-loader";
import { AboutContent } from "@/components/about/AboutContent";

export default function About() {
  const content = getPageContent("about");
  return <AboutContent content={content} />;
}
