import { describe, expect, test } from 'vitest';
import { render } from 'svelte/server';
import { vinyls } from '$lib/data/vinyls';
import { booksOnShelf, readingList } from '$lib/data/readingList';

describe('/personal record shelf', () => {
	test('puts every record and book on the shelves as a labelled control', () => {
		const routes = import.meta.glob<{ default: Parameters<typeof render>[0] }>('./**/+page.svelte', {
			eager: true
		});
		const page = routes['./personal/+page.svelte'];

		expect(page, 'the /personal route should exist').toBeDefined();

		const { body } = render(page.default, { props: {} });

		expect(body).toContain('<h1 class="sr-only');
		for (const vinyl of vinyls) {
			const label = `Open ${vinyl.title} by ${vinyl.artist}`.replaceAll('&', '&amp;');
			expect(body, `shelf control for ${vinyl.title}`).toContain(label);
		}
		for (const book of booksOnShelf(readingList)) {
			expect(body, `bookshelf control for ${book.title}`).toContain(`Open ${book.title} by ${book.author}`);
		}
		expect(body).toContain('Full collection on Discogs');
	});
});
