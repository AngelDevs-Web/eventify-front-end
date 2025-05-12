<script>
import {Button as PvButton} from "primevue";

export default {
  name: "toolbar-content",
  components: {PvButton},
  data(){
    return{
      items:[
        {label:"Home",to:"/home"},
        {label:"Quotes",to:"quotes"},
      ]
    }
  }
}
</script>

<template>
  <pv-toolbar style="border-radius:0; background-color:#fff; border:none; padding:0">
    <template #start>
      <div class="h-4rem"></div>
    </template>
    <template #center>
      <div class="flex flex-column">
        <pv-button v-for="item in items"><router-link :to="item.to">{{ item.label }}</router-link></pv-button>
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
  background-color: #3A506B;
  color: #fff;
  transition: 0.3s ease-in-out;
}
</style>