'use client';

/**
 * megaMenuData
 *
 * Typed data definitions for the MegaMenuHeader navigation.
 * All menu structure is centralized here for easy maintenance.
 */

import { type ComponentType } from 'react';
import { FiEdit3, FiSearch, FiBarChart2, FiGlobe, FiZap, FiCalendar } from 'react-icons/fi';

// ── Types ─────────────────────────────────────────────────────

export interface MegaMenuItem {
  icon: ComponentType;
  label: string;
  description: string;
  href: string;
}

export interface SolutionItem {
  label: string;
  description: string;
  href: string;
}

export interface ResourceItem {
  label: string;
  href: string;
  external?: boolean;
}

// ── Data ──────────────────────────────────────────────────────

export const FEATURES_MENU: MegaMenuItem[] = [
  {
    icon: FiEdit3,
    label: 'AI Content Studio',
    description: 'Create SEO + GEO optimized articles',
    href: '/features/content-studio',
  },
  {
    icon: FiSearch,
    label: 'Keyword Intelligence',
    description: 'AI-powered keyword research & tracking',
    href: '/features/keyword-intelligence',
  },
  {
    icon: FiBarChart2,
    label: 'Analytics Dashboard',
    description: 'Track rankings, traffic & PR scores',
    href: '/features/analytics',
  },
  {
    icon: FiGlobe,
    label: 'CMS Publishing',
    description: 'One-click publish to WordPress, Shopify',
    href: '/features/publishing',
  },
  {
    icon: FiZap,
    label: 'GEO Optimization',
    description: 'Get cited by ChatGPT & AI search',
    href: '/features/geo-optimization',
  },
  {
    icon: FiCalendar,
    label: 'Content Calendar',
    description: 'Plan and schedule your content',
    href: '/features/content-calendar',
  },
];

export const SOLUTIONS_MENU: SolutionItem[] = [
  {
    label: 'Small Business Owners',
    description: 'Replace your $2,500/mo agency',
    href: '/solutions/small-business',
  },
  {
    label: 'Marketing Teams',
    description: 'Scale content production 10x',
    href: '/solutions/marketing-teams',
  },
  {
    label: 'Agencies',
    description: 'White-label AI content for clients',
    href: '/solutions/agencies',
  },
  {
    label: 'E-commerce',
    description: 'Product content at scale',
    href: '/solutions/ecommerce',
  },
];

export const RESOURCES_MENU: ResourceItem[] = [
  { label: 'Blog & Guides', href: '/resources' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];
