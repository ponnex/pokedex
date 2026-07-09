import humps from 'lodash-humps';

interface PokeApiOptions {
	params?: Record<string, string | number>;
}

/**
 * `$fetch` wrapper around PokeAPI with camelized responses
 * (replaces the Nuxt 2 axios plugin + module).
 */
export const usePokeApi = () => {
	const config = useRuntimeConfig();

	return async <T>(path: string, options?: PokeApiOptions): Promise<T> => {
		const response = await $fetch(path, {
			baseURL: config.public.apiBase,
			params: options?.params,
		});
		return humps(response) as T;
	};
};
