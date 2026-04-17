import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { INDUSTRY_TEMPLATES, IndustryId } from '@/convex/phoo/industryTemplates';
import IndustrySolutionClient from './IndustrySolutionClient';

export function generateStaticParams() {
  return Object.keys(INDUSTRY_TEMPLATES).map((id) => ({
    industry: id,
  }));
}

export function generateMetadata({ params }: { params: { industry: string } }): Metadata {
  const template = INDUSTRY_TEMPLATES[params.industry as IndustryId];
  if (!template) {
    return { title: 'Solution Not Found | Phoo' };
  }

  return {
    title: `AI Content Generation for ${template.name} | Phoo`,
    description: `Automate your SEO and content strategy for ${template.name}. Get your programmatic content plan and start ranking.`,
  };
}

export default function IndustrySolutionPage({ params }: { params: { industry: string } }) {
  const template = INDUSTRY_TEMPLATES[params.industry as IndustryId];
  
  if (!template) {
    notFound();
  }

  return <IndustrySolutionClient industryId={params.industry as IndustryId} />;
}
