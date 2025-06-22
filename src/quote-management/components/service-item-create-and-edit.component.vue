<script>
import CreateAndEdit from "../../shared/components/create-and-edit.component.vue";
//import {v4 as uuidv4} from 'uuid';
import {Dialog as PvDialog} from "primevue";
import {ServiceItemService} from "../services/service-item.service.js";
import {ServiceItem} from "../model/service-item.entity.js";


export default {
  name: "service-item-create-and-edit-dialog",
  components: {PvDialog},
  emits:['create-new-service','change-visible'],
  props:{
    item: null,
    visible: false,
    //quoteOrderIdProp: String
  },
  data(){
    return{
      id:"",
      description:"",
      quantity:null,
      unitPrice:null,
      //quoteOrderId:this.quoteOrderIdProp
    }
  },
  computed:{
    totalPrice(){
      return this.quantity * this.unitPrice;
    }
  },
  methods:{
    onCreateNewService(){
      console.log('creating new service')
      this.$emit('create-new-service',
          {
            description: this.description,
            quantity:this.quantity,
            unitPrice:this.unitPrice,
            totalPrice:this.totalPrice})
      this.$emit('change-visible',false)
      this.clearForm();
    },
    onCancel(){
      this.$emit('change-visible',false);
      this.clearForm()
    },
    clearForm(){
      this.id = "";
      this.description = "";
      this.quantity = null;
      this.unitPrice = null;
    }

  }
}
</script>

<template>

  <pv-dialog v-bind:visible="visible" modal header="New Service">
    <div class="ml-4 mr-4">
      <form v-on:submit.prevent="onCreateNewService">
        <div class="flex flex-column form-group">
          <label class="text-sm" for="description">{{ $t('serviceItem.description') }}</label>
          <pv-input-group>
            <pv-input-group-addon>
              <i class="pi pi-pencil"></i>
            </pv-input-group-addon>
            <pv-input-text id="description" v-model="description" required></pv-input-text>
          </pv-input-group>
        </div>
        <div class="flex flex-column form-group">
          <label class="text-sm" for="quantity">{{ $t('serviceItem.quantity')}}</label>
          <pv-input-group>
            <pv-input-group-addon>
              <i class="pi pi-hashtag"></i>
            </pv-input-group-addon>
            <pv-input-number v-model="quantity" id="quantity" fluid required/>
          </pv-input-group>
        </div>
        <div class="flex flex-column form-group">
          <label class="text-sm" for="unitPrice">{{ $t('serviceItem.unitPrice') }}</label>
          <pv-input-group>
            <pv-input-group-addon>S/</pv-input-group-addon>
            <pv-input-number v-model="unitPrice" id="unitPrice" :min-fraction-digits="2" :max-fraction-digits="2" required></pv-input-number>
          </pv-input-group>
        </div>
        <div class="flex flex-column form-group">
          <label class="text-sm"  for="totalPrice">{{ $t('serviceItem.totalPrice') }}</label>
          <pv-input-group>
            <pv-input-group-addon>S/</pv-input-group-addon>
            <pv-input-number v-model="totalPrice" id="totalPrice" :min-fraction-digits="2" :max-fraction-digits="2"></pv-input-number>
          </pv-input-group>
        </div>
        <div class="mt-4 mb-2">
          <pv-button class="w-full" label="Add Service" type="submit"/>
          <pv-button class="w-full" label="Cancel" type="button" @click="onCancel"/>
        </div>
      </form>

    </div>
  </pv-dialog>



</template>

<style scoped>

</style>