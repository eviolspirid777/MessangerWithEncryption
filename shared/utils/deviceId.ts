/**
 * Генерирует уникальный ID устройства
 */
function generateDeviceId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  const random2 = Math.random().toString(36).substring(2, 15);
  return `device_${timestamp}_${random}_${random2}`;
}

// Сохраняем ID в памяти для постоянства в течение сессии
let cachedDeviceId: string | null = null;

/**
 * Получает или создает уникальный ID устройства
 * ID сохраняется в памяти для постоянства в течение сессии приложения
 */
export function getDeviceId(): string {
  if (!cachedDeviceId) {
    cachedDeviceId = generateDeviceId();
  }
  return cachedDeviceId;
}

