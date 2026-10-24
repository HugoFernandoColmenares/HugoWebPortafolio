import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PortfolioProject } from '../../core/models/portfolio-project.model';
import { PortfolioProjectService } from '../../core/services/portfolio-project.service';
import { ArticleComponent } from './article.component';

function row(id: string, title: string): PortfolioProject {
  return {
    id,
    title,
    description: `${title} description.`,
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
  // Regression for the audit bug: the component is reused when only :id
  // changes, so it must follow paramMap instead of reading the snapshot once.
  it('shows the project for the current :id when the param changes on a reused component', async () => {
    const params = new BehaviorSubject<ParamMap>(convertToParamMap({ id: 'a' }));
    const rows = [row('a', 'Project A'), row('b', 'Project B')];

    await TestBed.configureTestingModule({
      imports: [ArticleComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: params.asObservable() } },
        { provide: PortfolioProjectService, useValue: { getAll: async () => rows } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ArticleComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.project()?.title).toBe('Project A');
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Project A');

    params.next(convertToParamMap({ id: 'b' }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.project()?.title).toBe('Project B');
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Project B');

    params.next(convertToParamMap({ id: 'missing' }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.project()).toBeNull();
    expect(fixture.componentInstance.loadError()).toBeTrue();
  });

  it('resolves curated slugs to the canonical row id', async () => {
    const params = new BehaviorSubject<ParamMap>(convertToParamMap({ id: 'strikesoft-hub' }));
    const rows = [row('a1000001-0000-4000-8000-000000000007', 'StrikeSoft Hub')];

    await TestBed.configureTestingModule({
      imports: [ArticleComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: params.asObservable() } },
        { provide: PortfolioProjectService, useValue: { getAll: async () => rows } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ArticleComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.project()?.id).toBe('a1000001-0000-4000-8000-000000000007');
  });
});
