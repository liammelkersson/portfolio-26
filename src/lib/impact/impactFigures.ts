import { fetchCarbonStats, type CarbonStats } from './websiteCarbon';
import { getVisitCount } from './visitCounter';
import { fetchTreesPlanted, type TreesStatus } from './ecologiReporting';
import { GRAMS_PER_TREE } from './config';
import { treesOwed } from './treesOwed';

const GRAMS_PER_KG = 1000;
const NO_TREES: TreesStatus = { total: 0, pending: 0 };

export interface ImpactFigures {
	gramsPerView: number | null;
	visits: number | null;
	treesPlanted: number | null;
}

type ImpactSourceResults = [
	PromiseSettledResult<CarbonStats>,
	PromiseSettledResult<number>,
	PromiseSettledResult<TreesStatus>
];

function valueOrNull<Value>(result: PromiseSettledResult<Value>): Value | null {
	return result.status === 'fulfilled' ? result.value : null;
}

export function impactFiguresFrom([carbon, visits, trees]: ImpactSourceResults): ImpactFigures {
	const treesStatus = valueOrNull(trees);
	return {
		gramsPerView: valueOrNull(carbon)?.c ?? null,
		visits: valueOrNull(visits),
		treesPlanted: treesStatus ? treesStatus.total + treesStatus.pending : null
	};
}

export async function loadImpactFigures(ecologiUsername: string | undefined, signal: AbortSignal): Promise<ImpactFigures> {
	const results = await Promise.allSettled([
		fetchCarbonStats(signal),
		getVisitCount(signal),
		ecologiUsername ? fetchTreesPlanted(ecologiUsername, signal) : Promise.resolve(NO_TREES)
	]);
	return impactFiguresFrom(results);
}

function totalGramsEmitted(figures: ImpactFigures): number | null {
	if (figures.gramsPerView === null || figures.visits === null) return null;
	return figures.gramsPerView * figures.visits;
}

export function totalKgEmitted(figures: ImpactFigures): number | null {
	const totalGrams = totalGramsEmitted(figures);
	return totalGrams === null ? null : totalGrams / GRAMS_PER_KG;
}

export function treesStillOwed(figures: ImpactFigures): number | null {
	const totalGrams = totalGramsEmitted(figures);
	if (totalGrams === null || figures.treesPlanted === null) return null;
	return treesOwed(totalGrams, figures.treesPlanted, GRAMS_PER_TREE);
}
