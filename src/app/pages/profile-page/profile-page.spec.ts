import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ProfilePage } from './profile-page';
import { AuthService } from '../../services/auth.service';
import { StudentService } from '../../services/student.service';

describe('ProfilePage', () => {
  beforeEach(async () => {
    localStorage.removeItem('giu:story-draft:1');
    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: {
          currentUser: signal({ id: 1, studentId: 1, name: 'Maya Hassan', email: 'mock.user@student.giu-uni.de' }),
        } },
        { provide: StudentService, useValue: { getStudents: () => of([{
          id: 1, name: 'Maya Hassan', faculty: 'Engineering', classYear: 2028,
          quote: 'Original quote', photo: 'maya.jpg', featured: true,
        }]) } },
      ],
    }).compileComponents();
  });

  afterEach(() => localStorage.removeItem('giu:story-draft:1'));

  it('saves edited fields and restores them when the profile reopens', async () => {
    const fixture = TestBed.createComponent(ProfilePage);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const quote = element.querySelector<HTMLInputElement>('#quote')!;
    quote.value = 'A saved memory';
    quote.dispatchEvent(new Event('input'));
    const story = element.querySelector<HTMLTextAreaElement>('#story')!;
    story.value = 'My university story';
    story.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(element.querySelector('.mini__quote')?.textContent).toContain('A saved memory');
    const saveButton = Array.from(element.querySelectorAll('button')).find(button => button.textContent?.includes('Save draft'))!;
    saveButton.click();
    await fixture.whenStable();
    const stored = JSON.parse(localStorage.getItem('giu:story-draft:1')!);
    expect(stored.values.quote).toBe('A saved memory');
    expect(stored.values.story).toBe('My university story');
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Draft saved at');
    fixture.destroy();

    const reopened = TestBed.createComponent(ProfilePage);
    await reopened.whenStable();
    const restored = reopened.nativeElement as HTMLElement;
    expect(restored.querySelector<HTMLInputElement>('#quote')?.value).toBe('A saved memory');
    expect(restored.querySelector<HTMLTextAreaElement>('#story')?.value).toBe('My university story');
    expect(restored.querySelector('[role="status"]')?.textContent).toContain('Draft saved at');
  });
});
