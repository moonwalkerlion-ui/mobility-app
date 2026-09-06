// Безопасная обёртка над вибро-откликом Telegram.
// Вне Telegram (или пока SDK не инициализирован) функции просто ничего не делают —
// проверяем .isAvailable() и на всякий случай глушим любые ошибки.

import {
  hapticFeedbackImpactOccurred,
  hapticFeedbackNotificationOccurred,
  hapticFeedbackSelectionChanged,
} from "@telegram-apps/sdk-react";

type ImpactStyle = "light" | "medium" | "heavy" | "soft" | "rigid";
type NotifyType = "success" | "warning" | "error";

/** Короткий тактильный «щелчок» при нажатии/действии. */
export function hapticImpact(style: ImpactStyle = "light"): void {
  try {
    if (hapticFeedbackImpactOccurred.isAvailable()) {
      hapticFeedbackImpactOccurred(style);
    }
  } catch {
    // окружение не поддерживает вибро — молча пропускаем
  }
}

/** Отклик на результат: успех/предупреждение/ошибка (напр. завершение сессии). */
export function hapticNotify(type: NotifyType = "success"): void {
  try {
    if (hapticFeedbackNotificationOccurred.isAvailable()) {
      hapticFeedbackNotificationOccurred(type);
    }
  } catch {
    // no-op
  }
}

/** Лёгкий отклик при смене выбора (перелистывание, переключатели). */
export function hapticSelection(): void {
  try {
    if (hapticFeedbackSelectionChanged.isAvailable()) {
      hapticFeedbackSelectionChanged();
    }
  } catch {
    // no-op
  }
}
