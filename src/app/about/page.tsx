import { getPageContent, getPageMetadata } from "@/lib/content-loader";
import { AboutContent } from "@/components/about/AboutContent";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('about');
}

export default function About() {
  const content = getPageContent("about");
  return <AboutContent content={content} />;
}
