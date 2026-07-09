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

/**
 * Builds the official-artwork sprite URL straight from a Pokemon id,
 * so list cards don't need a per-Pokemon REST call to discover it.
 * @param {number} id Pokemon id
 */
export function officialArtworkUrl(id: number): string {
	return `${JSDELIVR_BASE}/sprites/pokemon/other/official-artwork/${id}.png`;
}
