import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vitest/config';
import { LATEST_RESULT_PATH } from './src/lib/football/footballConfig';
import { fetchLatestWestHamResult } from './src/lib/football/westHamResultSource';

/** Netlify Functions don't run under `vite dev`; serve the football result the same way locally */
function westHamResultDevEndpoint(): Plugin {
	return {
		name: 'west-ham-result-dev-endpoint',
		apply: 'serve',
		configureServer(server) {
			server.middlewares.use(LATEST_RESULT_PATH, async (_request, response) => {
				const result = await fetchLatestWestHamResult().catch(() => null);
				response.setHeader('Content-Type', 'application/json');
				response.end(JSON.stringify({ result }));
			});
		}
	};
}

export default defineConfig({
	plugins: [
		westHamResultDevEndpoint(),
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			adapter: adapter({ fallback: '404.html' })
		})
	],
	test: {
		include: ['src/**/*.test.ts']
	}
});
