import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FileService } from 'src/app/services/file/file.service';
import { Folder } from 'src/app/models/folder';
import { map, catchError } from 'rxjs/operators';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {

  fileToUpload : File
  @Output() uploadFileEvent = new EventEmitter<boolean>();
  @Output() errorInFileUpload = new EventEmitter<HttpErrorResponse>();
  @Input() parentFolder : Folder
  filename : string
  filesize : number
  fileSelected : boolean = false
  fileUploadInProgress : boolean = false;
  fileUploadProgress : number = 0;

  constructor(private fileService: FileService) { }

  ngOnInit(): void {
  }

  selectFileToUpload(files : FileList) {
    this.fileToUpload = files.item(0)
    this.fileSelected = true
    this.filename = this.fileToUpload.name
    this.filesize = this.fileToUpload.size
  }

  resetToInitialState() : void {
    this.fileUploadInProgress = false;
    this.fileUploadProgress = 0;
    this.fileToUpload = null;
    this.fileSelected = false;
    this.filename = null;
    this.filesize = 0;
  }

  uploadFile() {
    this.fileService.sendUploadRequest(this.fileToUpload, this.parentFolder)
    .pipe(
      map(event => {
        console.log(event)
        if(event.type === HttpEventType.UploadProgress) {
          this.fileUploadInProgress = true;
          this.fileUploadProgress = Math.round(100 * event.loaded / event.total);
      }
      return event;
    }))
    .subscribe(
      event => {
        if(event.type === HttpEventType.Response) {
          this.uploadFileEvent.emit(true);
          this.resetToInitialState();
        }
      },
      err => {
        this.errorInFileUpload.emit(err);
        this.resetToInitialState();
      })
  }
}
