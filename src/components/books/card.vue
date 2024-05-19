<script setup lang="ts">


const props = defineProps({
    id: {
        type: [String, Array],
        required: true
    }
});

</script>

<template>
    <div>
        <p>gggg {{ props.id }}</p>
    </div>
</template>
