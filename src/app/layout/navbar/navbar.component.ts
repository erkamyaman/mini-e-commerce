import { Component, inject, OnInit } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { AppService } from '../../app.service';
import { AuthService } from '../../core/service/auth.service';
@Component({
  selector: 'app-navbar',
  imports: [AvatarModule, ButtonModule, RouterLink, RouterLinkActive, NgClass,],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService)
  constructor(public appService: AppService) { }

  ngOnInit() {

  }

  logout() {
    this.authService.logout()
  }


}
