import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDialogModalComponent } from './create-dialog-modal.component';

describe('CreateDialogModalComponent', () => {
  let component: CreateDialogModalComponent;
  let fixture: ComponentFixture<CreateDialogModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDialogModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateDialogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
