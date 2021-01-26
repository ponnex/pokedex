import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class ChangeTheme extends Vue {
	onChangeTheme() {
		this.$colorMode.preference === 'light' ? this.$colorMode.preference = 'dark' : this.$colorMode.preference = 'light';
	}
}
