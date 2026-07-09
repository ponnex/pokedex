const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master';
const JSDELIVR_BASE = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master';

/**
 * Rewrites PokeAPI sprite URLs from raw.githubusercontent.com (rate-limited,
 * returns 429 on bursts) to the jsDelivr CDN mirror of the same repo.
 * @param {string} url Sprite URL from a PokeAPI response
 */
export function spriteUrl(url: string): string {
	return url ? url.replace(GITHUB_RAW_BASE, JSDELIVR_BASE) : '';
}
