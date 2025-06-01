import { Component, inject, Input, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/service/user.service';
import { ButtonModule } from 'primeng/button';
import { ShopService } from '../../../core/service/shop.service';
import { ConfirmationService } from 'primeng/api';
import { OrdersService } from '../../../pages/orders/orders.service';

@Component({
  selector: 'app-table',
  imports: [TableModule, DropdownModule, SplitButtonModule, FormsModule, ButtonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  public userService = inject(UserService)
  public shopService = inject(ShopService)
  public confirmationService = inject(ConfirmationService)
  public orderService = inject(OrdersService)

  @Input() cols: Array<{ field: string; header: string }> = [];
  @Input() data: any[] = [];
  current: any;
  shops: any[] = []

  ngOnInit(): void {
    this.data.forEach(element => {
      this.userService.getUserById(element.userId).subscribe(user => {
        element.customerName = user.name;
      });
    });

    this.shopService.getShops().subscribe((res) => {
      this.shops = res as any[];
    })

    console.log(this.orderService.orders.getValue())

  }

  getFieldValue(row: any, field: string): any {
    return field.split('.').reduce((val, key) => val?.[key], row);
  }

  acceptOrder(row: any) {
    console.log('Edit clicked for:', row);
  }

  rejectOrder(row: any) {
    console.log('Reject clicked for:', row);
  }

  deleteOrder(row: any) {
    console.log('Delete clicked for:', row);
  }

  changeOrderStatus(row: any, status: string) {
    this.orderService.changeOrderStatus(row.id, status).subscribe(() => {
      console.log(`Order ${row.id} status changed to ${status}`);
    });
  }



  confirmOperation(operationType: string, row: any) {
    // let operationFunction: () => void;

    // switch (operationType) {
    //   case 'accept':
    //     operationFunction = () => this.acceptOrder(row);
    //     break;
    //   case 'reject':
    //     operationFunction = () => this.rejectOrder(row);
    //     break;
    //   case 'delete':
    //     operationFunction = () => this.deleteOrder(row);
    //     break;
    //   default:
    //     operationFunction = () => { };
    //     break;
    // }
    this.confirmationService.confirm({
      message: `Are you sure you want to ${operationType} this order?`,
      header: `Confirm ${operationType.charAt(0).toUpperCase() + operationType.slice(1)}`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptButtonStyleClass: operationType !== 'accept' ? 'p-button-danger' : 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.orderService.changeOrderStatus(row.id, operationType).subscribe(() => {
          console.log(`Order ${row.id} status changed to ${status}`);
        });
      }
    });
  }

  onShopChange(row: any) {
    this.orderService.addShopToOrderById(row.id, row.shopId).subscribe(() => {
      console.log(this.orderService.orders.getValue())
    });
  }
}
