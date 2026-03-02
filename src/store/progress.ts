import type { ReviewRecord } from "../data/types";
import { createRecord } from "../srs/sm2";

const STORAGE_KEY = "kanadojo-progress";
const STREAK_KEY = "kanadojo-streak";

interface ProgressStore {
  records: Record<string, ReviewRecord>;
  streak: { count: number; lastDate: string };
}

function load(): ProgressStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted data, start fresh
  }
  return { records: {}, streak: { count: 0, lastDate: "" } };
}

function save(store: ProgressStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getRecord(char: string): ReviewRecord {
  const store = load();
  return store.records[char] || createRecord(char);
}

export function getAllRecords(): Record<string, ReviewRecord> {
  return load().records;
}

export function saveRecord(record: ReviewRecord): void {
  const store = load();
  store.records[record.char] = record;
  save(store);
}

export function getStreak(): { count: number; lastDate: string } {
  const store = load();
  return store.streak;
}

export function updateStreak(): void {
  const store = load();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (store.streak.lastDate === today) {
    // Already practiced today
    return;
  } else if (store.streak.lastDate === yesterday) {
    store.streak.count += 1;
  } else {
    store.streak.count = 1;
  }
  store.streak.lastDate = today;
  save(store);
}

export function getMasteredCount(): number {
  const records = getAllRecords();
  return Object.values(records).filter(
    (r) => r.repetitions >= 3 && r.easeFactor >= 2.0,
  ).length;
}

export function getDueCount(): number {
  const today = new Date().toISOString().split("T")[0];
  const records = getAllRecords();
  return Object.values(records).filter((r) => r.nextReview <= today).length;
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STREAK_KEY);
}
