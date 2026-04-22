import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { hydrateRadioDurations, radiosData, Radio } from '../cons/radio';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player.html',
  styleUrls: ['./player.css'],
})
export class Player implements AfterViewInit, OnInit {
  private static readonly RANDOM_START_COOLDOWN_MS = 60_000;

  @ViewChild('audioPlayer') audioPlayer?: ElementRef<HTMLAudioElement>;




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
  }

  ngAfterViewInit(): void {
    this.syncVolume();





    this.updateAudioSource({ autoplay: false, randomStart: false });
  }

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
