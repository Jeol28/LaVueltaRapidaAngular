import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaMenuComponent } from './tabla-menu.component';

describe('TablaMenuComponent', () => {
  let component: TablaMenuComponent;
  let fixture: ComponentFixture<TablaMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaMenuComponent]
    });
    fixture = TestBed.createComponent(TablaMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
