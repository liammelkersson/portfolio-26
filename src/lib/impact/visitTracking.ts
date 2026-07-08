import { incrementVisitCount } from './visitCounter';

const SESSION_KEY = 'visit-tracked';

export function trackVisit(): void {
	if (sessionStorage.getItem(SESSION_KEY)) return;
	sessionStorage.setItem(SESSION_KEY, '1');
	// Best-effort ping: a dropped visit count never affects the visitor,
	// so a failed request is discarded rather than surfaced anywhere.
	incrementVisitCount().catch(() => {});
}
