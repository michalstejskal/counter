import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  private interval;
  timerDate;
  timerSeconds = 2700;
  defaultTimerSeconds = 2700;
  timerMessage;
  isStopped = false;
  format = 'mm:ss';

  constructor() {
  }

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerMessage = 'study time';
        this.timerSeconds--;
        this.timerDate = new Date(1988, 3, 15, 11, Math.floor(this.timerSeconds / 60), this.timerSeconds - (Math.floor(this.timerSeconds / 60) * 60));
      } else {
        clearInterval(this.interval);
        this.timerDate = new Date(1988, 3, 15, 11, 0, 0);
        this.timerMessage = 'pause';
      }
    }, 1000);
  }

  setTimer() {
    this.timerSeconds = this.defaultTimerSeconds;
  }

  pauseTimer() {
    if (!this.isStopped && this.timerSeconds > 0) {
      this.isStopped = true;
      clearInterval(this.interval);
    } else if (this.isStopped && this.timerSeconds > 0) {
      this.isStopped = false;
      this.startTimer();
    } else {
      this.timerSeconds = this.defaultTimerSeconds;
      this.startTimer();
    }
  }

  // ng build --prod --base-href https://michalstejsky.github.io/timer/
  // ngh --dir=dist/timer
}

