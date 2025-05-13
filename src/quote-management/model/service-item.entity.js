import { v4 as uuidv4 } from 'uuid';

export class ServiceItem{
    constructor({ id= '', description ='', quantity = 0, unitPrice=0, totalPrice = 0, quoteOrderId = ''}){
        this.id=id?id:uuidv4();
        this.description = description;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice?totalPrice : this.unitPrice * this.quantity;
        this.quoteOrderId = quoteOrderId;
    }
}