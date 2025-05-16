<script>
import TaskBoard from '../components/task-board.component.vue';

export default {
  name: 'TaskManagement',
  components: {
    TaskBoard
  }
}
</script>

<template>
  <div class="task-management">
    <task-board />
  </div>
</template>

<style scoped>
.task-management {
  height: 100%;
  width: 100%;
}
</style>