import { PipeTransform, Inject, LOCALE_ID, Pipe } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
    name: 'filesize'
})
export class FileSizePipe implements PipeTransform {
    deciPipe: DecimalPipe;

    private units = [
      'bytes',
      'KB',
      'MB',
      'GB',
      'TB',
      'PB'
    ];
  
    transform(bytes: number = 0, precision: number = 2 ) : string {
      if ( isNaN( parseFloat( String(bytes) )) || ! isFinite( bytes ) ) return '?';
  
      let unit = 0;
  
      while ( bytes >= 1024 ) {
        bytes /= 1024;
        unit ++;
      }

      if(unit === 0) {
        return bytes.toFixed( + 0 ) + ' ' + this.units[ unit ];
      }
  
      return bytes.toFixed( + precision ) + ' ' + this.units[ unit ];

  }
}
