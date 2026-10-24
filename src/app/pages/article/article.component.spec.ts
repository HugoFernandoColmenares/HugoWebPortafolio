import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PortfolioProject } from '../../core/models/portfolio-project.model';
import { PortfolioProjectService } from '../../core/services/portfolio-project.service';
import { ArticleComponent } from './article.component';

function project(id: string, title: string): PortfolioProject {
  return {
    id,
    title,
    description: `${title} description`,
    imageUrl: '',
    technologies: ['Angular'],
    githubUrl: null,
    liveUrl: null,
    featured: false,
    status: 'completed',
    category: 'web-frontend',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    deletedAt: null,
  };
}

describe('ArticleComponent', () => {
  it('reloads the project when the :id route param changes on a reused component', async () => {
    const params = new BehaviorSubject<ParamMap>(convertToParamMap({ id: 'a' }));
    const data: Record<string, PortfolioProject> = {
      a: project('a', 'Project A'),
      b: project('b', 'Project B'),
    };

    await TestBed.configureTestingModule({
      imports: [ArticleComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: params.asObservable() } },
        { provide: PortfolioProjectService, useValue: { getById: async (id: string) => data[id] ?? null, getAll: async () => Object.values(data) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ArticleComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.project()?.title).toBe('Project A');

    params.next(convertToParamMap({ id: 'b' }));
    await fixture.whenStable();
    expect(fixture.componentInstance.project()?.title).toBe('Project B');

    params.next(convertToParamMap({ id: 'missing' }));
    await fixture.whenStable();
    expect(fixture.componentInstance.project()).toBeNull();
    expect(fixture.componentInstance.loadError()).toBeTrue();
  });
});
