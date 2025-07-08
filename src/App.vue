<script>
import ToolbarContent from "./public/components/toolbar-content.component.vue";
import HeaderContent from "./public/components/header-content.component.vue";

export default {
  name: "app",
  components: {HeaderContent, ToolbarContent}
}
</script>

<template>
  <div class="app-wrapper">
    <header-content />
    <div class="layout-body">
      <toolbar-content />
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 🔒 bloquea scroll externo */
}

.layout-body {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

.main-content {
  flex-grow: 1;
  overflow-y: auto; /* ✅ solo aquí habrá scroll si se necesita */
}
</style>