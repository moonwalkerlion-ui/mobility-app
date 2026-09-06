// Обёртка над хранилищем. Внутри Telegram — CloudStorage (данные привязаны к
// пользователю, хранит сам Telegram, бэкенд не нужен). Вне Telegram (обычный
// браузер) — localStorage, чтобы можно было проверить сохранение и локально.

import {
  getCloudStorageItem,
  setCloudStorageItem,
} from "@telegram-apps/sdk-react";

export async function storageGet(key: string): Promise<string | null> {
  try {
    if (getCloudStorageItem.isAvailable()) {
      const value = await getCloudStorageItem(key);
      return value || null;
    }
  } catch {
    // не в Telegram / недоступно — пробуем localStorage
  }
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function storageSet(key: string, value: string): Promise<void> {
  try {
    if (setCloudStorageItem.isAvailable()) {
      await setCloudStorageItem(key, value);
      return;
    }
  } catch {
    // падаем в localStorage
  }
  try {
    localStorage.setItem(key, value);
  } catch {
    // ничего не поделаешь — молча пропускаем
  }
}
