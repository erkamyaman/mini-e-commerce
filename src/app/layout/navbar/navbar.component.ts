import { Component, inject, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppService } from '../../app.service';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [AvatarModule, ButtonModule, Menu, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService)
  currentUser = this.authService.getCurrentUser()
  items: MenuItem[] | undefined;

  constructor(public appService: AppService) { }

  ngOnInit() {
    this.items = [

      {
        label: `${this.currentUser?.role.toLocaleUpperCase()}`,
        icon: 'pi pi-user',
        disabled: true,
        style: { 'opacity': 1, 'font-weight': 600 }
      },
      {
        separator: true
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout()

      }

    ];
  }

  logout() {
    this.authService.logout()
  }


}
