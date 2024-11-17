<script setup>
//Imports
import TestDrawer from "@/views/apps/user/list/TestDrawer.vue"

const isAddJobDrawerVisible = ref(false)
const editJobData = ref(null)
</script>

<template>
  <div>
    <VBtn @click="isAddJobDrawerVisible = true">
      open drawer
    </VBtn>
    <TestDrawer
      v-model:isJobDrawerOpen="isAddJobDrawerVisible"
      :job-data="editJobData"
      @job-data="addNewJob"
    />
  </div>
</template>