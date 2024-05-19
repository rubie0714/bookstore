<script setup lang="ts">
import card from '~/src/components/books/card.vue';
const route = useRoute()
</script>
<template>

    <p>aaaaas {{ route.params.id }}</p>
    <card :id="route.params.id"></card>
    <div>
    </div>

</template>
