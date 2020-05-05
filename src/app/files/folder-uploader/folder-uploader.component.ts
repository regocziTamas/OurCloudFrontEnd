import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FileService } from 'src/app/services/file/file.service';
import { Folder } from 'src/app/models/folder';
import { pipe, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-folder-uploader',
  templateUrl: './folder-uploader.component.html',
  styleUrls: ['./folder-uploader.component.css']
})
export class FolderUploaderComponent implements OnInit {

  @Output() uploadFolderEvent = new EventEmitter<boolean>();
  @Output() errorInFolderUpload = new EventEmitter<HttpErrorResponse>();
  @Input() parentFolder : Folder
  newFolderName : string
  newFolderNameForm = new FormControl('');
  constructor(private fileService: FileService) { }

  ngOnInit(): void {
  } 

  onCreateFolder() : void {
    if(this.newFolderNameForm.value) {
      this.fileService.sendUploadFolderRequest(this.newFolderNameForm.value, this.parentFolder)
      
      .subscribe(
        res => {
          this.uploadFolderEvent.emit(true)
        },
        err => {
          this.errorInFolderUpload.emit(err)
        })
    } 
  }
}
