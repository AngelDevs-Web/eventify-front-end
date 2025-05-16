<script>
import MiniCalendar from "../components/mini-calendar.component.vue";
import EventCalendar from "../components/event-calendar.component.vue";

export default {
  name: "calendar-view",
  components: {MiniCalendar, EventCalendar},
}
</script>

<template>
  <div class="grid grid-cols-4 gap-4">
    <div class="col-span-1">
      <mini-calendar/>
    </div>
    <div class="col-span-3">
      <event-calendar/>
    </div>
  </div>

</template>

<style scoped>

</style>