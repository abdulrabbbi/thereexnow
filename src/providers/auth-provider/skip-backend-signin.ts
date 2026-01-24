// Module-level marker to coordinate interactive auth flows with AuthProvider.
// In React StrictMode (dev) effects/subscriptions can run twice; this helps avoid
// duplicate backend sign-in calls when the auth pages already handle it.

let requestedAt = 0;
const TTL_MS = 10_000;

export function requestSkipBackendSignInOnce() {
  requestedAt = Date.now();
}

export function consumeSkipBackendSignInRequest(): boolean {
  if (!requestedAt) return false;

  const withinTtl = Date.now() - requestedAt < TTL_MS;
  requestedAt = 0;
  return withinTtl;
}

