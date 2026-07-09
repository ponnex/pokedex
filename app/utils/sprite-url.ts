const JSDELIVR_BASE = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master';

/**
 * Builds the official-artwork sprite URL straight from a Pokemon id, served
 * from the jsDelivr CDN mirror (raw.githubusercontent.com rate-limits bursts).
 * @param {number} id Pokemon id
 */
export function officialArtworkUrl(id: number): string {
	return `${JSDELIVR_BASE}/sprites/pokemon/other/official-artwork/${id}.png`;
}
