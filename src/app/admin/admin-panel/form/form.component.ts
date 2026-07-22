import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Select } from 'primeng/select';
import {
  AdminPanelViewMode,
  AdminUserFormLabels,
  AdminUserInput,
  AdminUserUpdateInput,
  RoleOption,
} from '../../../core/models/admin-user.model';
import { UserProfile } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputText, Password, Select, Button],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent {
  readonly mode = input.required<Exclude<AdminPanelViewMode, 'list'>>();
  readonly user = input<UserProfile | null>(null);
  readonly loading = input(false);
  readonly labels = input.required<AdminUserFormLabels>();
  readonly roleOptions = input<RoleOption[]>([]);

  readonly saveUser = output<AdminUserInput | AdminUserUpdateInput>();
  readonly cancelForm = output<void>();

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    roleId: ['', [Validators.required]],
  });

  readonly heading = computed(() => {
    const labels = this.labels();
    switch (this.mode()) {
      case 'edit':
        return labels.editTitle;
      case 'view':
        return labels.viewTitle;
      default:
        return labels.createTitle;
    }
  });

  readonly isCreateMode = computed(() => this.mode() === 'create');

  constructor() {
    effect(() => {
      const user = this.user();
      const mode = this.mode();
      const isReadOnly = mode === 'view';
      const isCreate = mode === 'create';

      if (user) {
        this.form.reset({
          fullName: user.fullName,
          email: user.email,
          password: '',
          roleId: user.roleId,
        });
      } else {
        this.form.reset({
          fullName: '',
          email: '',
          password: '',
          roleId: this.roleOptions()[0]?.value ?? '',
        });
      }

      const passwordControl = this.form.controls.password;
      if (isCreate) {
        passwordControl.setValidators([Validators.required, Validators.minLength(6)]);
      } else {
        passwordControl.clearValidators();
      }
      passwordControl.updateValueAndValidity({ emitEvent: false });

      if (isReadOnly) {
        this.form.disable({ emitEvent: false });
        return;
      }

      this.form.enable({ emitEvent: false });
      if (!isCreate) {
        this.form.controls.password.disable({ emitEvent: false });
      }
    });
  }

  onSubmit(): void {
    if (this.mode() === 'view') {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    if (this.mode() === 'create') {
      this.saveUser.emit({
        fullName: raw.fullName,
        email: raw.email,
        password: raw.password,
        roleId: raw.roleId,
      });
      return;
    }

    this.saveUser.emit({
      fullName: raw.fullName,
      email: raw.email,
      roleId: raw.roleId,
    });
  }
}
