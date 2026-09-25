export function jsonResponse(body: unknown): Response {
	return new Response(JSON.stringify(body), {
		headers: { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' }
	});
}
