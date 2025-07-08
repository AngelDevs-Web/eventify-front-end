<script>
import {QuoteOrderService} from "../services/quote-order.service.js";
import {Quote} from "../model/quote-order.entity.js";
import QuoteOrderCreateAndEditDialog from "../components/quote-order-create-and-edit.component.vue";
import {ServiceItemService} from "../services/service-item.service.js";
import {ServiceItem} from "../model/service-item.entity.js";
import {Column as PvColumn} from "primevue";
import {FilterMatchMode} from "@primevue/core/api";

export default {
  name: "quote-order-management",
  components: {PvColumn, QuoteOrderCreateAndEditDialog},
  emits:['quote-order-created','update-quote-order'],
  data(){
    return{
      quoteOrderService: null,
      quoteOrderList:[],
      quoteOrderSelected:null,
      //data to show and hide create quote dialog
      createQuoteVisible:false,
      serviceItemsForQuoteOrderSelected:[],
      isEdit:false,
      filters:{
        title:{value:null, matchMode:FilterMatchMode.STARTS_WITH},
        status:{value:null, matchMode:FilterMatchMode.EQUALS},
        eventDate:{value:null, matchMode:FilterMatchMode.DATE_AFTER},
      },
      statusFilter:['Pending', 'Accepted','Rejected'],
      organizerId:1
    }
  },
  methods:{

    clearFilters(){
      this.filters.title.value = null;
      this.filters.eventDate.value = null;
      this.filters.status.value = null;
    },

    getSeverity(status){
      if(status === 'Pending') return 'warn';
      if(status === 'Approved') return 'success';
      if(status === 'Rejected') return 'danger';
    },

    onCloseCreateQuoteDialog(){
      this.createQuoteVisible = false;
    },

    onQuoteOrderCreated(quoteOrder){
      quoteOrder.eventDate = quoteOrder.eventDate.toISOString();
      this.quoteOrderList.push(quoteOrder);
    },

    onQuoteOrderUpdated(quoteOrder){
      let index = this.quoteOrderList.findIndex(quote => quote.id === quoteOrder.id);
      this.quoteOrderList[index] = quoteOrder;
    },

    async updateQuoteOrder(id){
      this.quoteOrderSelected = this.quoteOrderList.find(quoteOrder => quoteOrder.id === id);
      this.isEdit = true;
      this.createQuoteVisible = true;
      // Crear una instancia del servicio
      let serviceItemService = new ServiceItemService();

      // Obtener los serviceItems asociados al quoteOrder
      const response = await serviceItemService.getByQuoteOrderId(id);
      this.serviceItemsForQuoteOrderSelected = response.data.map(serviceItem => new ServiceItem(serviceItem));

      //console.log(this.serviceItemsForQuoteOrderSelected);
    },
    deleteQuoteOrder(id){
      let serviceItemService = new ServiceItemService();
      this.quoteOrderService = new QuoteOrderService();

      // Obtener y eliminar los serviceItems asociados
      serviceItemService.getByQuoteOrderId(id).then((response) => {
        const serviceItems = response.data.map(serviceItem => new ServiceItem(serviceItem));
        const deletePromises = serviceItems.map(serviceItem => serviceItemService.delete(id, serviceItem.id));
        // Eliminar cada serviceItem
        Promise.all(deletePromises).then(() => {
          this.quoteOrderService.delete(id).then(()=>{
            this.quoteOrderList = this.quoteOrderList.filter(quote => quote.id !== id);
          }).catch((error) => {
            console.error("Error eliminando el quoteOrder:", error);
          });
        }).catch((error) => {
          console.error("Error eliminando los serviceItems:", error);
      });
    }).catch((error) => {
        console.error("Error eliminando los serviceItems:", error);
      })
    },

    formatDate(date){
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
    }
  },
  created(){
    this.quoteOrderService = new QuoteOrderService();

    this.quoteOrderService.getAll(this.organizerId).then((response)=>{
      this.quoteOrderList=response.data.map(quote => new Quote(quote));
      console.log(this.quoteOrderList);
    }).catch((error)=>{console.log(error)})

    console.log(this.quoteOrderList);
  }
}
</script>

<template>
  <p class="text-3xl font-bold pl-5 pb-5 pt-5">{{$t('quoteOrder.quotes')}}</p>
  <div class="flex pl-5 pr-5 justify-content-between h-3rem">
    <div class="flex justify-content-between items-center w-5">
      <pv-input-group class="w-6">
        <pv-input-group-addon> <i class="pi pi-search"></i></pv-input-group-addon>
        <pv-input-text v-model="filters.title.value" placeholder="Search quote..."/>
      </pv-input-group>

      <pv-input-group class="w-4">
        <pv-input-group-addon><i class="pi pi-tag"></i></pv-input-group-addon>
        <pv-select v-model="filters.status.value" :options="statusFilter" placeholder="Status" :show-clear="true">
          <template #option="slotProps">
            <pv-tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
          </template>
        </pv-select>
      </pv-input-group>

      <pv-button class="w-3rem" severity="danger"  type="button" @click="clearFilters"><i class="pi pi-trash"></i></pv-button>
    </div>

    <div class="flex w-5 justify-content-end">
      <pv-button style="background-color: #3A506B" type="button" @click="createQuoteVisible = true; isEdit=false"><i class="pi pi-plus-circle"></i> {{$t('quoteOrder.newQuote')}}</pv-button>
    </div>

  </div>
  <quote-order-create-and-edit-dialog :organizer-id="organizerId" :item="quoteOrderSelected"  :service-list="serviceItemsForQuoteOrderSelected" :is-edit="isEdit" :visible="createQuoteVisible" @close-dialog="onCloseCreateQuoteDialog" @quote-order-created="onQuoteOrderCreated" @quote-order-updated="onQuoteOrderUpdated"></quote-order-create-and-edit-dialog>

    <div>
      <pv-data-table paginator :value="quoteOrderList" :rows="5" class="pl-5 pr-5 mt-5" :filters="filters">
        <pv-column field="title" header="Title"></pv-column>
        <pv-column field="eventType" header="Event Type"></pv-column>
        <pv-column field="eventDate" header="Date">
          <template #body="slotProps">{{formatDate(new Date(slotProps.data.eventDate))}}</template>
        </pv-column>
        <pv-column field="location" header="Location"></pv-column>
        <pv-column field="totalPrice" header="Total Price">
          <template #body="slotProps">S/ {{slotProps.data.totalPrice}}</template>
        </pv-column>
        <pv-column field="status" header="Status">
          <template #body="slotProps">
            <pv-tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)"></pv-tag>
          </template>
        </pv-column>
        <pv-column field="actions" header="Actions">
          <template #body="slotProps">
            <div class="flex">
              <pv-button type="button" class="bg-blue-500 mr-2" @click="updateQuoteOrder(slotProps.data.id) "><i class="pi pi-pencil"></i></pv-button>
              <pv-button type="button" class="bg-red-500" ><i class="pi pi-trash" @click="deleteQuoteOrder(slotProps.data.id)"></i></pv-button>
            </div>

          </template>
        </pv-column>
      </pv-data-table>
    </div>

</template>

<style scoped>

</style>