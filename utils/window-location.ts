import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class WindowLocation extends Vue {
	pushState(url: string) {
		if (window.history.pushState) {
			const newurl = url;
			window.history.pushState({ path: newurl }, '', newurl);
		}
	}
}
