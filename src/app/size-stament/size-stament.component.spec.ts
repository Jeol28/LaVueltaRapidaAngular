import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeStamentComponent } from './size-stament.component';

describe('SizeStamentComponent', () => {
  let component: SizeStamentComponent;
  let fixture: ComponentFixture<SizeStamentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SizeStamentComponent]
    });
    fixture = TestBed.createComponent(SizeStamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
