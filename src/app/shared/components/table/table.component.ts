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
import { Status, StatusLabels } from '../../../core/types/status.enum';
import { AuthService } from '../../../core/service/auth.service';
import { User } from '../../../core/types/user.model';

@Component({
  selector: 'app-table',
  imports: [TableModule, DropdownModule, SplitButtonModule, FormsModule, ButtonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  public userService = inject(UserService)
  public authService = inject(AuthService)
  public shopService = inject(ShopService)
  public confirmationService = inject(ConfirmationService)
  public orderService = inject(OrdersService)

  @Input() cols: Array<{ field: string; header: string }> = [];
  @Input() data: any[] = [];
  current: any;
  shops: any[] = []
  statusLabels: any = StatusLabels;

  ngOnInit(): void {
    console.log(this.data)
    this.data.forEach(element => {
      this.userService.getUserById(element.userId).subscribe(user => {
        element.customerName = user.name;
      });
    });

    this.shopService.getShops().subscribe((res) => {
      this.shops = res as any[];
    })
  }

  getFieldValue(row: any, field: string): any {
    return field.split('.').reduce((val, key) => val?.[key], row);
  }

  changeOrderStatus(id: string, status: string, user: User) {
    this.orderService.changeOrderStatus(id, status, user).subscribe(() => {
      console.log(`Order ${id} status changed to ${status}`);
    });
  }

  confirmOperation(operationType: 'accept' | 'reject' | 'delete', status: string, row: any) {
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
    console.log(status)
    this.confirmationService.confirm({
      message: `Are you sure you want to ${operationType} this order?`,
      header: `Confirm ${operationType.charAt(0).toUpperCase() + operationType.slice(1)}`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptButtonStyleClass: operationType !== 'accept' ? 'p-button-danger' : 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          this.changeOrderStatus(row.id, status, currentUser);
        } else {
          console.error('No current user found.');
        }
      }
    });
  }

  onShopChange(row: any) {
    this.orderService.addShopToOrderById(row.id, row.shopId).subscribe(() => {
      console.log(this.orderService.orders.getValue())
    });
  }
}
