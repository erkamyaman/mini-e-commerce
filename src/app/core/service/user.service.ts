import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../types/user.model';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public http = inject(HttpClient)

  allUsers = new BehaviorSubject<User[]>([])
  allUsersObs$ = this.allUsers.asObservable()

  getUserById(id: number) {
    return this.http.get<User>(`http://localhost:3000/users/${id}`);
  }

  getUsers() {
    return this.http.get<User[]>(`http://localhost:3000/users`).pipe(tap((res: User[]) => {
      this.allUsers.next(res)
    }));
  }
}
