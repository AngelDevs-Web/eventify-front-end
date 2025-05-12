<script>
  import ToolbarContent from "./public/components/toolbar-content.component.vue";
  import HeaderContent from "./public/components/header-content.component.vue";

  export default {
    name: "app",
    components: {HeaderContent, ToolbarContent}
  }
</script>

<template>
  <header-content></header-content>
  <div class="flex">
    <toolbar-content></toolbar-content>
  </div>
</template>

<style scoped>

</style>