import { Component, OnDestroy, OnInit  } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-countdown',
  imports: [],
  templateUrl: './countdown.html',
  styleUrl: './countdown.css',
})
export class Countdown implements OnInit, OnDestroy {
private subscription!: Subscription;

  public targetDate = new Date('2026-11-19T00:00:00');

  public weeks: number = 0;
  public days: number = 0;
  public hours: number = 0;
  public minutes: number = 0;
  public seconds: number = 0;

  ngOnInit(): void {
    this.subscription = interval(1000).subscribe(() => {
      this.updateCountdown();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
  }
}
