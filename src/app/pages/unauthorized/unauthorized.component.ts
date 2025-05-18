import { Component } from '@angular/core';
import { RedirectButtonsComponent } from '../../shared/components/redirect-buttons/redirect-buttons.component';

@Component({
  selector: 'app-unauthorized',
  imports: [RedirectButtonsComponent],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent {

}
