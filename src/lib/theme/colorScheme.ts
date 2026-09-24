const DARK_CLASS = 'dark';
const STORAGE_KEY = 'theme';

export function isDarkSchemeActive(): boolean {
	return document.documentElement.classList.contains(DARK_CLASS);
}

export function applyDarkScheme(isDark: boolean) {
	document.documentElement.classList.toggle(DARK_CLASS, isDark);
	localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
}
