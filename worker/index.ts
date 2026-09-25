import { REPORT_CARBON_STATS_PATH, VISIT_COUNTER_PATH } from '../src/lib/impact/config';
import { respondToVisitCounter } from './visitCounterRoute';
import { respondToCarbonStatsReport } from './carbonStatsRoute';
import { runTreeOffsetCheck } from './treeOffsetJob';

type WorkerEnv = Env & { ECOLOGI_API_KEY?: string };
type ApiRoute = (request: Request, env: WorkerEnv) => Promise<Response>;

const API_ROUTES = new Map<string, ApiRoute>([
	[VISIT_COUNTER_PATH, (request, env) => respondToVisitCounter(request, env.DB)],
	[REPORT_CARBON_STATS_PATH, (request, env) => respondToCarbonStatsReport(request, env.DB)]
]);

export default {
	fetch(request, env) {
		const route = API_ROUTES.get(new URL(request.url).pathname);
		return route ? route(request, env) : env.ASSETS.fetch(request);
	},
	async scheduled(_controller, env, ctx) {
		ctx.waitUntil(runTreeOffsetCheck(env));
	}
} satisfies ExportedHandler<WorkerEnv>;
