<script>
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {Event} from "../model/event.entity.js";
import EventService from "../services/event.service.js";

export default {
  name: "event-calendar",
  components: {},
  data() {
    return {
      eventService: null,
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',
        events: [], // se llenará con fetchEvents()
        editable: false,
        selectable: true
      }
    }
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await EventService.getEvents();
        const calendarEvents = response.data.map(event => new Event(event));

        this.calendarOptions = {
          ...this.calendarOptions,
          events: calendarEvents.map(e => ({
            id: e.id,
            title: e.title,
            start: e.date,
            extendedProps: {
              customerName: e.customerName,
              location: e.location,
              status: e.status
            }
          }))
        };

        console.log(calendarEvents);
        console.log("Eventos cargados:", this.calendarOptions.events);
      } catch (err) {
        console.error("Error al obtener eventos:", err);
      }
    }
  },
  created() {
    this.fetchEvents();
  }
}
</script>

<template>
  <<template>
  <div class="p-4">
    <pv-full-calendar :options="calendarOptions" />
  </div>
</template>
</template>

<style scoped>


</style>