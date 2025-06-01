import { Component, inject, Input, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/service/user.service';
import { ButtonModule } from 'primeng/button';
import { ShopService } from '../../../core/service/shop.service';

@Component({
  selector: 'app-table',
  imports: [TableModule, DropdownModule, SplitButtonModule, FormsModule, ButtonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  public userService = inject(UserService)
  public shopService = inject(ShopService)

  @Input() cols: Array<{ field: string; header: string }> = [];
  @Input() data: any[] = [];

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

  onShopChange(row: any) {
    console.log('Shop changed for row:', row);
    console.log('New shop:', row.selectedShop);
  }
}
