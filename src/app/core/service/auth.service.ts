import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = new BehaviorSubject<boolean>(false)
  authStatus = this.isAuthenticated.asObservable()

  constructor(private http: HttpClient) {
  }

  login() {

  }

  logout() {
    this.isAuthenticated.next(false)
  }
}
