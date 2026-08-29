import type { Metadata } from 'next';
import { projects } from '@/content/projects';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProjectDirectory } from '@/components/projects/ProjectDirectory';

export const metadata: Metadata = {
  title: 'Projekte',
  description:
    'Case-Studies zu UnitFly, Paydos Lounge, Ipekten Dienstleistung, VOiD, WebLabs und weiteren Fullstack-, Mobile- und AI-Systemen.',
  alternates: { canonical: '/projekte' },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        label="Projekte"
        index="01 / Index"
        title="Systeme, die über eine Oberfläche hinausgehen."
        lead="Fullstack-Produkte, Computer Vision, Applied AI und technische Research-Systeme. Jede Case-Study zeigt Problem, Architekturentscheidungen, Grenzen und den belegbaren Stand."
      />

      <Section compact>
        <Container>
          <ProjectDirectory projects={projects} />
        </Container>
      </Section>
    </>
  );
}
