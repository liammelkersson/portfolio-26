import { MAX_PLAUSIBLE_PAGE_BYTES } from './config';

export function isPlausibleByteCount(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= MAX_PLAUSIBLE_PAGE_BYTES;
}
