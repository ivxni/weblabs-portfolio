import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { projects } from '@/content/projects';
import { ProjectDirectory } from './ProjectDirectory';

describe('ProjectDirectory', () => {
  it('gliedert alle Case Studies in verständliche Fachbereiche', () => {
    render(<ProjectDirectory projects={projects} />);

    expect(screen.getByRole('heading', { name: /AI Systems/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Product Platforms/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Privacy Engineering/ })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(projects.length);
  });

  it('ordnet Projekte dem richtigen Fachbereich zu', () => {
    render(<ProjectDirectory projects={projects} />);

    const aiSection = screen.getByRole('heading', { name: /AI Systems/ }).closest('section');
    const productSection = screen.getByRole('heading', { name: /Product Platforms/ }).closest('section');
    const privacySection = screen.getByRole('heading', { name: /Privacy Engineering/ }).closest('section');

    expect(aiSection).not.toBeNull();
    expect(productSection).not.toBeNull();
    expect(privacySection).not.toBeNull();

    expect(within(aiSection!).getByRole('link', { name: /ML Market Runtime/ })).toBeInTheDocument();
    expect(within(productSection!).getByRole('link', { name: /UnitFly/ })).toBeInTheDocument();
    expect(within(privacySection!).getByRole('link', { name: /VOiD/ })).toBeInTheDocument();
  });
});
