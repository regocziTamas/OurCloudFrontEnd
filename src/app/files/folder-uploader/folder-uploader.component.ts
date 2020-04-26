import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-folder-uploader',
  templateUrl: './folder-uploader.component.html',
  styleUrls: ['./folder-uploader.component.css']
})
export class FolderUploaderComponent implements OnInit {

  @Output() uploadFolderEvent = new EventEmitter<string>();
  newFolderName : string
  newFolderNameForm = new FormControl('');
  constructor() { }

  ngOnInit(): void {
  }

  onCreateFolder() : void {
    if(this.newFolderNameForm.value) {
      this.uploadFolderEvent.emit(this.newFolderNameForm.value)
    }

  }
}
