import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import {
  AdminUserTableLabels,
  RoleOption,
} from '../../../core/models/admin-user.model';
import { RoleName } from '../../../core/models/role.model';
import { UserProfile } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    Button,
    Tag,
    Tooltip,
    InputText,
    IconField,
    InputIcon,
    MultiSelect,
    DatePipe,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTableComponent {
  readonly users = input.required<UserProfile[]>();
  readonly loading = input(false);
  readonly labels = input.required<AdminUserTableLabels>();
  readonly roleOptions = input<RoleOption[]>([]);
  readonly canManage = input(true);

  readonly addUser = output<void>();
  readonly viewUser = output<UserProfile>();
  readonly editUser = output<UserProfile>();
  readonly deleteUser = output<UserProfile>();

  readonly searchTerm = signal('');
  readonly selectedRoles = signal<RoleName[]>([]);
  readonly rowsPerPage = 10;

  readonly filteredUsers = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const roles = this.selectedRoles();
    let items = this.users();

    if (query) {
      items = items.filter(user => {
        const haystack = [
          user.fullName,
          user.email,
          user.role?.name ?? '',
          this.roleLabel(user.role?.name),
        ]
          .join(' ')
          .toLowerCase();

        return haystack.includes(query);
      });
    }

    if (roles.length > 0) {
      items = items.filter(user => user.role?.name && roles.includes(user.role.name));
    }

    return items;
  });

  roleLabel(roleName?: RoleName): string {
    if (!roleName) {
      return '—';
    }

    return this.roleOptions().find(option => option.name === roleName)?.label ?? roleName;
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }
}
