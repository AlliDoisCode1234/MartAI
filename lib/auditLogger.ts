type AuthEventType =
  | 'login.success'
  | 'login.failure'
  | 'login.locked'
  | 'login.rate_limited';

type AuthEvent = {
  type: AuthEventType;
  email?: string;
  ip?: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
};

const RECENT_EVENTS_LIMIT = 50;
const recentEvents: AuthEvent[] = [];

export function logAuthEvent(event: Omit<AuthEvent, 'timestamp'>) {
  const entry: AuthEvent = { ...event, timestamp: Date.now() };
  recentEvents.push(entry);
  if (recentEvents.length > RECENT_EVENTS_LIMIT) {
    recentEvents.shift();
  }
  if (process.env.NODE_ENV !== 'production') {
    console.info('[AuthEvent]', entry);
  }
}

export function getRecentAuthEvents() {
  return [...recentEvents];
}

