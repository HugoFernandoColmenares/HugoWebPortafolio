import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/config/site';
import { ProjectCatalogService } from '../../core/services/project-catalog.service';
import { TranslationService } from '../../core/services/translation.service';
import { ProjectCaseCardComponent } from '../../shared/components/project-case-card/project-case-card.component';
import { IconComponent } from '../../shared/icons/icon.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, ProjectCaseCardComponent, IconComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  readonly ts = inject(TranslationService);
  readonly catalog = inject(ProjectCatalogService);
  readonly site = SITE;

  ngOnInit(): void {
    void this.catalog.load();
  }
}
