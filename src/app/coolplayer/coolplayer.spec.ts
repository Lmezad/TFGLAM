import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coolplayer } from './coolplayer';


describe('Coolplayer', () => {
  let component: Coolplayer;
  let fixture: ComponentFixture<Coolplayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coolplayer]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Coolplayer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
