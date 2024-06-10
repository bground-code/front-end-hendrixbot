import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public isSideBarChecked = new BehaviorSubject<boolean>(false);
  isSideBarChecked$ = this.isSideBarChecked.asObservable();

  setSideBarChecked(value: boolean) {
    this.isSideBarChecked.next(value);
  }
}
