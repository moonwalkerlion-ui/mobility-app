// Инициализация Telegram SDK. Всё внутри try/catch: вне Telegram (в браузере)
// эти функции недоступны и бросают ошибку — мы её молча гасим.

import {
  init,
  mountViewport,
  expandViewport,
  mountBackButton,
  showBackButton,
  hideBackButton,
  onBackButtonClick,
} from "@telegram-apps/sdk-react";

// Текущее действие нативной кнопки «Назад». Подписываемся один раз (в initTelegram),
// а при смене экрана просто меняем эту ссылку — чтобы обработчики не накапливались.
let currentBackHandler: (() => void) | null = null;

/** Включает SDK: события, разворот на весь экран, монтирует кнопку «Назад». */
export async function initTelegram(): Promise<void> {
  try {
    init();
  } catch {
    // не в Telegram — выходим
    return;
  }
  try {
    await mountViewport();
  } catch {}
  try {
    expandViewport();
  } catch {}
  try {
    mountBackButton();
  } catch {}
  try {
    // Единственная подписка: дергает актуальный обработчик.
    onBackButtonClick(() => currentBackHandler?.());
  } catch {}
}

/** Показать/спрятать нативную кнопку «Назад» и задать её действие. */
export function setBackButton(visible: boolean, onClick: () => void): void {
  currentBackHandler = onClick;
  try {
    if (visible) {
      showBackButton();
    } else {
      hideBackButton();
    }
  } catch {}
}
