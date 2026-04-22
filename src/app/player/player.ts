import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { hydrateRadioDurations, radiosData, Radio } from '../cons/radio';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player.html',
  styleUrls: ['./player.css'],
})
export class Player implements AfterViewInit, OnInit, OnDestroy {
  // positions for each radio button (x,y are pixels relative to top-left of wheel container)
  positions: { x: number; y: number; angle: number }[] = [];
  private resizeObserver?: ResizeObserver;
  private static readonly RANDOM_START_COOLDOWN_MS = 60_000;

  @ViewChild('audioPlayer') audioPlayer?: ElementRef<HTMLAudioElement>;
  @ViewChild('wheelContainer') wheelContainer?: ElementRef<HTMLDivElement>;




  radios: Radio[] = radiosData;
  selectedRadioIndex = 0;
  selectedRadioUrl = this.radios[0]?.url ?? '';
  isPlaying = false;
  volume = 1;
  private activeRadioUrl = this.selectedRadioUrl;
  private randomStartCooldowns = new Map<string, number>();
  private savedPlaybackPositions = new Map<string, number>();

  async ngOnInit(): Promise<void> {
    this.radios = await hydrateRadioDurations(this.radios);

    // If the view is already initialized, ensure positions are calculated.
    // Use a microtask to allow Angular to render the list first.
    Promise.resolve().then(() => this.calculatePositions());
  }

  ngAfterViewInit(): void {
    this.syncVolume();





    this.updateAudioSource({ autoplay: false, randomStart: false });

    // Start observing size changes for the wheel container to keep layout responsive
    const container = this.wheelContainer?.nativeElement;
    if (container && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        // schedule calculatePositions in next frame
        window.requestAnimationFrame(() => this.calculatePositions());
      });

      this.resizeObserver.observe(container);
      // initial calculation
      window.requestAnimationFrame(() => this.calculatePositions());
    } else {
      // fallback to window resize
      window.addEventListener('resize', this.onWindowResize);
      window.requestAnimationFrame(() => this.calculatePositions());
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }

    window.removeEventListener('resize', this.onWindowResize);
  }

  private onWindowResize = (): void => {
    // debounce with rAF
    window.requestAnimationFrame(() => this.calculatePositions());
  };

  onRadioChange(): void {
    this.selectedRadioUrl = this.radios[this.selectedRadioIndex]?.url ?? '';
    this.updateAudioSource({ autoplay: true, randomStart: true });
  }

  selectRadio(index: number): void {
    if (index < 0 || index >= this.radios.length) {
      return;
    }

    this.selectedRadioIndex = index;
    this.onRadioChange();
  }

  /**
   * Calculate pixel positions for each radio button and store them in `this.positions`.
   * Positions are relative to the top-left corner of the wheel container.
   */
  private calculatePositions(): void {
    const containerEl = this.wheelContainer?.nativeElement;
    if (!containerEl) {
      return;
    }

    const rect = containerEl.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const cx = width / 2;
    const cy = height / 2;

    const N = Math.max(1, this.radios.length);

    // Try to get a real button size from the DOM; fallback to CSS size (52) or 44 for touch targets
    const sampleBtn = containerEl.querySelector('.roulette-option') as HTMLElement | null;
    let btnW = 52;
    let btnH = 52;
    if (sampleBtn) {
      const bRect = sampleBtn.getBoundingClientRect();
      if (bRect.width > 0 && bRect.height > 0) {
        btnW = bRect.width;
        btnH = bRect.height;
      }
    }

    // radius: keep some padding so buttons don't clip at edges
    const padding = Math.max(12, Math.min(width, height) * 0.04); // 4% or at least 12px
    const radius = Math.max(0, Math.min(width, height) / 2 - Math.max(btnW, btnH) / 2 - padding);

    // start angle: -90deg so index 0 is top
    const startAngle = -Math.PI / 2;

    const newPositions: { x: number; y: number; angle: number }[] = [];

    for (let i = 0; i < N; i++) {
      const theta = startAngle + (i * (2 * Math.PI)) / N;
      const x = cx + radius * Math.cos(theta) - btnW / 2;
      const y = cy + radius * Math.sin(theta) - btnH / 2;
      const angleDeg = (theta * 180) / Math.PI;
      newPositions.push({ x: Math.round(x), y: Math.round(y), angle: angleDeg });
    }

    this.positions = newPositions;
    // Trigger change detection when needed (most often Angular will update view bindings automatically)
    try {
      // use ChangeDetectorRef if available in DI? we can use native trick: dispatch a small event
      // but here we'll just set positions and allow Angular change detection to pick it up on next tick
    } catch (e) {
      // no-op
    }
  }

  getTransform(index: number): string {
    const p = this.positions[index];
    if (!p) {
      return 'translate3d(0px, 0px, 0px)';
    }

    // Only translate to the computed position. Keep images unrotated (upright).
    return `translate3d(${p.x}px, ${p.y}px, 0px)`;
  }

  onAudioPlay(): void {
    this.isPlaying = true;
  }

  onAudioPause(): void {
    this.isPlaying = false;
  }

  onVolumeInput(): void {
    this.syncVolume();
  }

  get selectedRadioName(): string {
    return this.radios[this.selectedRadioIndex]?.name ?? '';
  }


  private updateAudioSource(options: { autoplay: boolean; randomStart: boolean }): void {
    const audio = this.getAudioElement();

    if (!audio || !this.selectedRadioUrl) {
      return;
    }

    const nextRadioUrl = this.selectedRadioUrl;
    const previousRadioUrl = this.activeRadioUrl;
    const selectedRadio = this.radios.find((radio) => radio.url === nextRadioUrl);
    const startPlayback = (): void => {
      if (options.autoplay) {
        void audio.play().catch(() => {

        });
      }
    };

    if (previousRadioUrl && previousRadioUrl !== nextRadioUrl) {
      this.savedPlaybackPositions.set(previousRadioUrl, audio.currentTime);
      this.randomStartCooldowns.set(
        previousRadioUrl,
        Date.now() + Player.RANDOM_START_COOLDOWN_MS,
      );
    }

    const shouldRandomStart = options.randomStart && this.canApplyRandomStart(nextRadioUrl);
    const shouldRestoreSavedPosition =
      options.randomStart
      && !shouldRandomStart
      && this.savedPlaybackPositions.has(nextRadioUrl);

    if (shouldRandomStart || shouldRestoreSavedPosition) {
      const handleLoadedMetadata = (): void => {
        const duration = Number.isFinite(audio.duration) && audio.duration > 0
          ? audio.duration
          : selectedRadio?.duration;

        if (duration && duration > 0) {
          if (shouldRandomStart) {
            audio.currentTime = Math.random() * duration;
          } else {
            const savedPosition = this.savedPlaybackPositions.get(nextRadioUrl) ?? 0;
            audio.currentTime = Math.min(savedPosition, duration);
          }
        }

        startPlayback();
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
    }

    audio.src = nextRadioUrl;
    this.activeRadioUrl = nextRadioUrl;
    audio.load();

    if (!shouldRandomStart && !shouldRestoreSavedPosition) {
      startPlayback();
    }
  }

  private canApplyRandomStart(radioUrl: string): boolean {
    const cooldownEndsAt = this.randomStartCooldowns.get(radioUrl) ?? 0;

    return Date.now() >= cooldownEndsAt;
  }

  private getAudioElement(): HTMLAudioElement | null {
    const audio = this.audioPlayer?.nativeElement;

    if (
      !audio
      || typeof audio.load !== 'function'
      || typeof audio.play !== 'function'
      || typeof audio.addEventListener !== 'function'
    ) {
      return null;
    }

    return audio;
  }

  togglePlay(): void {
    const audio = this.getAudioElement();

    if (!audio) {
      return;
    }

    if (audio.paused) {
      void audio.play().catch(() => {
        this.isPlaying = false;
      });
      return;
    }

    audio.pause();
  }

  private syncVolume(): void {
    const audio = this.getAudioElement();

    if (!audio) {
      return;
    }

    audio.volume = this.volume;
  }
}
