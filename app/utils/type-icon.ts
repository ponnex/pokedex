const typeIcons = import.meta.glob<string>('~/assets/images/types/*.svg', {
	eager: true,
	import: 'default',
	query: '?url',
});

// Index the glob results by type name (`.../fire.svg` → `fire`) once at module load
const typeIconsByName: Record<string, string> = Object.fromEntries(
	Object.entries(typeIcons).map(([ path, url ]) => {
		return [ path.slice(path.lastIndexOf('/') + 1, -'.svg'.length), url ];
	}),
);

/**
 * Vite-safe resolver for Pokemon type icon SVG URLs
 * (replaces the webpack `require()` calls in the Nuxt 2 components).
 * @param {string} name Pokemon type name (e.g. `fire`)
 */
export function typeIconUrl(name: string): string {
	return typeIconsByName[name] ?? '';
}
