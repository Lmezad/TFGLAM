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

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the radio roulette with all station options', () => {
    const options: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.roulette-option'),
    );
    const activeOption: HTMLButtonElement | null =
      fixture.nativeElement.querySelector('.roulette-option.active');
    const centerLabel: HTMLElement | null =
      fixture.nativeElement.querySelector('.roulette-center strong');

    expect(options.length).toBe(component.radios.length);
    expect(options[0].textContent?.trim()).toBe(component.radios[0].name);
    expect(activeOption?.textContent?.trim()).toBe(component.radios[0].name);
    expect(centerLabel?.textContent?.trim()).toBe(component.radios[0].name);
  });

  it('should load and play the selected radio', async () => {
    const options: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.roulette-option'),
    );
    const audio: HTMLAudioElement = fixture.nativeElement.querySelector('audio');
    const loadSpy = vi.spyOn(audio, 'load').mockImplementation(() => undefined);
    const playSpy = vi.spyOn(audio, 'play').mockResolvedValue(undefined);
    const addEventListenerSpy = vi.spyOn(audio, 'addEventListener');
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

    component.radios[1].duration = 120;

    options[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const loadedMetadataHandler = addEventListenerSpy.mock.calls.find(
      ([eventName]) => eventName === 'loadedmetadata',
    )?.[1] as EventListener | undefined;

    expect(loadedMetadataHandler).toBeTruthy();
    loadedMetadataHandler?.(new Event('loadedmetadata'));

    expect(component.selectedRadioIndex).toBe(1);
    expect(component.selectedRadioUrl).toBe(component.radios[1].url);
    expect(audio.src).toBe(component.radios[1].url);
    expect(audio.currentTime).toBe(60);
    expect(loadSpy).toHaveBeenCalled();
    expect(playSpy).toHaveBeenCalled();
    expect(randomSpy).toHaveBeenCalled();
  });

  it('should restore the previous position when returning within the audio cooldown', async () => {
    const options: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.roulette-option'),
    );
    const audio: HTMLAudioElement = fixture.nativeElement.querySelector('audio');
    vi.spyOn(audio, 'load').mockImplementation(() => undefined);
    const playSpy = vi.spyOn(audio, 'play').mockResolvedValue(undefined);
    const addEventListenerSpy = vi.spyOn(audio, 'addEventListener');
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const dateNowSpy = vi.spyOn(Date, 'now');

    component.radios[0].duration = 80;
    component.radios[1].duration = 120;
    component.radios[2].duration = 200;

    dateNowSpy.mockReturnValue(100_000);
    options[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const firstLoadedMetadataHandler = addEventListenerSpy.mock.calls.find(
      ([eventName]) => eventName === 'loadedmetadata',
    )?.[1] as EventListener | undefined;

    firstLoadedMetadataHandler?.(new Event('loadedmetadata'));
    expect(audio.currentTime).toBe(30);
    audio.currentTime = 42;

    dateNowSpy.mockReturnValue(130_000);
    options[2].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const secondLoadedMetadataHandler = addEventListenerSpy.mock.calls[1]?.[1] as EventListener | undefined;

    secondLoadedMetadataHandler?.(new Event('loadedmetadata'));
    expect(audio.currentTime).toBe(50);

    dateNowSpy.mockReturnValue(150_000);
    options[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const thirdLoadedMetadataHandler = addEventListenerSpy.mock.calls[2]?.[1] as EventListener | undefined;

    thirdLoadedMetadataHandler?.(new Event('loadedmetadata'));
    expect(audio.currentTime).toBe(42);
    expect(playSpy).toHaveBeenCalledTimes(3);
    expect(randomSpy).toHaveBeenCalledTimes(2);
    expect(addEventListenerSpy).toHaveBeenCalledTimes(3);
  });

  it('should toggle the play button label based on audio state', async () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.play-button');
    const audio: HTMLAudioElement = fixture.nativeElement.querySelector('audio');
    const playSpy = vi.spyOn(audio, 'play').mockResolvedValue(undefined);
    const pauseSpy = vi.spyOn(audio, 'pause').mockImplementation(() => undefined);

    expect(button.textContent?.trim()).toBe('Play');

    button.click();
    expect(playSpy).toHaveBeenCalledTimes(1);

    audio.dispatchEvent(new Event('play'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(button.textContent?.trim()).toBe('Pause');

    Object.defineProperty(audio, 'paused', { configurable: true, get: () => false });
    button.click();
    expect(pauseSpy).toHaveBeenCalledTimes(1);

    audio.dispatchEvent(new Event('pause'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(button.textContent?.trim()).toBe('Play');
  });

  it('should update the audio volume from the slider', async () => {
    const slider: HTMLInputElement = fixture.nativeElement.querySelector('#volumeSlider');
    const audio: HTMLAudioElement = fixture.nativeElement.querySelector('audio');

    Object.defineProperty(audio, 'volume', {
      configurable: true,
      writable: true,
      value: 1,
    });

    slider.value = '0.35';
    slider.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.volume).toBe(0.35);
    expect(audio.volume).toBe(0.35);
  });
});
