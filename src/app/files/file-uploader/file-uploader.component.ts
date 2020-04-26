import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FileService } from 'src/app/services/file/file.service';
import { Folder } from 'src/app/models/folder';
import { map } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {

  fileToUpload : File
  @Output() uploadFileEvent = new EventEmitter<boolean>();
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

  uploadFile() {
    this.fileService.sendUploadRequest(this.fileToUpload, this.parentFolder)
    .pipe(map(event => {
      if(event.type === HttpEventType.UploadProgress) {
        this.fileUploadInProgress = true;
        this.fileUploadProgress = Math.round(100 * event.loaded / event.total);
      }
      return event;
    }))
    .subscribe(event => {
      if(event.type === HttpEventType.Response) {
        this.uploadFileEvent.emit(true);
        this.fileUploadInProgress = false;
        this.fileUploadProgress = 0;
        this.fileToUpload = null;
        this.fileSelected = false;
        this.filename = null;
        this.filesize = 0;
      }
      
    })
  }
}
