import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { Player } from './player';

describe('Player', () => {
  let component: Player;
  let fixture: ComponentFixture<Player>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Player]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Player);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render radio options', () => {
    const select: HTMLSelectElement =
      fixture.nativeElement.querySelector('#radioSelect');

    expect(select).toBeTruthy();
    expect(select.options.length).toBe(component.radios.length);
    expect(select.options[0].textContent?.trim()).toBe(component.radios[0].name);
  });

  it('should load and play the selected radio', async () => {
    const select: HTMLSelectElement =
      fixture.nativeElement.querySelector('#radioSelect');
    const audio: HTMLAudioElement = fixture.nativeElement.querySelector('audio');
    const loadSpy = vi.spyOn(audio, 'load').mockImplementation(() => undefined);
    const playSpy = vi.spyOn(audio, 'play').mockResolvedValue(undefined);

    select.value = component.radios[1].url;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.selectedRadioUrl).toBe(component.radios[1].url);
    expect(audio.src).toBe(component.radios[1].url);
    expect(loadSpy).toHaveBeenCalled();
    expect(playSpy).toHaveBeenCalled();
  });
});
