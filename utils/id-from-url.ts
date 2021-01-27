import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class IdFromUrl extends Vue {
	idFromUrl(url: string) {
		return url.slice(0, url.length - 1).substring(url.slice(0, url.length - 1).lastIndexOf('/') + 1);
	}
}
