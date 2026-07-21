import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { AuthFacadeService } from '../../core/services/auth-facade.service';

@Component({
  selector: 'app-confirm-register',
  standalone: true,
  imports: [],
  templateUrl: './confirm-register.component.html',
  styleUrl: './confirm-register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmRegisterComponent implements OnInit {
  readonly facade = inject(AuthFacadeService);

  ngOnInit(): void {
    void this.facade.handleEmailConfirmation();
  }
}
