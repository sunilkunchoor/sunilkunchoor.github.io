'use client';
import { useEffect } from 'react';

export default function PwaUpdater() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      let refreshing = false;

      // Reload when the new service worker takes over
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          // Clear caches before reloading to avoid stale App Router payload
          caches.keys().then((cacheNames) => {
            Promise.all(cacheNames.map((name) => caches.delete(name))).then(() => {
              window.location.reload();
            });
          });
        }
      });

      // Force the browser to check for updates when the app becomes visible or is focused
      const checkForUpdates = () => {
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) {
            reg.update();
          }
        });
      };

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          checkForUpdates();
        }
      });
      window.addEventListener('focus', checkForUpdates);

      // Also try to check on initial mount
      checkForUpdates();

      return () => {
        window.removeEventListener('focus', checkForUpdates);
      };
    }
  }, []);

  return null;
}
