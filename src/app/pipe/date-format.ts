import {Pipe, PipeTransform} from '@angular/core';
import {format} from 'date-fns';

@Pipe({name: 'dateFormat'})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date, f = 'yyyy-MM-dd HH:mm:ss'): string {
    if (!(value instanceof Date)) {
      value = new Date(value);
    }
    return format(value, f);
  }
}
