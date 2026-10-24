import { ChangeDetectionStrategy, Component, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { TranslationService } from '../../core/services/translation.service';
import { LanguageToggleComponent } from '../components/language-toggle/language-toggle.component';
import { IconComponent } from '../icons/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LanguageToggleComponent, IconComponent],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly menuOpen = input(false);
  readonly toggleMenu = output<void>();

  readonly ts = inject(TranslationService);
  readonly themeService = inject(ThemeService);

  private readonly menuButton = viewChild<ElementRef<HTMLButtonElement>>('menuButton');

  focusMenuButton(): void {
    this.menuButton()?.nativeElement.focus();
  }
}
