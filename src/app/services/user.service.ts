import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserType {
  id?: string;
  name?: string;
  email?: string;
  photoUrl?: string;
  provider?: string;
}

const LOCALSTORAGE_KEY: string = 'ta_user_data';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userData: BehaviorSubject<UserType | null> = new BehaviorSubject(
    JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || null
  );

  get userValue() {
    return this.userData.value;
  }

  isAuthenticated(): boolean {
    if (this.userData.value) {
      return true;
    } else {
      return false;
    }
  }

  setUserData(data: UserType) {
    this.userData.next(data);
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data));
  }

  logout() {
    this.setUserData(null);
    localStorage.removeItem(LOCALSTORAGE_KEY);
  }
}
