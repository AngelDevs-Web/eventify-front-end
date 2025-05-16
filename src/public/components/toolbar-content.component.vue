<script>


export default {
  name: "toolbar-content"
}
</script>

<template>
  <pv-toolbar class="sidebar-toolbar flex flex-column" style="border-radius:0; background-color:#fff; border:none; padding:0;">
    <template #start>
      <div class="h-4rem"></div>
    </template>
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
a,
router-link {
  padding: 16px 48px;
  text-decoration: none;
  color: #000;
  display: block;
}

a:hover,
router-link:hover {
  background-color: #EAEAEA;
  transition: 0.3s ease-in-out;
  justify-content: flex-start;
}

.router-link-active, .router-link-exact-active {

  background-color: #f0f0f5;
  color: #4ed8c7;
  border-left: 3px solid #4ed8c7;
}
</style>