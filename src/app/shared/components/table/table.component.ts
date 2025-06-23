import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/service/user.service';
import { ButtonModule } from 'primeng/button';
import { ShopService } from '../../../core/service/shop.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrdersService } from '../../../pages/orders/orders.service';
import { Status, StatusLabels } from '../../../core/types/status.enum';
import { AuthService } from '../../../core/service/auth.service';
import { User } from '../../../core/types/user.model';
import { DatePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-table',
  imports: [TableModule, DropdownModule, SplitButtonModule, FormsModule, ButtonModule, IconFieldModule, InputIconModule, DatePipe, InputTextModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  public userService = inject(UserService)
  public authService = inject(AuthService)
  public shopService = inject(ShopService)
  public confirmationService = inject(ConfirmationService)
  public orderService = inject(OrdersService)
  public messageService = inject(MessageService);


  @ViewChild('filter') filter!: ElementRef;

  @Input() cols: Array<{ field: string; header: string }> = [];
  @Input() data: any[] = [];
  @Input() isFromSales: boolean = false;

  shops: any[] = []
  statusLabels: any = StatusLabels;

  ngOnInit(): void {
    this.shopService.getShops().subscribe((res) => {
      this.shops = res as any[];
    })

    console.log(this.data)

    // if (this.isFromSales) {
    //   this.orderService.getAcceptedOrders().subscribe((res) => {
    //     this.data = res
    //   });
    // } else {
    //   this.orderService.getOrders().subscribe((res) => {
    //     this.data = res
    //   });
    // }



  }

  getFieldValue(row: any, field: string): any {
    return field.split('.').reduce((val, key) => val?.[key], row);
  }

  changeOrderStatus(id: string, status: Status, user: User) {
    this.orderService.changeOrderStatus(id, status, user).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product status changed to ${status} successfully` });
      },
      error: (err) => {
        console.error('Failed to change order status:', err);
      }
    });
  }

  confirmOperation(operationType: 'accept' | 'reject' | 'delete' | 'forward', status: Status, row: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to ${operationType} this order${operationType === "forward" ? " to the Sales" : ""}?`,
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
    this.orderService.addShopToOrderById(row.id, row.shopId).subscribe();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
}
