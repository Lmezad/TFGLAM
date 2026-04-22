import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.html',
  styleUrls: ['./countdown.css'],
})
export class Countdown implements OnInit, OnDestroy {
  private subscription?: Subscription;

  constructor(private cdr: ChangeDetectorRef) {}

  public targetDate = new Date('2026-11-19T00:00:00');

  public weeks: number = 0;
  public days: number = 0;
  public hours: number = 0;
  public minutes: number = 0;
  public seconds: number = 0;

  ngOnInit(): void {
    this.updateCountdown();

    this.subscription = interval(1000).subscribe(() => {
      this.updateCountdown();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const target = this.targetDate.getTime();
    const difference = target - now;

    if (difference <= 0) {
      this.weeks = this.days = this.hours = this.minutes = this.seconds = 0;
      return;
    }

    const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));

    this.weeks = Math.floor(totalDays / 7);
    this.days = totalDays % 7;

    this.hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    this.minutes = Math.floor((difference / (1000 * 60)) % 60);
    this.seconds = Math.floor((difference / 1000) % 60);

    // If Zone.js is not present, async tasks (like rxjs interval) won't trigger
    // Angular change detection automatically. Force a check so template updates
    // without requiring a full page reload.
    try {
      this.cdr.detectChanges();
    } catch {
      // ignore if detection can't run (e.g. during server render)
    }
  }
}
