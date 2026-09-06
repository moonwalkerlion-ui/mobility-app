// Фундамент «зонной» модели: зоны тела, движения (→ зоны), библиотека дрилов
// (→ зона + тип) и сборщик рутины «разминка/заминка под движение».
// Всё на заглушках-описаниях; реальные видео/тексты добавим в конце проекта.

// ── Зоны тела ────────────────────────────────────────────────────────────────
export type ZoneId =
  | "shoulders"
  | "overhead"
  | "thoracic"
  | "hips"
  | "posterior"
  | "ankles"
  | "wrists";

export type Zone = { id: ZoneId; title: string };

export const zones: Zone[] = [
  { id: "shoulders", title: "Плечи" },
  { id: "overhead", title: "Над головой" },
  { id: "thoracic", title: "Грудной отдел" },
  { id: "hips", title: "Таз" },
  { id: "posterior", title: "Задняя цепь" },
  { id: "ankles", title: "Голеностоп" },
  { id: "wrists", title: "Запястья" },
];

// ── Дрилы (упражнения-подготовки) ────────────────────────────────────────────
// type: activation — «включить» мышцу; dynamic — динамика (в разминку);
//        static — статическая растяжка (в заминку).
export type DrillType = "activation" | "dynamic" | "static";

export type Drill = {
  id: string;
  title: string;
  zone: ZoneId;
  type: DrillType;
  /** Длительность выполнения в секундах. */
  duration: number;
  description: string;
  videoUrl?: string;
};

const ph = "Описание появится позже. Двигайся плавно, без рывков, дыши ровно.";

export const drills: Drill[] = [
  // Плечи
  { id: "sh-band-circles", title: "Круги руками с резиной", zone: "shoulders", type: "activation", duration: 40, description: ph },
  { id: "sh-wall-slides", title: "Скольжения руками у стены", zone: "shoulders", type: "dynamic", duration: 45, description: ph },
  { id: "sh-crossbody", title: "Растяжка плеча поперёк корпуса", zone: "shoulders", type: "static", duration: 40, description: ph },

  // Над головой
  { id: "oh-dislocates", title: "Выкруты с палкой", zone: "overhead", type: "dynamic", duration: 45, description: ph },
  { id: "oh-wall-hold", title: "Overhead-удержание у стены", zone: "overhead", type: "activation", duration: 40, description: ph },
  { id: "oh-lat-stretch", title: "Растяжка широчайших", zone: "overhead", type: "static", duration: 45, description: ph },

  // Грудной отдел
  { id: "th-openbook", title: "«Раскрытая книга» на боку", zone: "thoracic", type: "dynamic", duration: 45, description: ph },
  { id: "th-rotations", title: "Вращения грудного отдела", zone: "thoracic", type: "dynamic", duration: 45, description: ph },
  { id: "th-foam-ext", title: "Раскрытие грудного отдела на валике", zone: "thoracic", type: "static", duration: 50, description: ph },

  // Таз
  { id: "hp-9090", title: "Переключения 90/90", zone: "hips", type: "dynamic", duration: 50, description: ph },
  { id: "hp-lunge-open", title: "Выпад с раскрытием", zone: "hips", type: "dynamic", duration: 45, description: ph },
  { id: "hp-pigeon", title: "Растяжка «голубь»", zone: "hips", type: "static", duration: 50, description: ph },

  // Задняя цепь
  { id: "ps-glute-bridge", title: "Ягодичный мост", zone: "posterior", type: "activation", duration: 40, description: ph },
  { id: "ps-hinge", title: "Наклоны с прямой спиной (hip hinge)", zone: "posterior", type: "dynamic", duration: 45, description: ph },
  { id: "ps-ham-stretch", title: "Растяжка задней поверхности бедра", zone: "posterior", type: "static", duration: 45, description: ph },

  // Голеностоп
  { id: "an-band-mob", title: "Мобилизация голеностопа с резиной", zone: "ankles", type: "activation", duration: 45, description: ph },
  { id: "an-knee-wall", title: "Раскачка колена к стене", zone: "ankles", type: "dynamic", duration: 40, description: ph },
  { id: "an-calf-stretch", title: "Растяжка икры", zone: "ankles", type: "static", duration: 40, description: ph },

  // Запястья
  { id: "wr-circles", title: "Круги запястьями", zone: "wrists", type: "dynamic", duration: 30, description: ph },
  { id: "wr-floor-stretch", title: "Растяжка запястий на полу", zone: "wrists", type: "static", duration: 40, description: ph },
];

// ── Движения (→ зоны, которые они нагружают) ─────────────────────────────────
export type MovementId =
  | "deadlift"
  | "bench-press"
  | "back-squat"
  | "front-squat"
  | "squat-clean"
  | "squat-snatch"
  | "jerk"
  | "clean-and-jerk";

export type Movement = {
  id: MovementId;
  title: string;
  zones: ZoneId[];
};

export const movements: Movement[] = [
  { id: "deadlift", title: "Становая тяга", zones: ["posterior", "hips", "thoracic"] },
  { id: "bench-press", title: "Жим лёжа", zones: ["shoulders", "thoracic", "wrists"] },
  { id: "back-squat", title: "Присед со штангой на спине", zones: ["ankles", "hips", "thoracic"] },
  { id: "front-squat", title: "Фронтальный присед", zones: ["ankles", "hips", "thoracic", "wrists", "shoulders"] },
  { id: "squat-clean", title: "Взятие в сед", zones: ["ankles", "hips", "thoracic", "wrists", "shoulders"] },
  { id: "squat-snatch", title: "Рывок в сед", zones: ["overhead", "shoulders", "thoracic", "wrists", "hips", "ankles"] },
  { id: "jerk", title: "Толчок со стоек", zones: ["overhead", "shoulders", "thoracic", "ankles", "wrists"] },
  { id: "clean-and-jerk", title: "Взятие + толчок", zones: ["hips", "ankles", "thoracic", "wrists", "shoulders", "overhead"] },
];

export type PrepMode = "warmup" | "cooldown";

export function getMovement(id: MovementId): Movement | undefined {
  return movements.find((m) => m.id === id);
}

export function zoneTitle(id: ZoneId): string {
  return zones.find((z) => z.id === id)?.title ?? id;
}

// ── Разминка под ДВИЖЕНИЕ ────────────────────────────────────────────────────
/**
 * Разминка: идём по зонам движения и берём динамику/активацию
 * (статику в разминку не берём), без повторов.
 */
export function buildWarmup(movementId: MovementId): Drill[] {
  const movement = getMovement(movementId);
  if (!movement) return [];

  const seen = new Set<string>();
  const routine: Drill[] = [];
  for (const zone of movement.zones) {
    for (const drill of drills) {
      if (drill.zone === zone && drill.type !== "static" && !seen.has(drill.id)) {
        seen.add(drill.id);
        routine.push(drill);
      }
    }
  }
  return routine;
}

/** Разминка под КОНКРЕТНУЮ зону (для рекомендации из теста). */
export function buildZoneWarmup(zone: ZoneId): Drill[] {
  return drills.filter((d) => d.zone === zone && d.type !== "static");
}

// ── Заминка по РАБОЧИМ МЫШЦАМ ────────────────────────────────────────────────
// Заминку выбираем не по движению, а по мышцам, которые нагрузились на тренировке.
export type MuscleGroupId =
  | "hamstrings"
  | "quads"
  | "calves"
  | "scapula"
  | "chest"
  | "shoulders"
  | "arms"
  | "upper"
  | "lower"
  | "full";

export type MuscleGroup = { id: MuscleGroupId; title: string; general?: boolean };

export const muscleGroups: MuscleGroup[] = [
  { id: "hamstrings", title: "Задняя поверхность бедра" },
  { id: "quads", title: "Передняя поверхность бедра" },
  { id: "calves", title: "Икроножные" },
  { id: "scapula", title: "Лопатки" },
  { id: "chest", title: "Грудные" },
  { id: "shoulders", title: "Плечи" },
  { id: "arms", title: "Руки" },
  { id: "upper", title: "Верх (общий)", general: true },
  { id: "lower", title: "Низ (общий)", general: true },
  { id: "full", title: "Всё тело", general: true },
];

export type Stretch = {
  id: string;
  title: string;
  muscle: MuscleGroupId;
  duration: number;
  description: string;
  videoUrl?: string;
};

export const stretches: Stretch[] = [
  { id: "st-ham-fold", title: "Наклон к прямой ноге", muscle: "hamstrings", duration: 45, description: ph },
  { id: "st-ham-supine", title: "Растяжка задней поверхности лёжа", muscle: "hamstrings", duration: 45, description: ph },
  { id: "st-quad-stand", title: "Растяжка квадрицепса стоя", muscle: "quads", duration: 40, description: ph },
  { id: "st-quad-kneel", title: "Растяжка квадрицепса с колена", muscle: "quads", duration: 45, description: ph },
  { id: "st-calf-wall", title: "Растяжка икры у стены", muscle: "calves", duration: 40, description: ph },
  { id: "st-calf-soleus", title: "Растяжка камбаловидной (согнутое колено)", muscle: "calves", duration: 40, description: ph },
  { id: "st-scap-round", title: "Вытяжение между лопаток", muscle: "scapula", duration: 40, description: ph },
  { id: "st-scap-hang", title: "Вытяжение верха спины", muscle: "scapula", duration: 40, description: ph },
  { id: "st-chest-door", title: "Растяжка грудных в проёме", muscle: "chest", duration: 45, description: ph },
  { id: "st-chest-wall", title: "Растяжка грудной у стены", muscle: "chest", duration: 40, description: ph },
  { id: "st-shoulder-cross", title: "Растяжка плеча поперёк корпуса", muscle: "shoulders", duration: 40, description: ph },
  { id: "st-shoulder-rear", title: "Растяжка задней дельты", muscle: "shoulders", duration: 40, description: ph },
  { id: "st-arm-biceps", title: "Растяжка бицепса у стены", muscle: "arms", duration: 35, description: ph },
  { id: "st-arm-triceps", title: "Растяжка трицепса за головой", muscle: "arms", duration: 35, description: ph },
];

/** Общие группы раскрываются в набор конкретных мышц. */
const generalGroups: Partial<Record<MuscleGroupId, MuscleGroupId[]>> = {
  upper: ["scapula", "chest", "shoulders", "arms"],
  lower: ["hamstrings", "quads", "calves"],
  full: ["hamstrings", "quads", "calves", "scapula", "chest", "shoulders", "arms"],
};

export function getMuscleGroup(id: MuscleGroupId): MuscleGroup | undefined {
  return muscleGroups.find((g) => g.id === id);
}

/** Заминка по мышце: статические растяжки для группы (общая → набор конкретных). */
export function buildCooldown(muscleId: MuscleGroupId): Stretch[] {
  const targets = generalGroups[muscleId] ?? [muscleId];
  const seen = new Set<string>();
  const out: Stretch[] = [];
  for (const mid of targets) {
    for (const s of stretches) {
      if (s.muscle === mid && !seen.has(s.id)) {
        seen.add(s.id);
        out.push(s);
      }
    }
  }
  return out;
}

// ── Тест на подвижность (гибкость) ───────────────────────────────────────────
const phTest =
  "Как выполнить тест — опишем позже. Сделай движение и честно оцени, как оно ощущается.";

export type MobilityTest = { zone: ZoneId; title: string; instruction: string };

// Тестируем 6 зон (как у GOWOD). Запястья в общий score не берём.
export const mobilityTests: MobilityTest[] = [
  { zone: "shoulders", title: "Заморозка плеча", instruction: phTest },
  { zone: "overhead", title: "Руки над головой у стены", instruction: phTest },
  { zone: "thoracic", title: "Ротация грудного отдела", instruction: phTest },
  { zone: "hips", title: "Глубокий присед", instruction: phTest },
  { zone: "posterior", title: "Наклон к прямым ногам", instruction: phTest },
  { zone: "ankles", title: "Колено за носок", instruction: phTest },
];

export type TestRating = "easy" | "partial" | "hard";

export const ratingScore: Record<TestRating, number> = {
  easy: 95,
  partial: 60,
  hard: 30,
};

export const ratingOptions: { id: TestRating; label: string }[] = [
  { id: "easy", label: "Легко, свободно" },
  { id: "partial", label: "С усилием / частично" },
  { id: "hard", label: "Тяжело / не выходит" },
];

export type MobilityResult = { zone: ZoneId; score: number };

/** Общий балл — среднее по зонам, округлённое. */
export function overallScore(results: MobilityResult[]): number {
  if (results.length === 0) return 0;
  return Math.round(
    results.reduce((sum, r) => sum + r.score, 0) / results.length,
  );
}
