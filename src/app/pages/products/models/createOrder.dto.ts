import { Product } from "../../../core/types/product.model";
import { Status } from "../../../core/types/status.enum";

export class OrderPayload {
    productId!: string;
    productName!: string;
    quantity!: number;
    userId!: string;
    date!: Date;
    address!: string;
    status!: Status;
    totalAmount!: number;
    shopId: number;

    constructor(product: Product, form: any, userId: string) {
        this.productId = product.id;
        this.productName = product.name;
        this.quantity = form.quantity;
        this.userId = userId;
        this.date = new Date();
        this.address = form.address;
        this.status = Status.Waiting;
        this.totalAmount = form.quantity * product.price;
        this.shopId = 0
    }
};