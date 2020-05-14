import { Injectable } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class HashService {

  constructor() { }

  public async hashFile(fileToHash : File) : Promise<string> {
    let hasher = new Md5()

    return fileToHash.arrayBuffer().then(arr => {
      hasher.appendStr(fileToHash.name)
      hasher.appendByteArray(new Uint8Array(arr))
      return hasher.end().toString()
    })
  }
}
