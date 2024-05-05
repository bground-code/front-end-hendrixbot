import { Component, OnInit } from '@angular/core';
import { faAngleDoubleLeft, faAngleDoubleRight, faGear, faHome, faUser } from '@fortawesome/free-solid-svg-icons';

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
    this.adjustContentWidth();
  }

  protected readonly faHome = faHome;
  protected readonly faGear = faGear;
  protected readonly faUser = faUser;

  // Ajustar largura do conteúdo quando o sidebar é aberto ou fechado
  adjustContentWidth() {
    const sidebarWidth = document.getElementById('sidebar')?.offsetWidth;
    const content = document.querySelector('.content') as HTMLElement; // Converter para HTMLElement
    if (content && typeof sidebarWidth === 'number') {
      content.style.marginLeft = this.sidebarHidden ? '0' : sidebarWidth + 'px';
    }
  }
}

// Ajustar largura do conteúdo quando a página é carregada e redimensionada
window.onload = function() {
  adjustContentWidth();
};

window.onresize = function() {
  adjustContentWidth();
};

function adjustContentWidth() {
  const sidebar = document.getElementById('sidebar');
  const content = document.querySelector('.content') as HTMLElement; // Converter para HTMLElement

  if (sidebar && content) {
    const sidebarWidth = sidebar.offsetWidth;
    content.style.marginLeft = sidebarWidth + 'px';
  }
}
