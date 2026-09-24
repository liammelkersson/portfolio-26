import { describe, expect, test } from 'vitest';
import { render } from 'svelte/server';
import { getActiveStatementIndex } from '$lib/components/turbo/scrollStatements';

describe('scroll statement progression', () => {
	test('maps the start and end of the section to the first and last statements', () => {
		expect(getActiveStatementIndex(0, 6)).toBe(0);
		expect(getActiveStatementIndex(1, 6)).toBe(5);
	});

	test('clamps progress that falls outside the section', () => {
		expect(getActiveStatementIndex(-0.5, 6)).toBe(0);
		expect(getActiveStatementIndex(1.5, 6)).toBe(5);
	});
});

describe('/turbo landing page', () => {
	test('presents Liam’s introduction beside a browsable project gallery', () => {
		const routes = import.meta.glob<{ default: Parameters<typeof render>[0] }>('./**/+page.svelte', {
			eager: true
		});
		const page = routes['./turbo/+page.svelte'];

		expect(page, 'the /turbo route should exist').toBeDefined();

		const { body, head } = render(page.default, { props: {} });

		expect(head).toContain('Liam Melkersson — Designer &amp; Web Developer');
		expect(body).toContain('<aside');
		expect(body).toContain('LIAM MELKERSSON');
		expect(body).toContain('I design and build for the web');
		expect(body).toContain('Let’s chat');
		expect(body).not.toContain('Contact me');
		expect(body).toContain('aria-haspopup="dialog"');
		expect(body).toContain('<dialog');
		expect(body).toContain('About Liam');
		expect(body).toContain('0.08g CO₂/view · cleaner than 92% of pages');
		expect(body).toContain('Carbon impact');
		expect(body).toContain('This website consumes');
		expect(body).toContain('Website Carbon');
		expect(body).toContain('aria-label="Project gallery"');
		expect(body).toContain('awaio.com');
		expect(body).toContain('jonwest.se');
		expect(body).not.toContain('What I do');
		expect(body).toContain('Good products begin with clear ideas');
		expect(body).toContain('That’s the work I care about');
		expect(body).toContain('aria-label="Design principles"');
		expect(body).toContain('Awaio');
		expect(body).toContain('--brand-color: #3DBB95');
		expect(body).toContain('--logo-width: 87.8px');
		expect(body).not.toContain('Jönköping, Sweden');
		expect(body).not.toContain('Client testimonials');
		expect(body).not.toContain('Ida von Gegerfelt');
		expect(body).not.toContain('Niclas Eglinger');
		expect(body).toContain('Follow');
		expect(body).toContain('Get in touch');
		expect(body).toContain('mailto:liam@awaio.com');
	});
});
