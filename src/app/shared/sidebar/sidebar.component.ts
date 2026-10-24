import { A11yModule } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SITE } from '../../core/config/site';
import { TranslationService } from '../../core/services/translation.service';
import { IconComponent } from '../icons/icon.component';

/** Mobile navigation drawer: modal dialog with focus trap, Esc to close. */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, A11yModule, IconComponent],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './sidebar.component.css',
  host: { '(document:keydown.escape)': 'onEscape()' },
})
export class SidebarComponent {
  readonly isOpen = input(false);
  readonly dismiss = output<void>();

  readonly ts = inject(TranslationService);
  readonly site = SITE;

  onEscape(): void {
    if (this.isOpen()) {
      this.dismiss.emit();
    }
  }
}
