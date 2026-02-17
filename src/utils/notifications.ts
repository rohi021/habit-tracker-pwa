/** Request browser notification permission */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  return Notification.requestPermission();
}

/** Show a browser notification (if permitted) or return false */
export function showBrowserNotification(title: string, options?: NotificationOptions): boolean {
  if (!('Notification' in window) || Notification.permission !== 'granted') return false;
  new Notification(title, options);
  return true;
}

/** Get current notification permission */
export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
}
