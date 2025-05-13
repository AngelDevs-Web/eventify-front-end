import {v4 as uuidv4} from 'uuid';

export class Quote{
    constructor({id='',title='',eventType='',state = '', guestQuantity=0, totalPrice = 0,eventDate = null, location = ''}){
        this.id = id?id:uuidv4();
        this.title=title;
        this.eventType = eventType;
        this.guestQuantity = guestQuantity;
        this.location = location;
        this.totalPrice = totalPrice;
        this.state = state;
        this.eventDate = eventDate;
    }
}