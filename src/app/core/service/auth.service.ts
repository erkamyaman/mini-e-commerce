import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = new BehaviorSubject<boolean>(false)
  authStatus = this.isAuthenticated.asObservable()

  localStorageService = inject(LocalStorageService)
  router = inject(Router);


  private token = '123';


  constructor(private http: HttpClient) {
  }

  login(username: string, password: string) {
    return this.http
      .get<any[]>(`http://localhost:3000/users?username=${username}&password=${password}`)
      .pipe(
        tap(users => {
          if (users.length > 0) {
            this.isAuthenticated.next(true);
            this.localStorageService.set('token', this.token);
            this.router.navigate(['/products']);
          } else {
            throw new Error('Invalid credentials');
          }
        })
      );
  }

  isLoggedIn(): boolean {
    return this.localStorageService.get('token') ? true : false;
  }

  logout() {
    this.localStorageService.remove('token');
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);


  }
}
