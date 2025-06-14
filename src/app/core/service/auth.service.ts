import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { Router } from '@angular/router';
import { User } from '../types/user.model';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // not necessary
  isAuthenticated = new BehaviorSubject<boolean>(false);
  authStatus = this.isAuthenticated.asObservable();

  currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  localStorageService = inject(LocalStorageService);
  router = inject(Router);

  private token = '123';

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.get<any[]>(`http://localhost:3000/users`).pipe(
      tap((users) => {
        const user = users.find((u) => u.username === username && u.password === password);

        if (user) {
          this.isAuthenticated.next(true);
          this.localStorageService.set('token', this.token);
          this.localStorageService.set('user', JSON.stringify(user));
          this.currentUserSubject.next(user);

          this.handleRedirection()

        } else {
          throw new Error('Invalid credentials');
        }
      })
    );
  }

  handleRedirection() {
    const userRole = this.currentUserSubject.value?.role;

    switch (userRole) {
      case 'manager':
        this.router.navigate(['/sales']);
        break;
      case 'salesman':
        this.router.navigate(['/orders']);
        break;
      case 'customer':
        this.router.navigate(['/products']);
        break;
      case 'god':
        this.router.navigate(['/products']);
        break;
      default:
        break;
    }
  }

  isLoggedIn(): boolean {
    return this.localStorageService.get('token') ? true : false;
  }

  logout() {
    this.localStorageService.reset();
    this.isAuthenticated.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.currentUserSubject.value!;
  }

  getCurrentUserRole() {
    return this.currentUserSubject.value?.role;
  }

  setCurrentUser() {
    const userJson = this.localStorageService.get('user');
    if (userJson) {
      const user = JSON.parse(userJson) as User;
      this.currentUserSubject.next(user);
    }
  }
}
