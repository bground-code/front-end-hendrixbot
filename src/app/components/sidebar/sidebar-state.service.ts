import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarStateService {
  private _sidebarHidden: boolean = true;

  get sidebarHidden(): boolean {
    return this._sidebarHidden;
  }

  toggleSidebar(): void {
    this._sidebarHidden = !this._sidebarHidden;
  }
}
