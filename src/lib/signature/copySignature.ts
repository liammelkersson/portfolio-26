const CLIPBOARD_UNAVAILABLE_ERROR = 'Clipboard API unavailable';

export type CopyMode = 'rich' | 'plain';

/**
 * Copies the signature to the clipboard as rich HTML when the browser
 * supports it, falling back to plain text otherwise (or if the rich write
 * is rejected, e.g. by a permissions prompt the user dismissed).
 */
export async function copyRichSignature(html: string, plainText: string): Promise<CopyMode> {
	if (navigator.clipboard && 'write' in navigator.clipboard && typeof ClipboardItem !== 'undefined') {
		try {
			const item = new ClipboardItem({
				'text/html': new Blob([html], { type: 'text/html' }),
				'text/plain': new Blob([plainText], { type: 'text/plain' })
			});
			await navigator.clipboard.write([item]);
			return 'rich';
		} catch {
			// Rich write unsupported/denied — fall through to plain text.
		}
	}

	if (!navigator.clipboard) throw new Error(CLIPBOARD_UNAVAILABLE_ERROR);
	await navigator.clipboard.writeText(plainText);
	return 'plain';
}
