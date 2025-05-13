<script>
import {QuoteOrderService} from "../services/quote-order.service.js";
import {Quote} from "../model/quote-order.entity.js";
import QuoteOrderCreateAndEditDialog from "../components/quote-order-create-and-edit.component.vue";

export default {
  name: "quote-order-management",
  components: {QuoteOrderCreateAndEditDialog},
  emits:['quote-order-created'],
  data(){
    return{
      quoteOrderService: null,
      quoteOrderList:[],
      quoteOrderSelected:null,
      isQuoteCreateFormVisible:false
    }
  },
  methods:{
    onQuoteOrderCreated(quoteOrder){
      this.quoteOrderList.push(quoteOrder);
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
        <pv-button style="background-color: #3A506B" type="button" @click="isQuoteCreateFormVisible= true"><i class="pi pi-plus-circle"></i> New Quote</pv-button>
      </div>
    </div>

    <quote-order-create-and-edit-dialog :visible="isQuoteCreateFormVisible" @change-visible="isQuoteCreateFormVisible=$event" @quote-order-created="onQuoteOrderCreated"></quote-order-create-and-edit-dialog>

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
            <pv-button type="button" class="bg-blue-500 mr-2"><i class="pi pi-pencil"></i></pv-button>
            <pv-button type="button" class="bg-red-500" ><i class="pi pi-trash"></i></pv-button>
          </div>

        </template>
      </pv-column>
    </pv-data-table>
  </div>
</template>

<style scoped>

</style>