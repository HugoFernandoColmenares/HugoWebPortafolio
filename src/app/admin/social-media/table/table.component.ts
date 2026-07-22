import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
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
  PlatformOption,
  SocialMediaLink,
  SocialMediaTableLabels,
  SocialPlatform,
} from '../../../core/models/social-media.model';

@Component({
  selector: 'app-social-media-table',
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
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialMediaTableComponent {
  readonly links = input.required<SocialMediaLink[]>();
  readonly loading = input(false);
  readonly labels = input.required<SocialMediaTableLabels>();
  readonly platformOptions = input<PlatformOption[]>([]);
  readonly canManage = input(true);

  readonly addLink = output<void>();
  readonly viewLink = output<SocialMediaLink>();
  readonly editLink = output<SocialMediaLink>();
  readonly deleteLink = output<SocialMediaLink>();

  readonly searchTerm = signal('');
  readonly selectedPlatforms = signal<SocialPlatform[]>([]);
  readonly rowsPerPage = 10;

  readonly filteredLinks = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const platforms = this.selectedPlatforms();
    let items = this.links();

    if (query) {
      items = items.filter(link => {
        const haystack = [link.name, link.url, this.platformLabel(link.platform)].join(' ').toLowerCase();
        return haystack.includes(query);
      });
    }

    if (platforms.length > 0) {
      items = items.filter(link => platforms.includes(link.platform));
    }

    return items;
  });

  platformLabel(platform: SocialPlatform): string {
    return this.platformOptions().find(option => option.value === platform)?.label ?? platform;
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }
}
