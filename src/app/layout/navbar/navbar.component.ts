import { Component } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [Toolbar, AvatarModule, ButtonModule, RouterLink],
  templateUrl: './navbar.component.html'
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
