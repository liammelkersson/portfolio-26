export type TreesStatus = { total: number; pending: number };

export async function fetchTreesPlanted(username: string, signal?: AbortSignal): Promise<TreesStatus> {
	const response = await fetch(`https://public.ecologi.com/users/${encodeURIComponent(username)}/trees`, {
		signal
	});
	if (!response.ok) {
		throw new Error(`ecologi reporting request failed: ${response.status}`);
	}
	const data = await response.json();
	if (typeof data.total !== 'number' || typeof data.pending !== 'number') {
		throw new Error('unexpected ecologi reporting response shape');
	}
	return { total: data.total, pending: data.pending };
}
