<template>
  <HistoryGallery v-bind="aviationHistory" />
</template>

<script setup>
import HistoryGallery from './HistoryGallery.vue'
import { aviationHistory } from '../data/historyData'
</script>
