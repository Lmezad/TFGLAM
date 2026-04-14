import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  selectedRadioUrl = this.radios[0]?.url ?? '';
  private activeRadioUrl = this.selectedRadioUrl;
  // Stores when each audio can be randomized again after leaving it.
  private randomStartCooldowns = new Map<string, number>();
  // Remembers the last playback position for each audio while its cooldown is active.
  private savedPlaybackPositions = new Map<string, number>();

  async ngOnInit(): Promise<void> {
    this.radios = await hydrateRadioDurations(this.radios);
  }

  ngAfterViewInit(): void {
    this.updateAudioSource({ autoplay: false, randomStart: false });
  }

  onRadioChange(): void {
    this.updateAudioSource({ autoplay: true, randomStart: true });
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
          // Browsers can block autoplay depending on media policies.
        });
      }
    };

    if (previousRadioUrl && previousRadioUrl !== nextRadioUrl) {
      // Leaving an audio starts its own cooldown and preserves its last position.
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
            // First entry or expired cooldown: start from a random valid point.
            audio.currentTime = Math.random() * duration;
          } else {
            // Re-entering during cooldown: resume exactly where this audio was left.
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
}
