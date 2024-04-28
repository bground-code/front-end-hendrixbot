import { Component, OnInit } from '@angular/core';
import {faAngleDoubleLeft, faAngleDoubleRight, faGear, faHome, faUser} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  sidebarHidden: boolean = false;
  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;

  constructor() {}

  ngOnInit(): void {}

  toggleSidebar() {
    this.sidebarHidden = !this.sidebarHidden;
  }

  protected readonly faHome = faHome;
  protected readonly faGear = faGear;
  protected readonly faUser = faUser;
}
