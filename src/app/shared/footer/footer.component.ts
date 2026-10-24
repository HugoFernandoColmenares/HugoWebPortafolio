import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/config/site';
import { TranslationService } from '../../core/services/translation.service';
import { IconComponent } from '../icons/icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  readonly ts = inject(TranslationService);
  readonly site = SITE;
  readonly copy = computed(() => this.ts.format('footer_copy', { year: new Date().getFullYear() }));
}
