import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { INDUSTRY_TEMPLATES, IndustryId } from '@/convex/phoo/industryTemplates';
import IndustrySolutionClient from './IndustrySolutionClient';

export function generateStaticParams() {
  return Object.keys(INDUSTRY_TEMPLATES).map((id) => ({
    industry: id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ industry: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const template = INDUSTRY_TEMPLATES[resolvedParams.industry as IndustryId];
  if (!template) {
    return { title: 'Solution Not Found | Phoo' };
  }

  return {
    title: `AI Content Generation for ${template.name} | Phoo`,
    description: `Automate your SEO and content strategy for ${template.name}. Get your programmatic content plan and start ranking.`,
  };
}

export default async function IndustrySolutionPage({ params }: { params: Promise<{ industry: string }> }) {
  const resolvedParams = await params;
  const template = INDUSTRY_TEMPLATES[resolvedParams.industry as IndustryId];
  
  if (!template) {
    notFound();
  }

  return <IndustrySolutionClient industryId={resolvedParams.industry as IndustryId} />;
}
