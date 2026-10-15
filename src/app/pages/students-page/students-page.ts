/* =====================================================================
   FILE: pages/students-page/students-page.ts
   WHAT: The landing page: title, filters and the grid of student cards.
   WHY: Loads students and lets visitors search, filter and sort them.
   FIGMA: Frame "Class of 2028 · Student directory".
   ===================================================================== */
import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { StudentCard } from '../../components/student-card/student-card';

// Only these two sorting options are allowed.
type SortMode = 'featured' | 'name';

@Component({
  selector: 'app-student-page',
  // Allow this page to use the student card component.
  imports: [StudentCard],
  templateUrl: './students-page.html',
  styleUrl: './students-page.css',
})
export class StudentsPage implements OnInit {
  // The service handles where the student data comes from.
  private readonly studentService = inject(StudentService);

  protected readonly students = signal<Student[]>([]);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly searchText = signal('');
  protected readonly selectedFaculty = signal('all');
  protected readonly sortBy = signal<SortMode>('featured');

  // Build the faculty dropdown from the loaded students.
  protected readonly faculties = computed(() =>
    [...new Set(this.students().map((s) => s.faculty))].sort(),
  );

  // Recalculate the displayed students when filters or sorting change.
  protected readonly visibleStudents = computed(() => {
    const text = this.searchText().trim().toLowerCase();
    const faculty = this.selectedFaculty();

    const filtered = this.students().filter(
      (s) =>
        s.name.toLowerCase().includes(text) &&
        (faculty === 'all' || s.faculty === faculty),
    );

    // Sorting this new filtered array preserves the original list.
    return this.sortBy() === 'name'
      ? filtered.sort((a, b) => a.name.localeCompare(b.name))
      : filtered.sort(
          (a, b) => Number(b.featured) - Number(a.featured) || a.id - b.id,
        );
  });

  protected readonly totalLabel = computed(() =>
    String(this.students().length).padStart(2, '0'),
  );

  // Load the students when the page is created.
  ngOnInit(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'We could not load the students. Please try again.',
        );
        this.loading.set(false);
      },
    });
  }

  // Update the signals when visitors use the controls.
  protected onSearch(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value);
  }

  protected onFacultyChange(event: Event): void {
    this.selectedFaculty.set((event.target as HTMLSelectElement).value);
  }

  protected onSortChange(event: Event): void {
    this.sortBy.set((event.target as HTMLSelectElement).value as SortMode);
  }

  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}