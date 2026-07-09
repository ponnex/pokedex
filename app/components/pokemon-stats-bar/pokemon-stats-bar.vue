<template>
	<div class="bg-gray-200 dark:bg-gray-700 rounded-3xl my-1 h-1.5">
		<span class="block h-full rounded-3xl" :class="`bg-${barColor}`" :style="`width: ${statPercentage}%`"></span>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	stat: {
		type: Number,
		default: 0,
	},
	barColor: {
		type: String,
		default: 'gray',
	},
});

const statPercentage = computed(() => {
	return (props.stat / 255) * 100;
});
</script>
