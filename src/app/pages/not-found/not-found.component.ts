import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RedirectButtonsComponent } from '../../shared/components/redirect-buttons/redirect-buttons.component';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, RedirectButtonsComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

}
