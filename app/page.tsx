"use client";

import { useEffect, useState, type ReactNode } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { getWorkout } from "./data/workouts";
import {
  buildWarmup,
  buildCooldown,
  buildZoneWarmup,
  getMovement,
  getMuscleGroup,
  overallScore,
  zoneTitle,
  type MovementId,
  type MuscleGroupId,
  type MobilityResult,
  type ZoneId,
} from "./data/mobility";
import { HomeScreen } from "./components/HomeScreen";
import { WorkoutScreen } from "./components/WorkoutScreen";
import { ExerciseScreen, type PlayerItem } from "./components/ExerciseScreen";
import { PrepScreen } from "./components/PrepScreen";
import { MobilityTestScreen } from "./components/MobilityTestScreen";
import { MobilityScoreScreen } from "./components/MobilityScoreScreen";
import { initTelegram, setBackButton } from "./lib/telegram";
import {
  loadProgress,
  saveProgress,
  withCompletion,
  currentStreak,
  weekStatus,
  todayISO,
  type Progress,
} from "./lib/progress";

type TgUser = {
  first_name?: string;
  last_name?: string;
  username?: string;
};

function buildName(user: TgUser): string {
  const full = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return full || user.username || "друг";
}

// Какой экран сейчас показан. Навигация целиком на клиенте — подходит для
// статического экспорта и Telegram Mini App (приложение остаётся одной страницей).
// Источники элементов плеера: программа (workout), разминка (warmup, по движению),
// заминка (cooldown, по рабочей мышце).
type Screen =
  | { name: "home" }
  | { name: "workout"; workoutId: string }
  | { name: "prep" }
  | { name: "mtest" }
  | { name: "mscore"; results: MobilityResult[] }
  | { name: "exercise"; source: "workout"; workoutId: string; index: number }
  | { name: "exercise"; source: "warmup"; movementId: MovementId; index: number }
  | {
      name: "exercise";
      source: "cooldown";
      muscleId: MuscleGroupId;
      index: number;
    }
  | { name: "exercise"; source: "zone"; zoneId: ZoneId; index: number };

/** Ключ для анимации перехода: при смене экрана блок перерисовывается заново. */
function screenKey(s: Screen): string {
  if (s.name === "exercise" && s.source === "workout")
    return `ex-w-${s.workoutId}-${s.index}`;
  if (s.name === "exercise" && s.source === "warmup")
    return `ex-wu-${s.movementId}-${s.index}`;
  if (s.name === "exercise" && s.source === "cooldown")
    return `ex-cd-${s.muscleId}-${s.index}`;
  if (s.name === "exercise" && s.source === "zone")
    return `ex-z-${s.zoneId}-${s.index}`;
  if (s.name === "workout") return `workout-${s.workoutId}`;
  if (s.name === "prep") return "prep";
  if (s.name === "mtest") return "mtest";
  if (s.name === "mscore") return "mscore";
  return "home";
}

/** Куда ведёт кнопка «Назад» с текущего экрана (на уровень выше). */
function backTarget(s: Screen): Screen {
  if (s.name === "exercise" && s.source === "workout")
    return { name: "workout", workoutId: s.workoutId };
  if (s.name === "exercise" && s.source === "zone") return { name: "home" };
  if (s.name === "exercise") return { name: "prep" }; // разминка/заминка
  return { name: "home" };
}

/** Самая слабая зона из результатов теста (для рекомендации). */
function weakestZone(results?: MobilityResult[]): ZoneId | undefined {
  if (!results || results.length === 0) return undefined;
  return results.reduce((min, r) => (r.score < min.score ? r : min), results[0])
    .zone;
}

export default function Home() {
  const [name, setName] = useState("друг");
  const [screen, setScreen] = useState<Screen>({ name: "home" });
  const [progress, setProgress] = useState<Progress>({ completedDates: [] });

  // Имя пользователя из Telegram. Вне Telegram остаётся «друг».
  useEffect(() => {
    try {
      const lp = retrieveLaunchParams();
      const user = lp.tgWebAppData?.user as TgUser | undefined;
      if (user) setName(buildName(user));
    } catch {
      // Открыто в обычном браузере — оставляем значение по умолчанию.
    }
  }, []);

  // Инициализация Telegram SDK (вибро/разворот/кнопка «Назад») — один раз.
  useEffect(() => {
    initTelegram();
  }, []);

  // Нативная кнопка «Назад»: прячем на главной, иначе — ведём на уровень выше.
  useEffect(() => {
    setBackButton(screen.name !== "home", () => setScreen(backTarget(screen)));
  }, [screen]);

  // Загружаем сохранённый прогресс при старте.
  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  /** Отметить сессию завершённой (обновляет серию/неделю) и вернуться на главную. */
  function finishSession() {
    setProgress((p) => {
      const next = withCompletion(p, todayISO());
      saveProgress(next);
      return next;
    });
    setScreen({ name: "home" });
  }

  function renderExercise(
    title: string,
    items: PlayerItem[],
    index: number,
    onBack: () => void,
    setIndex: (i: number) => void,
  ): ReactNode {
    if (items.length === 0) return home();
    return (
      <ExerciseScreen
        title={title}
        items={items}
        index={index}
        onBack={onBack}
        onPrev={() => setIndex(Math.max(0, index - 1))}
        onNext={() => setIndex(Math.min(items.length - 1, index + 1))}
        onFinish={finishSession}
      />
    );
  }

  /** Начать разминку под конкретную зону (рекомендация из теста). */
  function startZoneWarmup(zone: ZoneId) {
    setScreen({ name: "exercise", source: "zone", zoneId: zone, index: 0 });
  }

  function home(): ReactNode {
    const weak = weakestZone(progress.mobilityResults);
    return (
      <HomeScreen
        name={name}
        streak={currentStreak(progress.completedDates)}
        week={weekStatus(progress.completedDates)}
        lastScore={progress.mobilityScore}
        recommendedZone={weak ? { id: weak, title: zoneTitle(weak) } : undefined}
        onOpenWorkout={(id) => setScreen({ name: "workout", workoutId: id })}
        onStartWorkout={(id) =>
          setScreen({
            name: "exercise",
            source: "workout",
            workoutId: id,
            index: 0,
          })
        }
        onOpenPrep={() => setScreen({ name: "prep" })}
        onOpenTest={() => setScreen({ name: "mtest" })}
        onWarmupZone={startZoneWarmup}
      />
    );
  }

  function render(): ReactNode {
    if (screen.name === "workout") {
      const workout = getWorkout(screen.workoutId);
      if (workout) {
        return (
          <WorkoutScreen
            workout={workout}
            onBack={() => setScreen({ name: "home" })}
            onStart={() =>
              setScreen({
                name: "exercise",
                source: "workout",
                workoutId: workout.id,
                index: 0,
              })
            }
          />
        );
      }
    }

    if (screen.name === "mtest") {
      return (
        <MobilityTestScreen
          onBack={() => setScreen({ name: "home" })}
          onComplete={(results) => {
            const overall = overallScore(results);
            setProgress((p) => {
              const next: Progress = {
                ...p,
                mobilityScore: overall,
                mobilityResults: results,
                mobilityDate: todayISO(),
              };
              saveProgress(next);
              return next;
            });
            setScreen({ name: "mscore", results });
          }}
        />
      );
    }

    if (screen.name === "mscore") {
      return (
        <MobilityScoreScreen
          results={screen.results}
          onDone={() => setScreen({ name: "home" })}
          onRetake={() => setScreen({ name: "mtest" })}
          onWarmupZone={startZoneWarmup}
        />
      );
    }

    if (screen.name === "prep") {
      return (
        <PrepScreen
          onBack={() => setScreen({ name: "home" })}
          onStartWarmup={(movementId) =>
            setScreen({ name: "exercise", source: "warmup", movementId, index: 0 })
          }
          onStartCooldown={(muscleId) =>
            setScreen({ name: "exercise", source: "cooldown", muscleId, index: 0 })
          }
        />
      );
    }

    if (screen.name === "exercise" && screen.source === "workout") {
      const workout = getWorkout(screen.workoutId);
      if (workout) {
        return renderExercise(
          workout.title,
          workout.exercises,
          screen.index,
          () => setScreen({ name: "workout", workoutId: workout.id }),
          (i) =>
            setScreen({
              name: "exercise",
              source: "workout",
              workoutId: workout.id,
              index: i,
            }),
        );
      }
    }

    if (screen.name === "exercise" && screen.source === "warmup") {
      const routine = buildWarmup(screen.movementId);
      const movement = getMovement(screen.movementId);
      return renderExercise(
        `${movement?.title ?? ""} · Разминка`,
        routine,
        screen.index,
        () => setScreen({ name: "prep" }),
        (i) =>
          setScreen({
            name: "exercise",
            source: "warmup",
            movementId: screen.movementId,
            index: i,
          }),
      );
    }

    if (screen.name === "exercise" && screen.source === "cooldown") {
      const routine = buildCooldown(screen.muscleId);
      const group = getMuscleGroup(screen.muscleId);
      return renderExercise(
        `${group?.title ?? ""} · Заминка`,
        routine,
        screen.index,
        () => setScreen({ name: "prep" }),
        (i) =>
          setScreen({
            name: "exercise",
            source: "cooldown",
            muscleId: screen.muscleId,
            index: i,
          }),
      );
    }

    if (screen.name === "exercise" && screen.source === "zone") {
      const routine = buildZoneWarmup(screen.zoneId);
      return renderExercise(
        `${zoneTitle(screen.zoneId)} · Разминка`,
        routine,
        screen.index,
        () => setScreen({ name: "home" }),
        (i) =>
          setScreen({
            name: "exercise",
            source: "zone",
            zoneId: screen.zoneId,
            index: i,
          }),
      );
    }

    return home();
  }

  return (
    <div key={screenKey(screen)} className="animate-screen flex flex-1 flex-col">
      {render()}
    </div>
  );
}
