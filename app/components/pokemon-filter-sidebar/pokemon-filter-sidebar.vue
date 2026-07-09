<template>
	<Teleport to="body">
		<Transition name="sidebar-fade">
			<div
				v-if="open"
				class="fixed inset-0 bg-black/40 z-40"
				aria-hidden="true"
				@click="emit('close')"
			/>
		</Transition>
		<Transition name="sidebar-slide">
			<aside
				v-if="open"
				class="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-50 shadow-2xl overflow-y-auto no-scrollbar"
				role="dialog"
				aria-label="Filters"
			>
				<div class="sticky top-0 bg-white dark:bg-gray-900 flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
					<h2 class="text-lg font-semibold text-gray-800 dark:text-white">Filters</h2>
					<div class="flex items-center gap-x-3">
						<button
							v-if="hasActiveFilters"
							type="button"
							class="text-xs font-medium text-red-600 dark:text-red-400 cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
							@click="clearAll()"
						>
							Clear all
						</button>
						<button
							type="button"
							aria-label="Close filters"
							class="p-1.5 rounded-lg cursor-pointer text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
							@click="emit('close')"
						>
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
							</svg>
						</button>
					</div>
				</div>
				<div class="px-5 py-4 space-y-6">
					<section>
						<h3 class="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">Type</h3>
						<pokemon-type-filter
							:model-value="modelValue.types"
							@update:model-value="types => updateFilters({ types })"
						/>
					</section>
					<section>
						<h3 class="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">Generation</h3>
						<div class="flex flex-wrap gap-2" role="group" aria-label="Filter by generation">
							<button
								v-for="generation in GENERATIONS"
								:key="generation.id"
								type="button"
								:aria-pressed="modelValue.generations.includes(generation.id)"
								class="px-3 py-1.5 rounded-xl cursor-pointer text-xs font-bold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-white"
								:class="modelValue.generations.includes(generation.id)
									? 'bg-red-600 text-white shadow-md'
									: 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'"
								@click="toggleGeneration(generation.id)"
							>
								{{ generation.label }}
							</button>
						</div>
					</section>
					<section>
						<h3 class="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">Moves</h3>
						<input
							v-model="moveSearch"
							type="search"
							placeholder="Search moves"
							autocomplete="off"
							aria-label="Search moves"
							class="w-full mb-2 font-medium text-sm text-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-gray-100 dark:bg-gray-800 rounded-xl py-1.5 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-white"
						>
						<div class="flex flex-wrap gap-2" role="group" aria-label="Browse moves by category">
							<button
								v-for="damageClass in MOVE_CATEGORIES"
								:key="damageClass"
								type="button"
								:aria-pressed="selectedMoveCategory === damageClass"
								class="px-3 py-1.5 rounded-xl cursor-pointer text-xs font-bold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-white"
								:class="selectedMoveCategory === damageClass
									? 'bg-red-600 text-white shadow-md'
									: 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'"
								@click="toggleMoveCategory(damageClass)"
							>
								{{ startCase(damageClass) }}
							</button>
						</div>
						<div
							v-if="categoryMoves.length"
							class="mt-2 max-h-48 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-2"
						>
							<button
								v-for="move in categoryMoves"
								:key="move"
								type="button"
								class="px-3 py-1.5 rounded-xl cursor-pointer text-xs font-bold bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-white"
								@click="addMove(move)"
							>
								{{ startCase(move) }}
							</button>
						</div>
						<div v-if="modelValue.moves.length" class="mt-2 flex flex-wrap gap-2">
							<button
								v-for="move in modelValue.moves"
								:key="move"
								type="button"
								:aria-label="`Remove ${startCase(move)} move filter`"
								class="flex items-center gap-x-1.5 px-3 py-1.5 rounded-xl cursor-pointer text-xs font-bold bg-red-600 text-white shadow-md hover:opacity-80 transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-white"
								@click="removeMove(move)"
							>
								{{ startCase(move) }}
								<svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
									<path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
								</svg>
							</button>
						</div>
					</section>
					<section>
						<h3 class="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">Category</h3>
						<div class="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
							<button
								v-for="category in CATEGORIES"
								:key="category.id"
								type="button"
								:aria-pressed="modelValue.categories.includes(category.id)"
								class="px-3 py-1.5 rounded-xl cursor-pointer text-xs font-bold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-white"
								:class="modelValue.categories.includes(category.id)
									? 'bg-red-600 text-white shadow-md'
									: 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'"
								@click="toggleCategory(category.id)"
							>
								{{ category.label }}
							</button>
						</div>
					</section>
				</div>
			</aside>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
import { startCase } from 'lodash-es';
import type { PropType } from 'vue';
import type { PokemonFilters, PokemonCategory } from '~/types/pokemon-list';

const GENERATIONS = [
	{ id: 1, label: 'Gen I' },
	{ id: 2, label: 'Gen II' },
	{ id: 3, label: 'Gen III' },
	{ id: 4, label: 'Gen IV' },
	{ id: 5, label: 'Gen V' },
	{ id: 6, label: 'Gen VI' },
	{ id: 7, label: 'Gen VII' },
	{ id: 8, label: 'Gen VIII' },
	{ id: 9, label: 'Gen IX' },
];

const CATEGORIES: { id: PokemonCategory; label: string }[] = [
	{ id: 'legendary', label: 'Legendary' },
	{ id: 'mythical', label: 'Mythical' },
	{ id: 'baby', label: 'Baby' },
];

const props = defineProps({
	open: {
		type: Boolean,
		default: false,
	},
	modelValue: {
		type: Object as PropType<PokemonFilters>,
		default: () => { return { types: [], generations: [], categories: [], moves: [] } as PokemonFilters; },
	},
});

const emit = defineEmits<{
	'update:modelValue': [filters: PokemonFilters];
	close: [];
}>();

const pokemonStore = usePokemonStore();

const MOVE_CATEGORIES = [ 'physical', 'special', 'status' ];

const selectedMoveCategory = ref('');
const moveSearch = ref('');

// Load the move list the first time the sidebar opens
watch(() => props.open, (open) => {
	if (open) {
		pokemonStore.getMoveIndex();
	}
}, { immediate: true });

// Moves shown in the browse panel: narrowed by the selected category, the
// search text (2+ chars), or both; hidden when neither is active
const categoryMoves = computed(() => {
	const search = moveSearch.value.trim().toLowerCase();
	if (!selectedMoveCategory.value && search.length < 2) {
		return [];
	}
	return pokemonStore.moveIndex
		.filter((move) => {
			if (props.modelValue.moves.includes(move.name)) {
				return false;
			}
			if (selectedMoveCategory.value && move.damageClass !== selectedMoveCategory.value) {
				return false;
			}
			return search.length < 2 || move.name.includes(search);
		})
		.map(move => move.name);
});

const toggleMoveCategory = (damageClass: string) => {
	selectedMoveCategory.value = selectedMoveCategory.value === damageClass ? '' : damageClass;
};

const addMove = (move: string) => {
	updateFilters({ moves: [ ...props.modelValue.moves, move ] });
};

const removeMove = (move: string) => {
	updateFilters({ moves: props.modelValue.moves.filter(active => active !== move) });
};

const hasActiveFilters = computed(() => {
	return props.modelValue.types.length > 0
		|| props.modelValue.generations.length > 0
		|| props.modelValue.categories.length > 0
		|| props.modelValue.moves.length > 0;
});

const updateFilters = (partial: Partial<PokemonFilters>) => {
	emit('update:modelValue', { ...props.modelValue, ...partial });
};

const toggleGeneration = (generation: number) => {
	const generations = props.modelValue.generations.includes(generation)
		? props.modelValue.generations.filter((active) => { return active !== generation; })
		: [ ...props.modelValue.generations, generation ];
	updateFilters({ generations });
};

const toggleCategory = (category: PokemonCategory) => {
	const categories = props.modelValue.categories.includes(category)
		? props.modelValue.categories.filter((active) => { return active !== category; })
		: [ ...props.modelValue.categories, category ];
	updateFilters({ categories });
};

const clearAll = () => {
	emit('update:modelValue', { types: [], generations: [], categories: [], moves: [] });
};

const onKeydown = (event: KeyboardEvent) => {
	if (event.key === 'Escape' && props.open) {
		emit('close');
	}
};

onMounted(() => {
	window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
	window.removeEventListener('keydown', onKeydown);
});
</script>

<style lang="scss" scoped>
.sidebar-fade-enter-active,
.sidebar-fade-leave-active {
	transition: opacity 0.2s ease;
}

.sidebar-fade-enter-from,
.sidebar-fade-leave-to {
	opacity: 0;
}

.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
	transition: transform 0.25s ease;
}

.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
	transform: translateX(100%);
}
</style>
