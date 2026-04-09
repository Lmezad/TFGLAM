import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectestComponent } from './electest.component';

describe('ElectestComponent', () => {
  let component: ElectestComponent;
  let fixture: ComponentFixture<ElectestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectestComponent] // standalone component
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectestComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
