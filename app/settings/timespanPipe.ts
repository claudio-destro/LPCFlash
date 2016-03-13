import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({ name: 'timespan' })

export class TimespanPipe implements PipeTransform {
  transform(value: number, args: string[]): string {
    if (!isNaN(value) && isFinite(value) && value >= 0) {
      return value < 1000 ? `${value}ms` : toHHMMSS(~~(value / 1000));
    }
  }
}

function toHHMMSS(value: number): string {
  var hours = Math.floor(value / 3600);
  var minutes = Math.floor((value - (hours * 3600)) / 60);
  var seconds = value - (hours * 3600) - (minutes * 60);

  if (hours > 0) {
    return `${hours}:${pad10(minutes)}:${pad10(seconds)}s`;
  }
  if (minutes > 0) {
    return `${minutes}:${pad10(seconds)}s`;
  }
  return `${seconds}s`;
}

function pad10(n: number): string | number {
  return n < 10 ? `0${n}` : n;
}
