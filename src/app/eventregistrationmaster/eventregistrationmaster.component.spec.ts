import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventregistrationmasterComponent } from './eventregistrationmaster.component';

describe('EventregistrationmasterComponent', () => {
  let component: EventregistrationmasterComponent;
  let fixture: ComponentFixture<EventregistrationmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventregistrationmasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventregistrationmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
