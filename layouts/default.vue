<template>
	<main class="max-w-screen-2xl mx-auto">
		<Nuxt keep-alive />
	</main>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class DefaultLayout extends Vue {}
</script>
