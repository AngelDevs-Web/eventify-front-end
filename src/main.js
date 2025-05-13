import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from "./i18n/index.js";
import router from './router/index.js'
import PrimeVue from 'primevue/config';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import Material from '@primeuix/themes/material';
import {
    Avatar,
    Button,
    Column,
    ConfirmationService, ConfirmDialog,
    DataTable, DatePicker,
    Dialog,
    DialogService, Divider, InputGroup, InputGroupAddon, InputNumber, InputText, Select, SelectButton,
    Toast,
    ToastService,
    Toolbar
} from "primevue";

const app = createApp(App)

app.use(PrimeVue,{theme:{preset:Material},ripple:true})
    .use(ConfirmationService)
    .use(DialogService)
    .use(ToastService)
    .use(i18n)
    .use(router)
    .component('pv-dialog',Dialog)
    .component('pv-button',Button)
    .component('pv-data-table',DataTable)
    .component('pv-column',Column)
    .component('pv-toolbar',Toolbar)
    .component('pv-toast',Toast)
    .component('pv-confirm-dialog',ConfirmDialog)
    .component('pv-select-button',SelectButton)
    .component('pv-avatar',Avatar)
    .component('pv-input-group',InputGroup)
    .component('pv-input-group-addon',InputGroupAddon)
    .component('pv-input-text',InputText)
    .component('pv-input-number',InputNumber)
    .component('pv-date-picker',DatePicker)
    .component('pv-select',Select)
    .component('pv-divider',Divider)
    .mount('#app')



