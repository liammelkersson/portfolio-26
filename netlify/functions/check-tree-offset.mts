import type { Config } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { fetchTreesPlanted } from '../../src/lib/impact/ecologiReporting';
import { treesOwed } from '../../src/lib/impact/treesOwed';
import { monthKey } from '../../src/lib/impact/monthKey';
import {
	purchasesThisMonthCount,
	shouldPurchaseTree,
	type PurchaseState
} from '../../src/lib/impact/purchaseDecision';
import { VISITS_STORE, VISITS_KEY, GRAMS_PER_TREE, MEASURED_URL } from '../../src/lib/impact/config';

const ECOLOGI_PURCHASE_ENDPOINT = 'https://public.ecologi.com/impact/trees';
const PURCHASE_STATE_KEY = 'purchase-state';

// Website Carbon deprecated public access to their full crawl API in July 2025,
// but this legacy /b endpoint still responds — same source the footer badge
// and /impact page display, so it only updates whenever they next recrawl.
async function fetchGramsPerView(): Promise<number> {
	const response = await fetch(`https://api.websitecarbon.com/b?url=${encodeURIComponent(MEASURED_URL)}`);
	if (!response.ok) {
		throw new Error(`websitecarbon request failed: ${response.status}`);
	}
	const data = await response.json();
	if (typeof data.c !== 'number') {
		throw new Error('unexpected websitecarbon response shape');
	}
	return data.c;
}

async function readVisitCount(store: ReturnType<typeof getStore>): Promise<number> {
	return ((await store.get(VISITS_KEY, { type: 'json' })) as number | null) ?? 0;
}

async function purchaseTree(apiKey: string, idempotencyKey: string): Promise<void> {
	const response = await fetch(ECOLOGI_PURCHASE_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
			'Idempotency-Key': idempotencyKey
		},
		body: JSON.stringify({
			number: 1,
			name: 'liammelkersson.xyz carbon offset'
		})
	});
	if (!response.ok) {
		throw new Error(`Ecologi purchase failed: ${response.status} ${await response.text()}`);
	}
}

export default async () => {
	try {
		const apiKey = process.env.ECOLOGI_API_KEY;
		const username = process.env.PUBLIC_ECOLOGI_USERNAME;
		if (!apiKey || !username) {
			console.log('check-tree-offset: ECOLOGI_API_KEY or PUBLIC_ECOLOGI_USERNAME not configured, skipping run');
			return new Response('not configured', { status: 200 });
		}

		const store = getStore(VISITS_STORE);

		const [visits, treesPurchased, gramsPerView] = await Promise.all([
			readVisitCount(store),
			fetchTreesPlanted(username),
			fetchGramsPerView()
		]);

		const owed = treesOwed(visits * gramsPerView, treesPurchased, GRAMS_PER_TREE);
		if (owed < 1) {
			console.log(`check-tree-offset: no trees owed yet (${visits} visits, ${treesPurchased} already planted)`);
			return new Response('no trees owed', { status: 200 });
		}

		const state = (await store.get(PURCHASE_STATE_KEY, { type: 'json' })) as PurchaseState | null;
		const currentMonth = monthKey(new Date());
		const purchasesThisMonth = purchasesThisMonthCount(state, currentMonth);

		if (!shouldPurchaseTree(owed, purchasesThisMonth)) {
			console.log(`check-tree-offset: monthly cap reached for ${currentMonth}`);
			return new Response('monthly cap reached', { status: 200 });
		}

		if (process.env.DRY_RUN !== 'false') {
			console.log(`check-tree-offset: DRY_RUN, would purchase 1 tree (${owed} owed, month ${currentMonth})`);
			return new Response('dry run', { status: 200 });
		}

		await purchaseTree(apiKey, `tree-offset-${currentMonth}`);
		await store.setJSON(PURCHASE_STATE_KEY, {
			lastPurchaseMonth: currentMonth,
			purchasesThisMonth: purchasesThisMonth + 1
		});

		console.log(`check-tree-offset: purchased 1 tree for ${currentMonth}`);
		return new Response('purchased', { status: 200 });
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error(`check-tree-offset: run failed - ${message}`);
		return new Response(message, { status: 500 });
	}
};

export const config: Config = {
	schedule: '0 */6 * * *'
};
