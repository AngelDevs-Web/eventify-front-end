<script>
import CreateAndEdit from "../../shared/components/create-and-edit.component.vue";
import {v4 as uuidv4} from 'uuid'
import ServiceItemCreateAndEditDialog from "./service-item-create-and-edit.component.vue";
import {ServiceItem} from "../model/service-item.entity.js";
import {ServiceItemService} from "../services/service-item.service.js";
import {QuoteOrderService} from "../services/quote-order.service.js";
import {Quote} from "../model/quote-order.entity.js";
import {Dialog as PvDialog} from "primevue";


export default {
  name: "quote-order-create-and-edit-dialog",
  components: {PvDialog, ServiceItemCreateAndEditDialog, CreateAndEdit},
  props:{
    item:null,
    serviceList:Array,
    isEdit:false,
    visible:false
  },
  emits:['cancel-requested','save-requested','change-visible','quote-order-created','quote-order-updated'],
  data(){
    return{
      id:uuidv4(),
      title:'',
      eventType:'',
      eventDate: null,
      guestQuantity: 0,
      state:'Pending',
      location:'',
      eventTypeOptions:['Wedding','Conference','Quinceanera','Graduation'],


      submitted:false,
      serviceDialogVisible:false,
      serviceItems:[],
      deletedServices:[],


      quoteOrderService: new QuoteOrderService()
    }
  },
  methods:{
    onCancelRequested(){
      this.$emit("cancel-requested");
    },

    onSaveRequested(){
      this.submitted=true;
      this.$emit("save-requested",this.item);
    },
    onCreateNewService(service){
      const servItem = new ServiceItem(service);
      servItem.unitPrice = parseFloat(service.unitPrice.toFixed(2));
      servItem.totalPrice = parseFloat(service.totalPrice.toFixed(2));
      servItem.quoteOrderId = this.id;
      this.serviceItems.push(servItem);
    },

    onCreateQuoteOrder(){
      let serviceItemService= new ServiceItemService();
      console.log(this.eventDate);
      this.eventDate = this.eventDate.toISOString().split("T")[0]
      console.log(this.eventDate)


      let item = {id: this.id, title: this.title, eventType: this.eventType,
        eventDate: this.eventDate,guestQuantity: this.guestQuantity, location:this.location,
        totalPrice: this.getTotalPrice(), state: this.state
      };
      let quoteOrder = new Quote({...item})

      if(this.isEdit){
        this.quoteOrderService.update(quoteOrder.id, quoteOrder);
        this.$emit('quote-order-updated',quoteOrder);
        if(this.deletedServices.length > 0){
          this.deletedServices.forEach(serviceId => {
            serviceItemService.delete(serviceId).then(()=>{
              console.log('Service deleted successfully');
            }).catch(err=>{console.log(err);});

          })
          this.deletedServices = [];
        }
      }else{
        console.log('Creating a new Quote order');
        this.quoteOrderService.create(quoteOrder);
        this.serviceItems.forEach(serviceItem => {
          serviceItemService.create(serviceItem)
        })
        this.$emit('quote-order-created',quoteOrder);
      }



      this.$emit('change-visible',false);
      this.clearForm();
    },

    onCancel(){
      this.$emit('change-visible',false);
      this.clearForm();
    },

    clearForm(){
      this.id = uuidv4();
      this.title = "";
      this.eventType = "";
      this.eventDate = null;
      this.guestQuantity = 0;
      this.location = "";
      this.serviceItems = [];
    },

    deleteServiceItem(id){
      this.serviceItems = this.serviceItems.filter(item => item.id !== id);
      this.deletedServices.push(id)
    },
    getFormatPrice(price){
      return `S/ ${price.toFixed(2)}`;
    },

    getTotalPrice(){
      let total = this.serviceItems.map(item => item.totalPrice).reduce((total,item)=> total+item,0)
      return parseFloat(total.toFixed(2));
    },
    getIGV(){
      return parseFloat(this.getTotalPrice() * 0.18).toFixed(2);
    },
    getSubTotal(){
      return parseFloat(this.getTotalPrice()-this.getIGV()).toFixed(2);
    },
    getSubmitLabel() {
      return `${this.isEdit ? 'Update' : 'Create'} Quote`;
    },
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        if (this.isEdit) {
          // Si es edición, carga los datos del item
          this.id = this.item.id;
          this.title = this.item.title;
          this.eventType = this.item.eventType;
          this.guestQuantity = this.item.guestQuantity;
          this.location = this.item.location;

          const [year, month, day] = this.item.eventDate.split('-');
          this.eventDate = new Date(year, month - 1, day);

          let serviceItemService = new ServiceItemService();
          serviceItemService.getByQuoteOrderId(this.id).then((response) => {
            const newServiceItems = response.data.map(service => new ServiceItem({...service}));
            this.serviceItems = [...newServiceItems];
          });
        } else {
          // Si no es edición, limpia el formulario
          this.clearForm();
        }
      }
    }
  }

}
</script>

<template>

  <pv-dialog v-bind:visible="visible" modal>

    <div class="flex flex-column p-4 quote-container">

      <div class="text-xl text-left font-bold">
        <p>Main Information</p>
      </div>

      <div>
        <div class="flex flex-column form-group">
          <label for="id">Id</label>
          <pv-input-group>
            <pv-input-group-addon><i class="pi pi-bookmark"></i></pv-input-group-addon>
            <pv-input-text id="id" v-model="id" required></pv-input-text>
          </pv-input-group>
        </div>
        <div class="flex flex-column form-group">
          <label for="title">Title</label>
          <pv-input-group>
            <pv-input-group-addon><i class="pi pi-bookmark"></i></pv-input-group-addon>
            <pv-input-text id="title" v-model="title" required></pv-input-text>
          </pv-input-group>
        </div>
        <div class="flex form-group justify-content-between" >
          <div class="w-24rem flex flex-column align-content-start">
            <label for="eventType">Event Type</label>
            <pv-input-group>
              <pv-input-group-addon><i class="pi pi-headphones"></i></pv-input-group-addon>
              <pv-select id="eventType" v-model="eventType" :options="eventTypeOptions" required></pv-select>
            </pv-input-group>
          </div>
          <div class="w-24rem flex flex-column align-content-start">
            <label>Event Date</label>
            <pv-input-group>
              <pv-input-group-addon><i class="pi pi-calendar"></i></pv-input-group-addon>
              <pv-date-picker v-model="eventDate" date-format="dd/mm/yy" fluid required/>
            </pv-input-group>
          </div>
        </div>
        <div class="flex form-group justify-content-between">
          <div class="w-24rem flex flex-column align-content-start">
            <label for="guestQuantity">Guests Number</label>
            <pv-input-group>
              <pv-input-group-addon><i class="pi pi-user"></i></pv-input-group-addon>
              <pv-input-number v-model="guestQuantity" id="guestQuantity" required></pv-input-number>
            </pv-input-group>
          </div>
          <div class="w-24rem flex flex-column align-content-start">
            <label for="location">Location</label>
            <pv-input-group>
              <pv-input-group-addon><i class="pi pi-map-marker"></i></pv-input-group-addon>
              <pv-input-text id="location" v-model="location" required></pv-input-text>
            </pv-input-group>
          </div>
        </div>
        <div class="mt-4">
          <pv-button :label="getSubmitLabel()" class="mr-2" style="background-color: #3A506B; border:none" type="button" @click="onCreateQuoteOrder"/>
          <pv-button style="background-color: #3A506B; border:none" type="button" @click="onCancel">Cancel</pv-button>
        </div>

      </div>

      <pv-divider/>

      <div class="flex flex-column align-content-start">

        <div class="text-xl text-left font-bold">
          <p>Included Services</p>
        </div>
        <pv-data-table :value="serviceItems" table-style="min-width:50rem">
          <pv-column field="id" header="ID"></pv-column>
          <pv-column field="quoteOrderId" header="Quote ID"></pv-column>
          <pv-column field="description" header="Description"></pv-column>
          <pv-column field="quantity" header="Quantity"></pv-column>
          <pv-column field="unitPrice" header="Price">
            <template #body="slotProps">{{getFormatPrice(slotProps.data.unitPrice)}}</template>
          </pv-column>
          <pv-column field="totalPrice" header="Total Price">
            <template #body="slotProps">{{getFormatPrice(slotProps.data.totalPrice)}}</template>
          </pv-column>
          <pv-column field="actions" header="Actions">
            <template #body="slotProps">
              <pv-button type="button" @click="deleteServiceItem(slotProps.data.id)" class="bg-red-500"><i class="pi pi-trash"></i></pv-button>
            </template>
          </pv-column>
        </pv-data-table>
      </div>

      <div class="flex">


        <div class="w-3">

          <pv-button class="w-full mt-4" label="Add New Service" @click="serviceDialogVisible=true"><i class="pi pi-plus-circle"></i> Add New Service</pv-button>
          <service-item-create-and-edit-dialog v-on:create-new-service="onCreateNewService" :visible="serviceDialogVisible" :quote-order-id-prop="id" @change-visible="serviceDialogVisible=$event"></service-item-create-and-edit-dialog>

        </div>


        <div class="w-5"></div>
        <div class="flex flex-column w-4 ">
          <div class="total-price-info flex justify-content-between">
            <p><b>Subtotal:</b></p>
            <p>S/ {{ this.getSubTotal()}}</p>
          </div>
          <div class="total-price-info flex justify-content-between">
            <p><b>IGV (18%):</b></p>
            <p>S/ {{this.getIGV()}}</p>
          </div>
          <pv-divider/>
          <div class="total-price-info flex justify-content-between text-lg">
            <p><b>TOTAL: </b></p>
            <p><b>S/ {{parseFloat(this.getTotalPrice()).toFixed(2)}}</b></p>
          </div>
        </div>
      </div>
    </div>
  </pv-dialog>

</template>

<style scoped>

</style>