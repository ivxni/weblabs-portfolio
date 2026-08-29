import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { ProjectSection } from '@/components/home/ProjectSection';
import { ClosingCta } from '@/components/home/ClosingCta';
import { WorkingPrinciples } from '@/components/home/ProfileSections';
import { FocusTabs } from '@/components/home/FocusTabs';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

/**
 * Die Sektionsfolge ist durchkomponiert. Keine zwei benachbarten Sektionen
 * haben dieselbe Form — und der Rhythmus wechselt zwischen ruhig und laut:
 *
 *   1 Hero          Person und Positionierung
 *   2 Fachbereiche  drei Wege in dieselbe technische Arbeitsweise
 *   3 Projekte      sichtbare Belege statt weiterer Behauptungen
 *   4 Arbeitsweise  drei knappe Prinzipien
 *   5 Abschluss     Kontakt als einziges Ziel
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <FocusTabs />

      <ProjectSection />

      <WorkingPrinciples />

      <ClosingCta />
    </>
  );
}
