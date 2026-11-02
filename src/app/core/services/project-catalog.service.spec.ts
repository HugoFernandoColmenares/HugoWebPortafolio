import { PROJECT_CURATION } from '../data/project-curation';
import { PortfolioProject } from '../models/portfolio-project.model';
import { toPublicProject } from './project-catalog.service';

function row(overrides: Partial<PortfolioProject>): PortfolioProject {
  return {
    id: 'x',
    title: 'X',
    description: 'First sentence. Second sentence.',
    imageUrl: 'https://images.unsplash.com/photo-1?w=600',
    technologies: [],
    githubUrl: 'https://github.com/someone',
    liveUrl: null,
    featured: true,
    status: 'completed',
    category: 'other',
    createdAt: '',
    updatedAt: '',
    deletedAt: null,
    ...overrides,
  };
}

describe('toPublicProject', () => {
  it('never uses stock photos as covers for uncurated rows', () => {
    const project = toPublicProject(row({}), 'en');
    expect(project.remoteCover).toBeNull();
    expect(project.summary).toBe('First sentence.');
  });

  it('hides broken or misleading GitHub links through curation', () => {
    const id = 'a1000001-0000-4000-8000-000000000014'; // EchoArts: repo 404
    const project = toPublicProject(row({ id, githubUrl: 'https://github.com/FeithNoir/EchoArtsApp' }), 'es', PROJECT_CURATION[id]);
    expect(project.githubUrl).toBeNull();
    expect(project.description).toContain('Suite en Angular 22');
  });

  it('keeps only a handful of featured projects', () => {
    const featured = Object.values(PROJECT_CURATION).filter(c => c.featured);
    expect(featured.length).toBeGreaterThanOrEqual(3);
    expect(featured.length).toBeLessThanOrEqual(6);
  });

  it('flags the 18+ NEXO blog with a content warning', () => {
    const id = 'a1000001-0000-4000-8000-000000000008';
    const project = toPublicProject(row({ id, liveUrl: 'https://feith-blog.vercel.app/' }), 'en', PROJECT_CURATION[id]);
    expect(project.contentWarning).toBeTrue();
    expect(project.featured).toBeFalse();
  });

  it('shows the Woodheart Café wiki with its live demo and no link to its private repository', () => {
    const id = 'a1000001-0000-4000-8000-000000000027';
    const project = toPublicProject(
      row({ id, liveUrl: null, githubUrl: 'https://github.com/FeithNoir/woodheart-cafe-wiki' }),
      'es',
      PROJECT_CURATION[id],
    );
    expect(project.slug).toBe('woodheart-cafe-wiki');
    expect(project.liveUrl).toBe('https://woodheart-cafe-wiki.vercel.app/');
    expect(project.githubUrl).toBeNull();
    expect(project.cover).toBe('/img/projects/woodheart-wiki');
    expect(project.contentWarning).toBeFalse();
    expect(project.caseStudy?.status.es).toContain('Código privado');
  });

  it('shows VengaJustiLolis Alv Z with its GitHub Pages demo and public repository', () => {
    const id = 'a1000001-0000-4000-8000-000000000028';
    const project = toPublicProject(row({ id }), 'es', PROJECT_CURATION[id]);
    expect(project.slug).toBe('vengajustilolisalvz');
    expect(project.liveUrl).toBe('https://hugofernandocolmenares.github.io/VengaJustiLolisAlvZNg/');
    expect(project.githubUrl).toBe('https://github.com/HugoFernandoColmenares/VengaJustiLolisAlvZNg');
    expect(project.cover).toBe('/img/projects/vengajusti');
    expect(project.summary).toContain('WhatsApp');
  });

  it('shows DevChronicle with its Firebase Hosting demo', () => {
    const id = 'a1000001-0000-4000-8000-000000000018';
    const project = toPublicProject(row({ id }), 'es', PROJECT_CURATION[id]);
    expect(project.liveUrl).toBe('https://devchronicle-hugo.web.app');
    expect(project.caseStudy?.status.es).toContain('Firebase Hosting');
  });

  const added: [string, string, string, string | null, string][] = [
    ['029', 'linkshelf', 'https://github.com/HugoFernandoColmenares/LinkShelf', null, 'enlaces'],
    ['030', 'periodico-ia', 'https://github.com/HugoFernandoColmenares/periodico-ia', null, 'IA'],
    ['031', 'da-metricas', 'https://github.com/FeithNoir/da-metricas', null, 'DeviantArt'],
    ['032', 'liquidharness', 'https://github.com/HugoFernandoColmenares/LiquidHarness', null, 'LFM2.5'],
    ['033', 'duelists-forge', 'https://github.com/FeithNoir/DuelistsForge', 'https://feithnoir.github.io/DuelistsForge/', 'Yu-Gi-Oh!'],
  ];
  for (const [n, slug, githubUrl, liveUrl, keyword] of added) {
    it(`shows ${slug} with its verified links and local cover`, () => {
      const id = `a1000001-0000-4000-8000-000000000${n}`;
      const project = toPublicProject(row({ id }), 'es', PROJECT_CURATION[id]);
      expect(project.slug).toBe(slug);
      expect(project.githubUrl).toBe(githubUrl);
      expect(project.liveUrl).toBe(liveUrl);
      expect(project.cover).toBe(`/img/projects/${slug}`);
      expect(project.summary).toContain(keyword);
    });
  }
});
