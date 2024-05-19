<script setup lang="ts">

import { ref, watch } from 'vue'
const loading = ref(false)



const props = defineProps({
    open: {
        type: Boolean,
        required: true
    },
    title: {
        type: [String, Array],
        required: true
    },
    description: {
        type: [String, Array],
        required: true
    },
    icon: {
        type: [String, Array],
        required: true
    },
    color: {
        type: String,
        default: ''
    },
    checkFunction: {
        type: [Function, null],
        required: true,
    },
    cancelFunction: {
        type: [Function, null],
        required: true,
    }
});

let isOpenAlert = ref(false)

watch(() => props.open, (val) => {
    isOpenAlert.value = val
})

</script>

<template>
    <UDashboardModal v-model="isOpenAlert" :title="props.title" :description="props.description" :icon="props.icon" :ui="{
        icon: { base: props.color } as any,
        footer: { base: 'ml-16' } as any
    }">
        <template #footer>
            <UButton color="white" label="確認" :loading="loading" v-if="props.checkFunction"
                @click="props.checkFunction" />
            <UButton color="white" label="取消" v-if="props.cancelFunction" @click="props.cancelFunction" />
        </template>
    </UDashboardModal>
</template>
