<template>
	<div class="bg-white dark:bg-gray-800 gap-x-4 grid-cols-4 2xl:grid-cols-3 inline-grid min-w-full h-24 p-4 relative rounded-2xl shadow animate-pulse">
		<div class="bg-gray-200 col-span-1 dark:bg-gray-700 h-16 justify-self-center p-2 rounded self-center w-16"></div>
		<div class="flex flex-col col-span-3 2xl:col-span-2">
			<div class="bg-gray-100 dark:bg-gray-700 h-5 rounded" :class="skeletonNameWidth"></div>
			<div class="flex space-x-2 mt-3">
				<div v-for="skeletonTypeIdx in skeletonTypeCount" :key="skeletonTypeIdx" class="bg-gray-100 dark:bg-gray-700 h-5 rounded-full self-center w-5"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Literal class names so the Tailwind build keeps them
const NAME_WIDTHS = [ 'w-6/12', 'w-7/12', 'w-8/12', 'w-9/12', 'w-10/12', 'w-11/12' ];

const skeletonNameWidth = NAME_WIDTHS[getRandomIntInclusive(0, NAME_WIDTHS.length - 1)];
const skeletonTypeCount = getRandomIntInclusive(1, 2);
</script>
