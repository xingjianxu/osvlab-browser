import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {
  transform(value: Date, f = 'yyyy-MM-dd HH:mm:ss'): string {
    return format(value, f);
  }
}
