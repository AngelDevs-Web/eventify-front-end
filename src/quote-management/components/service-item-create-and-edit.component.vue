<script>
import CreateAndEdit from "../../shared/components/create-and-edit.component.vue";
import {v4 as uuidv4} from 'uuid';
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
    quoteOrderIdProp: String
  },
  data(){
    return{
      id: uuidv4(),
      description:"",
      quantity:null,
      unitPrice:null,
      quoteOrderId:this.quoteOrderIdProp,
      serviceItemService: new ServiceItemService()
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
          {id: this.id,
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
      this.id = uuidv4();
      this.description = "";
      this.quantity = null;
      this.unitPrice = null;
    }

  },
  /*components: {CreateAndEdit},
  props:{
    item: null,
    visible: false
  },
  emits:['cancel-requested','save-requested'],
  data(){
    return{
      submitted:false
    }
  },
  methods:{
    onCancelRequested(){
      this.$emit("cancel-requested");
    },

    onSaveRequested(){
      this.submitted = true;
      this.$emit("save-requested",this.item);
    }
  },
  computed:{
    totalPrice(){
      return this.item.unitPrice * this.item.quantity;
    }
  }*/
}
</script>

<template>

  <pv-dialog v-bind:visible="visible" modal header="New Service">
    <div class="ml-4 mr-4">
      <form v-on:submit.prevent="onCreateNewService">
        <div class="flex flex-column form-group">
          <label class="text-sm" for="description">Id</label>
          <pv-input-group>
            <pv-input-group-addon>
              <i class="pi pi-pencil"></i>
            </pv-input-group-addon>
            <pv-input-text id="description" v-model="id" readonly></pv-input-text>
          </pv-input-group>
        </div>
        <div class="flex flex-column form-group">
          <label class="text-sm" for="description">{{ $t('serviceItem.quoteOrder') }}</label>
          <pv-input-group>
            <pv-input-group-addon>
              <i class="pi pi-pencil"></i>
            </pv-input-group-addon>
            <pv-input-text id="description" v-model="quoteOrderId" readonly></pv-input-text>
          </pv-input-group>
        </div>
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



  <!--
  <create-and-edit :entity="item" :visible="visible" :entity-name="Service" @cancel-action-requested = "onCancelRequested" @save-action-requested="onSaveRequested">
    <template #content>
      <div class="flex flex-column form-group">
        <label class="text-sm" for="description">Description</label>
        <pv-input-group>
          <pv-input-group-addon>
            <i class="pi pi-pencil"></i>
          </pv-input-group-addon>
          <pv-input-text id="description" v-model="description" required></pv-input-text>
        </pv-input-group>
      </div>

      <div class="flex flex-column form-group">
        <label class="text-sm" for="quantity">Quantity</label>
        <pv-input-group>
          <pv-input-group-addon>
            <i class="pi pi-hashtag"></i>
          </pv-input-group-addon>
          <pv-input-number v-model="quantity" id="quantity" fluid required/>
        </pv-input-group>
      </div>
      <div class="flex flex-column form-group">
        <label class="text-sm" for="unitPrice">Unit Price</label>
        <pv-input-group>
          <pv-input-group-addon>S/</pv-input-group-addon>
          <pv-input-number v-model="unitPrice" id="unitPrice" min-fraction-digits="2" max-fraction-digits="2" required></pv-input-number>
        </pv-input-group>
      </div>
      <div class="flex flex-column form-group">
        <label class="text-sm"  for="totalPrice">Total Price</label>
        <pv-input-group>
          <pv-input-group-addon>S/</pv-input-group-addon>
          <pv-input-number v-model="totalPrice" id="totalPrice" min-fraction-digits="2" max-fraction-digits="2" readonly></pv-input-number>
        </pv-input-group>
      </div>
    </template>
  </create-and-edit>-->

</template>

<style scoped>

</style>