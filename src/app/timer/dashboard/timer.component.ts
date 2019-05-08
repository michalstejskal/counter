import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  private interval;
  private timerDate;
  private timerSeconds = 2700;
  private defaultTimerSeconds = 2700;
  private timerMessage;

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
        this.timerDate = new Date(1988, 3, 15, 11, 0, 0);
        this.timerMessage = 'pause .. refresh to restart';
      }
    }, 1000);
  }

  setTimer(event) {
    this.timerSeconds = this.defaultTimerSeconds;
  }


}
