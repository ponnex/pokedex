/**
 * Light/dark theme toggle (replaces the Nuxt 2 ChangeTheme mixin).
 */
export const useChangeTheme = () => {
	const colorMode = useColorMode();

	const onChangeTheme = () => {
		colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light';
	};

	return { onChangeTheme };
};
