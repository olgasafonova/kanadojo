import { review, createRecord } from "../../srs/sm2";
import { getRecord, saveRecord, updateStreak } from "../../store/progress";
import { playCorrectChime } from "../../utils/chime";
import { acceptedAnswers, canonicalAnswer, type QuizItem } from "./queue";
import type { Quality } from "../../data/types";

export interface GradedAnswer {
  correct: boolean;
  answer: string;
  typed: string;
}

/** Compare the typed input against the item's accepted answers. */
export function gradeAnswer(item: QuizItem, input: string): GradedAnswer {
  const typed = input.trim().toLowerCase();
  return {
    correct: acceptedAnswers(item).includes(typed),
    answer: canonicalAnswer(item),
    typed,
  };
}

/** Persist the SRS review, update the streak, and chime on success. */
export function persistAnswer(char: string, correct: boolean): void {
  const quality: Quality = correct ? 2 : 0;
  const record = getRecord(char) || createRecord(char);
  saveRecord(review(record, quality));
  updateStreak();
  if (correct) playCorrectChime();
}

/** Screen-reader announcement for a graded answer. */
export function announcementFor(char: string, graded: GradedAnswer): string {
  return graded.correct
    ? `Correct! ${char} is ${graded.answer}`
    : `Incorrect. ${char} is ${graded.answer}, you typed ${graded.typed}`;
}

/** How long the feedback stays on screen before auto-advancing. */
export function feedbackDelayMs(correct: boolean): number {
  return correct ? 1500 : 3000;
}
