import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  set(key: string, value: string) {
    localStorage.setItem(key, value)
  }

  get(key: string) {
    console.log(localStorage.getItem(key))
    return localStorage.getItem(key)
  }

  remove(key: string) {
    localStorage.removeItem(key)
  }

  reset() {
    localStorage.clear()
  }
  constructor() { }
}
