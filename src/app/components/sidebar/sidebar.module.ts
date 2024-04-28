import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FaIconComponent
  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }
