// Прогресс пользователя: последний результат теста + даты завершённых сессий.
// Из дат считаем серию («X дней подряд») и отметки текущей недели.

import { storageGet, storageSet } from "./storage";
import type { MobilityResult } from "../data/mobility";

const KEY = "progress";

export type Progress = {
  mobilityScore?: number;
  mobilityResults?: MobilityResult[];
  mobilityDate?: string;
  /** Даты (ЛОКАЛЬНЫЕ, YYYY-MM-DD) дней с завершённой сессией. */
  completedDates: string[];
};

const EMPTY: Progress = { completedDates: [] };

/** Локальная дата в формате YYYY-MM-DD (не UTC — чтобы не «уезжала» на границе суток). */
function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return isoDate(new Date());
}

export async function loadProgress(): Promise<Progress> {
  const raw = await storageGet(KEY);
  if (!raw) return { ...EMPTY };
  try {
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { ...EMPTY, ...parsed, completedDates: parsed.completedDates ?? [] };
  } catch {
    return { ...EMPTY };
  }
}

export async function saveProgress(p: Progress): Promise<void> {
  await storageSet(KEY, JSON.stringify(p));
}

/** Добавить сегодняшний день в завершённые (без дублей, храним последние 60). */
export function withCompletion(p: Progress, date: string): Progress {
  if (p.completedDates.includes(date)) return p;
  return { ...p, completedDates: [...p.completedDates, date].slice(-60) };
}

/** Серия: сколько дней подряд (заканчивая сегодня или вчера). */
export function currentStreak(dates: string[]): number {
  const set = new Set(dates);
  const cursor = new Date();
  if (!set.has(isoDate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(isoDate(cursor))) return 0;
  }
  let streak = 0;
  while (set.has(isoDate(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Отметки текущей недели (Пн→Вс): выполнен ли день. */
export function weekStatus(dates: string[]): { label: string; done: boolean }[] {
  const set = new Set(dates);
  const labels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7; // 0 = понедельник
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);
  return labels.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { label, done: set.has(isoDate(d)) };
  });
}

/** «5 дней подряд» — правильное склонение. */
export function pluralDays(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} день`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${n} дня`;
  return `${n} дней`;
}
