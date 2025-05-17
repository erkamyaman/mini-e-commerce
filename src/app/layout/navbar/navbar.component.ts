import { Component, OnInit } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { AppService } from '../../app.service';
@Component({
  selector: 'app-navbar',
  imports: [AvatarModule, ButtonModule, RouterLink, RouterLinkActive, NgClass,],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  activePage: string = '';

  constructor(public appService: AppService) { }
  // 
  ngOnInit() {
    this.appService.currentRoute$.subscribe(route => {
      this.activePage = route;
      // router link active directive check
    });
  }



}
