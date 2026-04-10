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
  @ViewChild('audioPlayer') audioPlayer?: ElementRef<HTMLAudioElement>;

  radios: Radio[] = radiosData;
  selectedRadioUrl = this.radios[0]?.url ?? '';

  async ngOnInit(): Promise<void> {
    this.radios = await hydrateRadioDurations(this.radios);
  }

  ngAfterViewInit(): void {
    this.updateAudioSource(false);
  }

  onRadioChange(): void {
    this.updateAudioSource(true);
  }

  private updateAudioSource(autoplay: boolean): void {
    const audio = this.audioPlayer?.nativeElement;

    if (!audio || !this.selectedRadioUrl) {
      return;
    }

    audio.src = this.selectedRadioUrl;
    audio.load();

    if (autoplay) {
      void audio.play().catch(() => {
        // Browsers can block autoplay depending on media policies.
      });
    }
  }
}
