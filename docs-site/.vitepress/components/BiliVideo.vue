<template>
  <div class="bili-video">
    <div class="video-title" v-if="title">📺 {{ title }}</div>
    <div class="video-frame">
      <iframe
        :src="`https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=0&danmaku=0&high_quality=1&page=${page}`"
        :title="title || 'bilibili 视频'"
        scrolling="no"
        frameborder="no"
        loading="lazy"
        allowfullscreen="true"
      ></iframe>
    </div>
    <div class="video-caption" v-if="caption">{{ caption }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  bvid: { type: String, required: true },
  title: { type: String, default: '' },
  caption: { type: String, default: '' },
  page: { type: Number, default: 1 }
})
</script>

<style scoped>
.bili-video {
  margin: 1.5rem 0;
}

.video-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
  font-size: 0.98rem;
}

.video-frame {
  position: relative;
  width: 100%;
  max-width: 720px;
  aspect-ratio: 16 / 9;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: #000;
}

.video-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.video-caption {
  text-align: center;
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  margin-top: 0.4rem;
  font-style: italic;
}
</style>
