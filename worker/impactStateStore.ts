import { CARBON_STATS_KEY, VISITS_KEY } from '../src/lib/impact/config';
import type { PurchaseState } from '../src/lib/impact/purchaseDecision';

export type CarbonStats = { c: number; p: number };

const PURCHASE_STATE_KEY = 'purchase-state';

async function readJson<T>(db: D1Database, key: string): Promise<T | null> {
	const row = await db
		.prepare('SELECT value FROM impact_state WHERE key = ?')
		.bind(key)
		.first<{ value: string }>();
	return row ? (JSON.parse(row.value) as T) : null;
}

async function writeJson(db: D1Database, key: string, state: unknown): Promise<void> {
	await db
		.prepare(
			'INSERT INTO impact_state (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
		)
		.bind(key, JSON.stringify(state))
		.run();
}

export async function readVisitCount(db: D1Database): Promise<number> {
	return (await readJson<number>(db, VISITS_KEY)) ?? 0;
}

export async function incrementVisitCount(db: D1Database): Promise<number> {
	const row = await db
		.prepare(
			"INSERT INTO impact_state (key, value) VALUES (?, '1') ON CONFLICT(key) DO UPDATE SET value = CAST(value AS INTEGER) + 1 RETURNING value"
		)
		.bind(VISITS_KEY)
		.first<{ value: string }>();
	return Number(row?.value ?? 1);
}

export function readCarbonStats(db: D1Database): Promise<CarbonStats | null> {
	return readJson<CarbonStats>(db, CARBON_STATS_KEY);
}

export function writeCarbonStats(db: D1Database, stats: CarbonStats): Promise<void> {
	return writeJson(db, CARBON_STATS_KEY, stats);
}

export function readPurchaseState(db: D1Database): Promise<PurchaseState | null> {
	return readJson<PurchaseState>(db, PURCHASE_STATE_KEY);
}

export function writePurchaseState(db: D1Database, state: PurchaseState): Promise<void> {
	return writeJson(db, PURCHASE_STATE_KEY, state);
}
