"use client";

import { useState } from "react";
import {
  mobilityTests,
  ratingOptions,
  ratingScore,
  zoneTitle,
  type MobilityResult,
  type TestRating,
} from "../data/mobility";
import { hapticImpact } from "../lib/haptics";
import { WorkoutArt } from "./WorkoutArt";

type Props = {
  onBack: () => void;
  onComplete: (results: MobilityResult[]) => void;
};

export function MobilityTestScreen({ onBack, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<MobilityResult[]>([]);

  const total = mobilityTests.length;
  const test = mobilityTests[step];

  function answer(rating: TestRating) {
    hapticImpact("light");
    const next = [...results, { zone: test.zone, score: ratingScore[rating] }];
    if (step + 1 >= total) {
      onComplete(next);
    } else {
      setResults(next);
      setStep(step + 1);
    }
  }

  return (
    <main className="flex flex-1 flex-col px-5 pb-10 pt-8">
      <button
        onClick={onBack}
        className="mb-4 -ml-1 flex w-fit items-center gap-1 text-sm text-muted transition active:opacity-60"
      >
        ‹ Выйти
      </button>

      {/* Прогресс по зонам. */}
      <div className="flex gap-1.5">
        {mobilityTests.map((t, i) => (
          <span
            key={t.zone}
            className={`h-1.5 flex-1 rounded-full ${
              i <= step ? "bg-accent" : "bg-surface-2"
            }`}
          />
        ))}
      </div>

      <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-muted">
        Зона {step + 1} из {total} · {zoneTitle(test.zone)}
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight">
        {test.title}
      </h1>

      {/* Место под видео-демо теста (заглушка). */}
      <div className="mt-5 aspect-video w-full overflow-hidden rounded-2xl border border-surface-border elevate">
        <WorkoutArt id={`test-${test.zone}`} className="h-full w-full" />
      </div>
      <p className="mt-4 text-sm text-muted">{test.instruction}</p>

      {/* Само-оценка. */}
      <div className="mt-auto flex flex-col gap-3 pt-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          Как ощущается?
        </p>
        {ratingOptions.map((o) => (
          <button
            key={o.id}
            onClick={() => answer(o.id)}
            className="elevate w-full rounded-2xl border border-surface-border bg-surface px-5 py-4 text-left text-[15px] font-bold transition active:scale-[0.98]"
          >
            {o.label}
          </button>
        ))}
      </div>
    </main>
  );
}
