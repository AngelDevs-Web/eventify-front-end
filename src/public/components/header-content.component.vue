<script>
import LanguageSwitcher from "./language-switcher.component.vue";

export default {
  name: "header-content",
  components: {LanguageSwitcher}
}
</script>

<template>
  <div style ="padding: 0;">
    <pv-toolbar style="background-color: #3A506B; border-radius:0;">
      <template #start>
        <div class="flex align-items-center justify-content-center">
          <img src="../../assets/eventify-logo.png" alt="eventify-logo">
        </div>

      </template>
      <template #end>
        <div class="flex align-items-center justify-content-center">
          <language-switcher></language-switcher>
          <pv-avatar class="ml-4" label="U" shape="circle"></pv-avatar>
        </div>
      </template>
    </pv-toolbar>
  </div>
</template>

<style scoped>
img{
  width: 150px;
}
</style>