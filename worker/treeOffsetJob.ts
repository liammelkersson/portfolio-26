import { fetchTreesPlanted } from '../src/lib/impact/ecologiReporting';
import { treesOwed } from '../src/lib/impact/treesOwed';
import { monthKey } from '../src/lib/impact/monthKey';
import { purchasesThisMonthCount, shouldPurchaseTree } from '../src/lib/impact/purchaseDecision';
import { GRAMS_PER_TREE } from '../src/lib/impact/config';
import { readCarbonStats, readPurchaseState, readVisitCount, writePurchaseState } from './impactStateStore';

const ECOLOGI_PURCHASE_ENDPOINT = 'https://public.ecologi.com/impact/trees';

export type TreeOffsetEnv = {
	DB: D1Database;
	ECOLOGI_API_KEY?: string;
	PUBLIC_ECOLOGI_USERNAME?: string;
	DRY_RUN?: string;
};

async function purchaseTree(apiKey: string, idempotencyKey: string): Promise<void> {
	const response = await fetch(ECOLOGI_PURCHASE_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
			'Idempotency-Key': idempotencyKey
		},
		body: JSON.stringify({ number: 1, name: 'liammelkersson.xyz carbon offset' })
	});
	if (!response.ok) {
		throw new Error(`Ecologi purchase failed: ${response.status} ${await response.text()}`);
	}
}

export async function runTreeOffsetCheck(env: TreeOffsetEnv): Promise<void> {
	const { DB: db, ECOLOGI_API_KEY: apiKey, PUBLIC_ECOLOGI_USERNAME: username } = env;
	if (!apiKey || !username) {
		console.log('check-tree-offset: ECOLOGI_API_KEY or PUBLIC_ECOLOGI_USERNAME not configured, skipping run');
		return;
	}

	const [visits, treesStatus, carbonStats] = await Promise.all([
		readVisitCount(db),
		fetchTreesPlanted(username),
		readCarbonStats(db)
	]);
	if (!carbonStats) {
		console.log('check-tree-offset: no carbon stats reported yet, skipping run');
		return;
	}

	const treesPurchased = treesStatus.total + treesStatus.pending;
	const owed = treesOwed(visits * carbonStats.c, treesPurchased, GRAMS_PER_TREE);
	const currentMonth = monthKey(new Date());
	const purchasesThisMonth = purchasesThisMonthCount(await readPurchaseState(db), currentMonth);

	if (!shouldPurchaseTree(owed, purchasesThisMonth)) {
		console.log(`check-tree-offset: nothing to buy (${owed} owed, ${purchasesThisMonth} bought in ${currentMonth})`);
		return;
	}
	if (env.DRY_RUN !== 'false') {
		console.log(`check-tree-offset: DRY_RUN, would purchase 1 tree (${owed} owed, month ${currentMonth})`);
		return;
	}

	await purchaseTree(apiKey, `tree-offset-${currentMonth}`);
	await writePurchaseState(db, { lastPurchaseMonth: currentMonth, purchasesThisMonth: purchasesThisMonth + 1 });
	console.log(`check-tree-offset: purchased 1 tree for ${currentMonth}`);
}
