//import {v4 as uuidv4} from 'uuid';

export class Quote{
    constructor({id='',title='',eventType='',status = '', guestQuantity=0, totalPrice = 0,eventDate = new Date(), location = '', organizerId = '', hostId=''}){
        this.id = id;
        this.title=title;
        this.eventType = eventType;
        this.guestQuantity = guestQuantity;
        this.location = location;
        this.totalPrice = totalPrice;
        this.status = status;
        this.eventDate = eventDate;
        this.organizerId = organizerId;
        this.hostId = hostId;
    }
}