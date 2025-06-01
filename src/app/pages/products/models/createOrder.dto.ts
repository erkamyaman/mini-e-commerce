import { Product } from "../../../core/types/product.model";
import { Status } from "../../../core/types/status.enum";

export class OrderPayload {
    orderId!: string;
    productId!: string;
    productName!: string;
    quantity!: number;
    addedBy: any;
    date!: string;
    address!: string;
    status!: Status;
    totalAmount!: number;
    shop!: string;

    constructor(product: Product, form: any, user: any) {
        this.orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        this.productId = product.id;
        this.productName = product.name;
        this.quantity = form.quantity;
        this.addedBy = user;
        this.date = new Date().toISOString();
        this.address = form.address;
        this.status = Status.Waiting;
        this.totalAmount = form.quantity * product.price;
        this.shop = ''
    }
};



// user type add
// user service add