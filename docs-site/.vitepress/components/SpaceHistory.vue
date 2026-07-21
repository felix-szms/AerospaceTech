<template>
  <HistoryGallery v-bind="spaceHistory" />
</template>

<script setup>
import HistoryGallery from './HistoryGallery.vue'
import { spaceHistory } from '../data/historyData'
</script>
