import { projects } from '@/content/projects';
import { site } from '@/content/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProjectDirectory } from '@/components/projects/ProjectDirectory';
import { createPageMetadata, PERSON_ID } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Software- & KI-Projekte: Case Studies',
  description: 'Technische Case Studies von Can Cadirci zu individuellen Webanwendungen, AI-Agenten, Computer Vision, Next.js, FastAPI, PostgreSQL und Docker.',
  path: '/projekte',
});

const projectsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Software- und KI-Projekte von Can Cadirci',
  url: `${site.url}/projekte`,
  inLanguage: 'de-DE',
  about: { '@id': PERSON_ID },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${site.url}/projekte/${project.slug}`,
      name: project.name,
    })),
  },
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
      <JsonLd data={projectsJsonLd} />
    </>
  );
}
