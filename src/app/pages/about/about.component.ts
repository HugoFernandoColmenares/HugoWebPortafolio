import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { AppConfigService } from '../../core/services/app-config.service';
import { TechBadgeComponent } from '../../shared/components/tech-badge/tech-badge.component';
import { Skill } from '../../core/models/skill.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ReactiveFormsModule, TechBadgeComponent],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './about.component.css'
})
export class AboutComponent {
  readonly ts = inject(TranslationService);
  readonly config = inject(AppConfigService);
  private fb = inject(FormBuilder);

  readonly skills: Skill[] = [
    { name: 'Angular', level: 90, category: 'frontend' },
    { name: 'TypeScript', level: 88, category: 'frontend' },
    { name: 'HTML', level: 92, category: 'frontend' },
    { name: 'CSS', level: 85, category: 'frontend' },
    { name: '.NET Core', level: 85, category: 'backend' },
    { name: 'C#', level: 83, category: 'backend' },
    { name: 'Entity Framework', level: 78, category: 'backend' },
    { name: 'Node.js', level: 65, category: 'backend' },
    { name: 'SQL Server', level: 80, category: 'database' },
    { name: 'PostgreSQL', level: 70, category: 'database' },
    { name: 'Docker', level: 60, category: 'devops' },
    { name: 'Git', level: 88, category: 'devops' },
    { name: 'Azure', level: 55, category: 'devops' },
  ];

  readonly techNames = this.skills.map(s => s.name);

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  submitted = false;
  sending = false;

  get f() { return this.contactForm.controls; }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.sending = true;
    // Simulate sending
    setTimeout(() => {
      this.sending = false;
      this.submitted = true;
      this.contactForm.reset();
    }, 1200);
  }
}
