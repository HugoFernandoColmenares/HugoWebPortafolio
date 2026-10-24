import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslationService } from '../core/services/translation.service';
import { AuthFacadeService } from '../core/services/auth-facade.service';
import { loadStylesheet } from '../core/utils/load-stylesheet';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  providers: [AuthFacadeService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  // PrimeIcons are only used in the admin/auth area.
  private readonly icons = loadStylesheet('primeicons');

  readonly ts = inject(TranslationService);
}
