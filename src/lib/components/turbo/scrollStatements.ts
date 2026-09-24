export function getActiveStatementIndex(progress: number, statementCount: number) {
	const clampedProgress = Math.min(1, Math.max(0, progress));
	return Math.min(statementCount - 1, Math.floor(clampedProgress * statementCount));
}
