import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiUrl = 'http://localhost:3000/shops';

  public http = inject(HttpClient)

  getShops() {
    return this.http.get(this.apiUrl);
  }
}
