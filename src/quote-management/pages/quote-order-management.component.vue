<script>
import {QuoteOrderService} from "../services/quote-order.service.js";
import {Quote} from "../model/quote-order.entity.js";
import QuoteOrderCreateAndEditDialog from "../components/quote-order-create-and-edit.component.vue";
import {ServiceItemService} from "../services/service-item.service.js";
import {ServiceItem} from "../model/service-item.entity.js";

export default {
  name: "quote-order-management",
  components: {QuoteOrderCreateAndEditDialog},
  emits:['quote-order-created','update-quote-order'],
  data(){
    return{
      quoteOrderService: null,
      quoteOrderList:[],
      quoteOrderSelected:null,
      isQuoteCreateFormVisible:false,
      serviceItemsForQuoteOrderSelected:[],
      isEdit:false
    }
  },
  methods:{
    onQuoteOrderCreated(quoteOrder){
      this.quoteOrderList.push(quoteOrder);
    },

    onQuoteOrderUpdated(quoteOrder){
      let index = this.quoteOrderList.findIndex(quote => quote.id === quoteOrder.id);
      this.quoteOrderList[index] = quoteOrder;
    },

    async updateQuoteOrder(id){
      this.quoteOrderSelected = this.quoteOrderList.find(quoteOrder => quoteOrder.id === id);
      this.isEdit = true;
      this.isQuoteCreateFormVisible = true;
      // Crear una instancia del servicio
      let serviceItemService = new ServiceItemService();

      // Obtener los serviceItems asociados al quoteOrder
      const response = await serviceItemService.getByQuoteOrderId(id);
      this.serviceItemsForQuoteOrderSelected = response.data.map(serviceItem => new ServiceItem(serviceItem));

      console.log(this.serviceItemsForQuoteOrderSelected);
    },
    deleteQuoteOrder(id){
      let serviceItemService = new ServiceItemService();
      this.quoteOrderService = new QuoteOrderService();

      // Obtener y eliminar los serviceItems asociados
      serviceItemService.getByQuoteOrderId(id).then((response) => {
        const serviceItems = response.data.map(serviceItem => new ServiceItem(serviceItem));
        // Eliminar cada serviceItem
        const deletePromises = serviceItems.map(serviceItem => serviceItemService.delete(serviceItem.id));
      });
      this.quoteOrderService.delete(id)
      this.quoteOrderList = this.quoteOrderList.filter(quote => quote.id !== id)
    }
  },
  created(){
    this.quoteOrderService = new QuoteOrderService();
    this.quoteOrderService.getAll().then((response)=>{
      this.quoteOrderList=response.data.map(quote => new Quote(quote));
      console.log(this.quoteOrderList);
    }).catch((error)=>{console.log(error)})
  }
}
</script>

<template>

  <div class="flex flex-column p-4" style="background-color: #F5F7FA; color:#000">
    <p class="text-3xl font-bold text-left mb-4 mt-0">Quotes</p>
    <div class="flex mb-4">
      <div class="flex justify-content-between w-8">
        <pv-input-group class="w-5">
          <pv-input-group-addon><i class="pi pi-search"></i></pv-input-group-addon>
          <pv-input-text  id="searchQuotes" placeholder="Search Quotes"></pv-input-text>
        </pv-input-group>
        <pv-select class="w-3" placeholder="Todos"></pv-select>
        <pv-select class="w-3" placeholder="Recientes"></pv-select>
      </div>
      <div class="flex justify-content-end w-4">
        <pv-button style="background-color: #3A506B" type="button" @click="isQuoteCreateFormVisible= true; isEdit=false"><i class="pi pi-plus-circle"></i> New Quote</pv-button>
      </div>
    </div>

    <quote-order-create-and-edit-dialog :item="quoteOrderSelected"  :service-list="serviceItemsForQuoteOrderSelected" :is-edit="isEdit" :visible="isQuoteCreateFormVisible" @change-visible="isQuoteCreateFormVisible=$event" @quote-order-created="onQuoteOrderCreated" @quote-order-updated="onQuoteOrderUpdated"></quote-order-create-and-edit-dialog>

    <pv-data-table :value="quoteOrderList" table-style="min-width:50rem">
      <pv-column field="id" header="Id"></pv-column>
      <pv-column field="title" header="Title"></pv-column>
      <pv-column field="eventType" header="Event Type"></pv-column>
      <pv-column field="eventDate" header="Date"></pv-column>
      <pv-column field="totalPrice" header="Total Price">
        <template #body="slotProps">S/ {{slotProps.data.totalPrice}}</template>
      </pv-column>
      <pv-column field="state" header="State">
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