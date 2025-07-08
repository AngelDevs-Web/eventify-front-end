<script>


export default {
  name: "toolbar-content"
}
</script>

<template>
  <pv-toolbar class="toolbar-custom">
    <template #center>
      <div class="flex flex-column">
        <router-link to="/home">{{ $t('toolbar.home') }}</router-link>
        <router-link to="/profiles">{{ $t('toolbar.profile') }}</router-link>
        <router-link to="/calendar">{{ $t('toolbar.calendar') }}</router-link>
        <router-link to="/events">{{ $t('toolbar.events') }}</router-link>
        <router-link to="/tasks">{{ $t('toolbar.tasks') }}</router-link>
        <router-link to="/quotes">{{ $t('toolbar.quotes') }}</router-link>
        <router-link to="/messages">{{ $t('toolbar.messages') }}</router-link>
        <router-link to="/subscriptions">{{ $t('toolbar.subscriptions') }}</router-link>
      </div>
    </template>
    <template #end>
      <div class="h-4rem"></div>
    </template>
  </pv-toolbar>
</template>

<style scoped>
.toolbar-custom {
  height: 100vh;
  flex-direction: column;
  display: flex;
  background-color: #fff;
  padding: 0;
  border: none;
  border-radius: 0;
}

a {
  padding: 25px 48px;
  text-decoration: none;
  color: #000;
}
a:hover {
  background-color: #3A506B;
  color: #fff;
  transition: 0.3s ease-in-out;
}
</style>