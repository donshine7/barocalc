import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolByPath, tools } from "../../tools";
import ToolPageClient from "./tool-page-client";

export function generateStaticParams() {
  return tools.map((tool) => {
    const [, category, slug] = tool.path.split("/");
    return { category, slug };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const tool = getToolByPath(category, slug);
  if (!tool) return {};
  return {
    title: tool.name,
    description: tool.description,
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const tool = getToolByPath(category, slug);
  if (!tool) notFound();
  return <ToolPageClient tool={tool} />;
}
