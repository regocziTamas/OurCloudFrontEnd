import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { empty } from 'rxjs';
import { FileService } from '../services/file/file-service.service';
import { FileSystemElement } from '../models/filesystemelement';
import { Breadcrumb } from './breadcrumb';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

  msgFromBackend : String
  currentPath = ""
  fileToUpload : File
  modelToShow: FileSystemElement
  breadcrumb: Breadcrumb = new Breadcrumb();

  constructor(private http: HttpClient, private fileService: FileService) { }

  ngOnInit() {
    this.fileService.getFileSystemElement("Thomaster").subscribe(model => this.modelToShow = model);
    this.breadcrumb.pushElement(this.modelToShow.getRelativePath, this.modelToShow.getOriginalName);
  }

  selectFileToUpload(files : FileList) {
    this.fileToUpload = files.item(0)
  }

  uploadFile() {
    
    console.log("Upload file")
    const formData: FormData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name)
    formData.append('parentFolderPath', "Thomaster")
    formData.append('shouldOverrideExistingFile', "false")
    this.http.post(environment.serverUrl + "/upload/file", formData)
    .subscribe(res => console.log(res));
  }

  onModelChange(pathToNewModel: string) {
    this.fileService.getFileSystemElement(pathToNewModel).subscribe(model => this.modelToShow = model);
    this.breadcrumb.pushElement(this.modelToShow.getRelativePath, this.modelToShow.getOriginalName);
  }

  onNavigateBreadcrumb(path: string) {
    this.fileService.getFileSystemElement(path).subscribe(model => this.modelToShow = model);
    this.breadcrumb.removeElementsUntil(path);
  }

}
