<script>
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventApiService } from "../services/event-api.service.js";
import { Event } from "../model/event.entity.js";

export default {
  name: "event-calendar",
  data () {
    return {
      options: {
        plugins : [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',


      },
      events: null,
    }
  },

  created() {
    this.eventApiService = new EventApiService();

  },

  async mounted() {
    try {
      const response = await this.eventApiService.getAllEvents();
      const calendarEvents = response.data.map(event => new Event(event));
      this.events = calendarEvents.map(e => ({
        id: e.id,
        title: e.title,
        start: e.startDate,
        end: e.endDate
      }));
      console.log("Eventos cargados:", this.events);
    } catch (err) {
      console.error("Error al obtener eventos:", err);
    }
  }

}
</script>

<template>
  <div class="p-4 w-full h-full" >
    <pv-full-calendar class="max-w-1000px" :events="events" :options="options">
    </pv-full-calendar>
  </div>
</template>

<style scoped>


</style>