<script>
export default {
  name: "toolbar-content"
}
</script>

<template>
  <pv-toolbar class="flex flex-column" style="border-radius:0; background-color:#fff; border:none; padding:0;">
    <template #start>
      <div class="h-4rem"></div>
    </template>
    <template #center>
      <div class="flex flex-column">
        <a href="#">{{ $t('toolbar.home') }}</a>
        <a href="#">{{ $t('toolbar.profile') }}</a>
        <a href="#">{{ $t('toolbar.calendar') }}</a>
        <a href="#">{{ $t('toolbar.events') }}</a>
        <a href="#">{{ $t('toolbar.tasks') }}</a>
        <a href="#">{{ $t('toolbar.quotes') }}</a>
        <a href="#">{{ $t('toolbar.messages') }}</a>
        <a href="#">{{ $t('toolbar.subscriptions') }}</a>
      </div>
    </template>
    <template #end>
      <div class="h-4rem"></div>
    </template>
  </pv-toolbar>
</template>

<style scoped>
a{

  padding: 16px 48px;
  text-decoration: none;
  color: #000;
}
a:hover{
  background-color: #EAEAEA;
  transition: 0.3s ease-in-out;
}
</style>