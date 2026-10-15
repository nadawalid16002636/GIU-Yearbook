/*
FILE: src/app/components/student-card/student-card.ts
WHAT: Receives student data and handles missing portraits.
WHY: Makes the card reusable for every student.
*/

import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Student } from '../../models/student.model';

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

  // Show a placeholder if the portrait fails to load.
  protected readonly photoSrc = computed(() =>
    this.imageFailed()
      ? 'images/placeholder-portrait.svg'
      : this.student().photo,
  );

  protected onImageError(): void {
    this.imageFailed.set(true);
  }
}