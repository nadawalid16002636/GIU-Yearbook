import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StudentCard } from './student-card';

describe('StudentCard', () => {
  it('renders a student and links to their story', async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCard],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(StudentCard);
    fixture.componentRef.setInput('student', {
      id: 1, name: 'Maya Hassan', faculty: 'Engineering', classYear: 2028,
      quote: 'Build things that make a difference.', photo: 'maya.jpg', featured: true,
    });
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h3')?.textContent).toContain('Maya Hassan');
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/students/1');
  });
});
