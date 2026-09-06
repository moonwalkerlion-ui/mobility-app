// Моковые (заглушечные) данные тренировок.
// Реальные видео и подробные описания добавим в самом конце — сейчас важна структура и визуал.

export type Exercise = {
  id: string;
  title: string;
  /** Длительность выполнения в секундах. */
  duration: number;
  /** Короткое описание-заглушка. Позже заменим на реальный текст. */
  description: string;
  /** Ссылка на видео/гиф. Заполним в конце проекта. */
  videoUrl?: string;
};

export type Level = "Начинающий" | "Средний" | "Продвинутый";

export type Workout = {
  id: string;
  title: string;
  /** Короткий подзаголовок под названием. */
  subtitle: string;
  level: Level;
  /** Эмодзи вместо обложки-картинки (заглушка). */
  emoji: string;
  exercises: Exercise[];
};

/** Суммарная длительность тренировки в минутах (округляем вверх). */
export function totalMinutes(workout: Workout): number {
  const seconds = workout.exercises.reduce((sum, ex) => sum + ex.duration, 0);
  return Math.max(1, Math.round(seconds / 60));
}

const placeholderDescription =
  "Описание упражнения появится позже. Выполняй движение плавно, без рывков, дыши ровно.";

export const workouts: Workout[] = [
  {
    id: "morning-mobility",
    title: "Утренняя подвижность",
    subtitle: "Мягкий разогрев всего тела",
    level: "Начинающий",
    emoji: "🌅",
    exercises: [
      { id: "neck-rolls", title: "Круговые движения шеей", duration: 40, description: placeholderDescription },
      { id: "shoulder-circles", title: "Вращения плечами", duration: 40, description: placeholderDescription },
      { id: "cat-cow", title: "Кошка-корова", duration: 60, description: placeholderDescription },
      { id: "hip-circles", title: "Круги тазом", duration: 50, description: placeholderDescription },
      { id: "forward-fold", title: "Наклон вперёд", duration: 45, description: placeholderDescription },
    ],
  },
  {
    id: "hips-mobility",
    title: "Раскрытие тазобедренных",
    subtitle: "Свобода в бёдрах и пояснице",
    level: "Средний",
    emoji: "🦵",
    exercises: [
      { id: "deep-squat", title: "Глубокий присед-удержание", duration: 60, description: placeholderDescription },
      { id: "pigeon", title: "Поза голубя", duration: 60, description: placeholderDescription },
      { id: "lunge-twist", title: "Выпад с поворотом", duration: 50, description: placeholderDescription },
      { id: "frog-stretch", title: "Растяжка «лягушка»", duration: 60, description: placeholderDescription },
    ],
  },
  {
    id: "spine-back",
    title: "Здоровая спина",
    subtitle: "Снимаем зажимы после сидения",
    level: "Начинающий",
    emoji: "🧘",
    exercises: [
      { id: "cobra", title: "Поза кобры", duration: 45, description: placeholderDescription },
      { id: "child-pose", title: "Поза ребёнка", duration: 60, description: placeholderDescription },
      { id: "thread-needle", title: "Продевание нити", duration: 50, description: placeholderDescription },
      { id: "seated-twist", title: "Скрутка сидя", duration: 50, description: placeholderDescription },
    ],
  },
  {
    id: "full-flow",
    title: "Полный поток",
    subtitle: "Всё тело за один подход",
    level: "Продвинутый",
    emoji: "🔥",
    exercises: [
      { id: "sun-salute", title: "Приветствие солнцу", duration: 90, description: placeholderDescription },
      { id: "deep-lunge", title: "Глубокий выпад", duration: 60, description: placeholderDescription },
      { id: "shoulder-bridge", title: "Мостик на плечах", duration: 60, description: placeholderDescription },
      { id: "wide-squat", title: "Широкий присед", duration: 60, description: placeholderDescription },
      { id: "full-fold", title: "Складка стоя", duration: 60, description: placeholderDescription },
      { id: "final-rest", title: "Расслабление лёжа", duration: 90, description: placeholderDescription },
    ],
  },
];

/** Найти тренировку по id (для экрана тренировки). */
export function getWorkout(id: string): Workout | undefined {
  return workouts.find((w) => w.id === id);
}
