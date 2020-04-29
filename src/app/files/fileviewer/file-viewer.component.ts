import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileSystemElement } from 'src/app/models/filesystemelement';
import { Folder } from 'src/app/models/folder';
import { ContainedFse } from 'src/app/models/contained-fse';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.css']
})
export class FileViewerComponent implements OnInit {

  @Input() model: Folder;
  @Output() modelChange = new EventEmitter<string>();
  @Output() downloadFileEvent = new EventEmitter<ContainedFse>();
  @Output() deleteFileEvent = new EventEmitter<FileSystemElement>();

  isFolder: boolean
  displayedColumns: string[] = ['filename', 'owner', 'size', 'checkbox'];

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
  }

  fireDownloadFileEvent(fileToDownload : ContainedFse) {
    this.downloadFileEvent.emit(fileToDownload);
  }

  fireDeleteFileEvent(fileToDelete : ContainedFse) {
    this.deleteFileEvent.emit(fileToDelete);
  }
}
