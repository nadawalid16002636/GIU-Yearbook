
import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { map } from 'rxjs';

import { Student } from '../../models/student.model';
import { AuthService } from '../../services/auth.service';
import { StudentService } from '../../services/student.service';
import { StoryDraftService } from '../../services/story-draft.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage implements OnInit {

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly students = inject(StudentService);
  private readonly drafts = inject(StoryDraftService);

  // Reactive form
  protected readonly form = this.fb.group({
    quote: ['', [
      Validators.required,
      Validators.maxLength(160)
    ]],
    story: ['', [
      Validators.maxLength(1000)
    ]],
    moment: ['', [
      Validators.maxLength(200)
    ]],
    next: ['', [
      Validators.maxLength(120)
    ]],
    consent: [false]
  });

  // Converts form changes into a signal
  protected readonly values = toSignal(
    this.form.valueChanges.pipe(
      map(() => this.form.getRawValue())
    ),
    {
      initialValue: this.form.getRawValue()
    }
  );

  // Student information
  protected readonly student = signal<Student | null>(null);
  protected readonly user = this.auth.currentUser;

  // Draft status
  protected readonly changed = signal(false);
  protected readonly savedAt = signal<string | null>(null);
  protected readonly storageError = signal(false);

  // Character counter
  protected readonly quoteLength = computed(
    () => this.values().quote.length
  );

  constructor() {
    this.form.valueChanges.subscribe(() => {
      this.changed.set(true);
    });
  }

  ngOnInit(): void {
    const studentId = this.auth.currentUser()?.studentId;

    if (studentId == null) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.students.getStudents().subscribe((list) => {

      const student =
        list.find((s) => s.id === studentId) ?? null;

      this.student.set(student);

      if (!student) {
        return;
      }

      // Restore saved draft if one exists
      const draft = this.drafts.load(student.id);

      if (draft) {
        this.form.patchValue(draft.values);
        this.savedAt.set(draft.savedAt);
      } else {
        // Default quote from student directory
        this.form.patchValue({
          quote: student.quote
        });
      }

      // Restoring data should not count as editing
      this.changed.set(false);
    });
  }

  protected saveDraft(): void {
    const student = this.student();

    if (!student) {
      return;
    }

    const time = this.drafts.save(
      student.id,
      this.form.getRawValue()
    );

    this.storageError.set(time === null);

    if (time) {
      this.savedAt.set(time);
      this.changed.set(false);
    }
  }

  protected signOut(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.router.navigateByUrl('/login');
      }
    });
  }
}
