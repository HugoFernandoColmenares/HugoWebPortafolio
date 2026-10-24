import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicProject } from '../../../core/models/public-project.model';
import { TranslationService } from '../../../core/services/translation.service';
import { IconComponent } from '../../icons/icon.component';
import { ProjectCoverComponent } from '../project-cover/project-cover.component';

/** Large "case study" card for featured projects. */
@Component({
  selector: 'app-project-case-card',
  standalone: true,
  imports: [RouterLink, ProjectCoverComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="case" [class.case--wide]="wide()">
      <a class="case__media" [routerLink]="['/projects', project().slug]" tabindex="-1" aria-hidden="true">
        <app-project-cover [project]="project()" [priority]="priority()" [sizes]="wide() ? '(max-width: 900px) 100vw, 60vw' : '(max-width: 760px) 100vw, 50vw'" />
      </a>
      <div class="case__body">
        <p class="case__path"><span class="case__index">{{ index() }}</span> projects/{{ project().slug }}</p>
        <h3 class="case__title">
          <a [routerLink]="['/projects', project().slug]">{{ project().title }}</a>
        </h3>
        <p class="case__summary">{{ project().summary }}</p>
        <p class="case__stack">{{ project().technologies.join(' · ') }}</p>
        <div class="case__foot">
          <a class="case__more" [routerLink]="['/projects', project().slug]">
            {{ ts.t().case_read }} <app-icon name="arrow-right" />
            <span class="sr-only">: {{ project().title }}</span>
          </a>
          @if (project().liveUrl && !project().contentWarning) {
            <a class="case__ext" [href]="project().liveUrl" target="_blank" rel="noopener noreferrer">
              {{ ts.t().btn_live }} <app-icon name="external" />
              <span class="sr-only">: {{ project().title }}</span>
            </a>
          }
        </div>
      </div>
    </article>
  `,
  styleUrl: './project-case-card.component.css',
})
export class ProjectCaseCardComponent {
  readonly project = input.required<PublicProject>();
  readonly position = input(0);
  readonly priority = input(false);
  readonly wide = input(false);
  readonly ts = inject(TranslationService);
  readonly index = computed(() => String(this.position() + 1).padStart(2, '0'));
}
