import { ChangeDetectionStrategy, Component, DOCUMENT, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, skip } from 'rxjs';
import { TranslationService } from '../../core/services/translation.service';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  readonly ts = inject(TranslationService);
  readonly menuOpen = signal(false);

  private readonly document = inject(DOCUMENT);
  private readonly header = viewChild.required<HeaderComponent>('header');

  constructor() {
    // After in-app navigation, move focus to <main> so keyboard and screen
    // reader users start at the new page (not on the first load).
    inject(Router)
      .events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        skip(1),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.document.getElementById('main-content')?.focus({ preventScroll: true });
      });
  }

  setMenu(open: boolean): void {
    if (open === this.menuOpen()) {
      return;
    }
    this.menuOpen.set(open);
    this.document.body.classList.toggle('is-locked', open);
    if (!open) {
      queueMicrotask(() => this.header().focusMenuButton());
    }
  }

  skipToContent(): void {
    const main = this.document.getElementById('main-content');
    main?.focus();
    main?.scrollIntoView({ block: 'start' });
  }
}
