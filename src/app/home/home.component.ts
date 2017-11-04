import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/interval';

import {HomeService} from './home.service';

@Component({
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private _ticks: number = 0;
  timer: any;
  subscription: any;
  isPaused: boolean = true;
  current: number = 0;
  lastClickedTime: number = 0;

  constructor(private homeService: HomeService) {}

  get time() {
    return this.homeService.convertSecondsToTime(this._ticks);
  }

  ngOnInit() {
    this.timer = Observable.interval(1000);
  }

  toggle() {
    this.isPaused = !this.isPaused;
    if (!this.isPaused) {
      this.subscription = this.timer.map(t => this.current + 1).subscribe(t => {
        this.current = t;
        this._ticks = t;
      });
    } else {
      this.subscription.unsubscribe();
    }
  }

  wait() {
    let now = new Date().getTime();
    let diff = now - this.lastClickedTime;
    if (diff <= 300) {
      this.subscription.unsubscribe();
      this.isPaused = true;
    }
    if (this.isPaused) {
      this.subscription = this.timer.map(t => this.current + 1).subscribe(t => {
        this.current = t;
        this._ticks = t;
      });
      this.isPaused = false;
    }
    this.lastClickedTime = now;
  }

  reset() {
    this.subscription.unsubscribe();
    this._ticks = 0;
    this.isPaused = true;
    this.current = 0;
  }
}
