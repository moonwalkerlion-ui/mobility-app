"use client";

import { useEffect, useRef, useState } from "react";
import { ProgressRing } from "./ProgressRing";
import { hapticImpact, hapticNotify, hapticSelection } from "../lib/haptics";

/** Универсальный элемент плеера: подходит и упражнению программы, и дрилу. */
export type PlayerItem = {
  id: string;
  title: string;
  duration: number;
  description: string;
};

/** Секунды → «M:SS». */
function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Props = {
  /** Заголовок сессии (название программы или «Присед · Разминка»). */
  title: string;
  items: PlayerItem[];
  index: number;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
};

export function ExerciseScreen({
  title,
  items,
  index,
  onBack,
  onPrev,
  onNext,
  onFinish,
}: Props) {
  const item = items[index];
  const isFirst = index === 0;
  const isLast = index === items.length - 1;

  const [secondsLeft, setSecondsLeft] = useState(item.duration);
  const [running, setRunning] = useState(true);
  const doneNotified = useRef(false);

  // При переходе к другому элементу — сброс таймера и запуск заново.
  useEffect(() => {
    setSecondsLeft(item.duration);
    setRunning(true);
    doneNotified.current = false;
  }, [item.id, item.duration]);

  // Тик раз в секунду, пока идёт отсчёт.
  useEffect(() => {
    if (!running || secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [running, secondsLeft]);

  const done = secondsLeft <= 0;

  // Одноразовый вибро-отклик в момент завершения удержания.
  useEffect(() => {
    if (done && !doneNotified.current) {
      doneNotified.current = true;
      hapticNotify("success");
    }
  }, [done]);

  const progress = 1 - secondsLeft / item.duration;

  return (
    <main className="flex flex-1 flex-col px-5 pb-8 pt-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="-ml-1 flex items-center gap-1 text-sm text-muted transition active:opacity-60"
        >
          ‹ Назад
        </button>
        <span className="truncate text-sm font-medium text-muted">{title}</span>
        <span className="shrink-0 font-mono text-sm text-muted">
          {String(index + 1).padStart(2, "0")} / {items.length}
        </span>
      </div>

      {/* Кольцо-таймер — центр экрана. Позже в него же ляжет видео. */}
      <div className="flex flex-col items-center">
        <ProgressRing progress={progress}>
          <span className="font-display text-6xl font-extrabold tabular-nums">
            {fmt(secondsLeft)}
          </span>
          <span className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
            {done ? "готово" : running ? "удержание" : "пауза"}
          </span>
        </ProgressRing>
      </div>

      <h1 className="mt-8 text-center font-display text-2xl font-extrabold">
        {item.title}
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-center text-sm text-muted">
        {item.description}
      </p>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        {!done ? (
          <button
            onClick={() => {
              hapticSelection();
              setRunning((r) => !r);
            }}
            className="elevate w-full rounded-2xl bg-accent py-4 text-base font-bold text-accent-ink transition active:scale-[0.98]"
          >
            {running ? "Пауза" : "Продолжить"}
          </button>
        ) : (
          <button
            onClick={() => {
              hapticImpact("medium");
              isLast ? onFinish() : onNext();
            }}
            className="elevate w-full rounded-2xl bg-accent py-4 text-base font-bold text-accent-ink transition active:scale-[0.98]"
          >
            {isLast ? "Завершить 🎉" : "Дальше ›"}
          </button>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => {
              hapticImpact("light");
              onPrev();
            }}
            disabled={isFirst}
            className="flex-1 rounded-2xl border border-surface-border py-3 text-sm font-medium transition active:scale-[0.98] disabled:opacity-40"
          >
            ‹ Предыдущее
          </button>
          <button
            onClick={() => {
              hapticImpact("light");
              isLast ? onFinish() : onNext();
            }}
            className="flex-1 rounded-2xl border border-surface-border py-3 text-sm font-medium transition active:scale-[0.98]"
          >
            {isLast ? "Завершить" : "Пропустить ›"}
          </button>
        </div>
      </div>
    </main>
  );
}
