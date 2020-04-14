import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileSystemElement } from 'src/app/models/filesystemelement';
import { Folder } from 'src/app/models/folder';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.css']
})
export class FileViewerComponent implements OnInit {

  @Input() model: FileSystemElement;
  @Output() modelChange = new EventEmitter<string>();
  isFolder: boolean

  constructor() {
    
  }

  ngOnInit() {
    this.isFolder = this.model instanceof Folder
    console.log(this.isFolder)
  }

  signalModelChange(pathToRequest:string, isFolder: boolean) {
    if(isFolder) {
      this.modelChange.emit(pathToRequest);
    }

    console.log(pathToRequest + " " + isFolder);
  }

}
