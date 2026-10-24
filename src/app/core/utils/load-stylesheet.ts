const pending = new Map<string, Promise<void>>();

/**
 * Injects a non-initial global stylesheet bundle (angular.json `inject: false`)
 * the first time it is needed. Used for PrimeIcons (admin/auth) and SweetAlert2.
 */
export function loadStylesheet(bundleName: string): Promise<void> {
  const href = `${bundleName}.css`;
  const existing = pending.get(href);
  if (existing) {
    return existing;
  }
  const promise = new Promise<void>(resolve => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });
  pending.set(href, promise);
  return promise;
}
