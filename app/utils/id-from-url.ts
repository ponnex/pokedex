/**
 * Extracts the trailing resource id from a PokeAPI resource URL.
 * @param {string} url PokeAPI resource URL ending with `/{id}/`
 */
export function idFromUrl(url: string) {
	return url.slice(0, url.length - 1).substring(url.slice(0, url.length - 1).lastIndexOf('/') + 1);
}
