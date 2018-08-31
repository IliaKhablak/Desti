import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingBusinessComponent } from './booking-business.component';

describe('BookingBusinessComponent', () => {
  let component: BookingBusinessComponent;
  let fixture: ComponentFixture<BookingBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
