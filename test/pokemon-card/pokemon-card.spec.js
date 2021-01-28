import { mount } from '@vue/test-utils';
import PokemonCard from '@/components/pokemon-card/pokemon-card.vue';

describe('PokemonCard', () => {
	test('is a Vue instance', () => {
		const wrapper = mount(PokemonCard);
		expect(wrapper.isVueInstance()).toBeTruthy();
	});
});
