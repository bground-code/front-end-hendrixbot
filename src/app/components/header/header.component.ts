import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import {
  faArrowRightToBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FaIconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  toggleMenu() {
    this.collapsed = !this.collapsed;
    document.querySelector('body')?.classList.toggle('collapsedMenu');
  }
  collapsed: boolean = false;
  ngOnInit(): void {}

  protected readonly faBars = faBars;
  protected readonly faArrowRightToBracket = faArrowRightToBracket;
  protected readonly faUser = faUser;

  labelEvent = {
    application: 'Sistema de Plantão Judicial',
    titleApplication: 'Sistema de Plantão Judicial',
    sgc: '',
    title: '',
    cardInfo: '',
    calendar: '',
    list: '',
  };
}
