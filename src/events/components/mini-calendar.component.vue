<script>


export default{
  name: "mini-calendar",
  data() {
    return {
      selectedDate: new Date()
    }
  }
}
</script>

<template>
  <div class="p-4">
    <pv-calendar
        v-model="selectedDate"
        inline
        show-week class="w-full sm:w-[30rem]"

    />
  </div>
</template>

<style scoped>

</style>