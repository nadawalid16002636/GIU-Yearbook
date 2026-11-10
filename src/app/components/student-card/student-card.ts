/*
FILE: src/app/components/student-card/student-card.ts
WHAT: Receives student data and handles missing portraits.
WHY: Makes the card reusable for every student.
*/

import { Component, computed, input, signal,inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Student } from '../../models/student.model';
import { SavedService } from '../../services/saved.service';

@Component({
  selector: 'app-student-card',
  imports: [RouterLink],
  templateUrl: './student-card.html',
  styleUrl: './student-card.css',
})
export class StudentCard {
  // Receive one student from the parent page.
  readonly student = input.required<Student>();

  private readonly imageFailed = signal(false);
private readonly saved = inject(SavedService);
  // Show a placeholder if the portrait fails to load.
  protected readonly photoSrc = computed(() =>
    this.imageFailed()
      ? 'images/placeholder-portrait.svg'
      : this.student().photo,
  );

  protected onImageError(): void {
    this.imageFailed.set(true);
  }
  protected onToggleSaved(event: Event): void {
  // The whole card is a link. Without these two lines, a click on the
  // heart would ALSO open the student's profile.
  event.preventDefault();
  event.stopPropagation();
  this.saved.toggle(this.student().id);
  }
}
