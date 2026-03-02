import type { Quality, ReviewRecord } from "../data/types";

function addDays(date: Date, days: number): string {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split("T")[0];
}

export function createRecord(char: string): ReviewRecord {
  return {
    char,
    easeFactor: 2.5,
    interval: 0,
    nextReview: new Date().toISOString().split("T")[0],
    repetitions: 0,
    lastQuality: 0,
  };
}

export function review(record: ReviewRecord, quality: Quality): ReviewRecord {
  if (quality === 0) {
    // Wrong: reset to beginning
    return {
      ...record,
      interval: 1,
      repetitions: 0,
      lastQuality: quality,
      nextReview: addDays(new Date(), 1),
    };
  }

  const easeAdjust = quality === 2 ? 0.1 : -0.15;
  const newEase = Math.max(1.3, record.easeFactor + easeAdjust);

  let newInterval: number;
  if (record.repetitions === 0) {
    newInterval = 1;
  } else if (record.repetitions === 1) {
    newInterval = 3;
  } else {
    newInterval = Math.round(record.interval * newEase);
  }

  return {
    ...record,
    easeFactor: newEase,
    interval: newInterval,
    repetitions: record.repetitions + 1,
    lastQuality: quality,
    nextReview: addDays(new Date(), newInterval),
  };
}

export function isDue(record: ReviewRecord): boolean {
  const today = new Date().toISOString().split("T")[0];
  return record.nextReview <= today;
}

export function isMastered(record: ReviewRecord): boolean {
  return record.repetitions >= 3 && record.easeFactor >= 2.0;
}
