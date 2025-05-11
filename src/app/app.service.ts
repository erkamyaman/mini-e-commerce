import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  _currentRouteSubject = new BehaviorSubject<string>('')
  currentRoute$ = this._currentRouteSubject.asObservable()

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this._currentRouteSubject.next(event.urlAfterRedirects.slice(1))
        console.log(this._currentRouteSubject.value)
      }
    });
  }
}
