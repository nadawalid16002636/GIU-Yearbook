
import { Injectable } from '@angular/core';

import {
  StoredStoryDraft,
  StoryDraft
} from '../models/story-draft.model';

@Injectable({
  providedIn: 'root'
})
export class StoryDraftService {

  private key(studentId: number): string {
    return `giu:story-draft:${studentId}`;
  }

  load(studentId: number): StoredStoryDraft | null {
    try {
      const text = localStorage.getItem(this.key(studentId));

      return text
        ? (JSON.parse(text) as StoredStoryDraft)
        : null;

    } catch {
      return null;
    }
  }

  save(
    studentId: number,
    values: StoryDraft
  ): string | null {

    const stored: StoredStoryDraft = {
      savedAt: new Date().toISOString(),
      values
    };

    try {
      localStorage.setItem(
        this.key(studentId),
        JSON.stringify(stored)
      );

      return stored.savedAt;

    } catch {
      return null;
    }
  }

  clear(studentId: number): void {
    localStorage.removeItem(this.key(studentId));
  }
}
