import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheduleComponent } from './chedule.component';

describe('CheduleComponent', () => {
  let component: CheduleComponent;
  let fixture: ComponentFixture<CheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
