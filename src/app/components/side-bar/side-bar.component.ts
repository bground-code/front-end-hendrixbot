import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { StateService } from 'src/app/client/state.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent implements OnInit {
  isChecked = false;

  constructor(
    private stateService: StateService,
    private elRef: ElementRef,
  ) {}

  ngOnInit() {
    this.stateService.isSideBarChecked$.subscribe((isChecked) => {
      this.isChecked = isChecked;
    });
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.isChecked && !this.elRef.nativeElement.contains(event.target)) {
      this.stateService.setSideBarChecked(false);
    }
  }

  onLinkClick() {
    this.stateService.setSideBarChecked(false);
  }
}
