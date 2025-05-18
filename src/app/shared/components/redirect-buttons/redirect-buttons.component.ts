import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-redirect-buttons',
  imports: [RouterLink, ButtonModule],
  templateUrl: './redirect-buttons.component.html',
  styleUrl: './redirect-buttons.component.css'
})
export class RedirectButtonsComponent {
  authService = inject(AuthService)
  userRole = this.authService.getCurrentUserRole()

}
