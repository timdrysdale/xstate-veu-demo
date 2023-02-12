<script setup>
  console.log('hello script setup');
  const props = defineProps(['description'])
</script>

<template>
   <div>  Card for {{ description }} </div>
</template>



