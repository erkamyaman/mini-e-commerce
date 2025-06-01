import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../types/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public http = inject(HttpClient)

  getUserById(id: number) {
    return this.http.get<User>(`http://localhost:3000/users/${id}`);
  }
}
