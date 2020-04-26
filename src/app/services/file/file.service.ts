import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FileSystemElement } from 'src/app/models/filesystemelement';
import { Folder } from 'src/app/models/folder';
import { OCFile } from 'src/app/models/file';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, filter, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ContainedFse } from 'src/app/models/contained-fse';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private map: Map<string, string>;

  constructor(private router: Router, private http: HttpClient) { 
    this.fillMapWithTestData();
  }

  public getFileSystemElement(path: string) : Observable<FileSystemElement>{
    let params : HttpParams = new HttpParams()
      .append("fileToPathToGet", path);

    return this.http.get<JSON>(environment.serverUrl + "/file", {params})
    .pipe(map(result => {
      if(result.hasOwnProperty("containedFiles")) {
        return new Folder(result) 
      } else {
        return new OCFile(result)
      }
    }));
  }

  public isFolderNameTakenInFolder(currentFolder : Folder, newFolderName : string) : boolean {
     let result : ContainedFse[] = currentFolder.containedFiles
        .filter(fse => fse.isFolder)
        .filter(folder => folder.originalName === newFolderName);

      return result.length === 0;
  }

  public isFileNameTakenInFolder(currentFolder : Folder, newFileName : string) : boolean {
    let result : ContainedFse[] = currentFolder.containedFiles
       .filter(fse => !fse.isFolder)
       .filter(file => file.originalName === newFileName);
       
     return result.length === 0;
  }

  public sendDeleteRequest(fileToDelete : ContainedFse) {
    let params : HttpParams = new HttpParams()
    .append("fileToPathToDelete", fileToDelete.relativePath);

    return this.http.delete<JSON>(environment.serverUrl + "/delete/fse", {params});
  }

  public sendDownloadRequest(fileToDownload : ContainedFse) {
    let paramslol : HttpParams = new HttpParams()
      .append("pathToFileToDownload", fileToDownload.relativePath);
    let headerslol : HttpHeaders = new HttpHeaders()
    .set("Accept", fileToDownload.mimeType);
   
    console.log(fileToDownload.mimeType);

    return this.http.get(environment.serverUrl + "/download", {headers: headerslol, responseType: 'blob', params: paramslol})
  }

  public sendUploadRequest(fileToUpload : File, parentFolder : Folder) {
    let formData:FormData = new FormData();  
    formData.append("file", fileToUpload);
    formData.append("parentFolderPath", parentFolder.relativePath)
    formData.append("shouldOverrideExistingFile", "true")

    return this.http.post(environment.serverUrl + "/upload/file", formData, {reportProgress: true, observe: 'events'});
  }

  public sendUploadFolderRequest(newFolderName : string, parentFolder : Folder) {

    let formData : FormData = new FormData()
    formData.append("parentFolderPath", parentFolder.relativePath)
    formData.append("newFolderName", newFolderName)
    formData.append("shouldOverrideExistingFile", "true");

    return this.http.post(environment.serverUrl + "/upload/folder", formData);
  }

  private requestFromServer(path: String): JSON {
    
    return JSON.parse("{\"id\":1,\"relativePath\":\"Thomaster\",\"originalName\":\"Thomaster\",\"fileSize\":1583,\"ownerName\":\"Thomaster\",\"parentFolderPath\":null,\"containedFiles\":[{\"id\":3,\"relativePath\":\"Thomaster.holiday_pictures\",\"originalName\":\"holiday&nbsp;pictures\",\"fileSize\":333,\"ownerName\":\"Thomaster\",\"parentFolderPath\":\"Thomaster\",\"containedFiles\":[{\"id\":6,\"relativePath\":\"Thomaster.holiday_pictures.2019\",\"originalName\":\"2019\",\"fileSize\":0,\"ownerName\":\"Thomaster\",\"parentFolderPath\":\"Thomaster.holiday_pictures\",\"containedFiles\":[]},{\"id\":7,\"relativePath\":\"Thomaster.holiday_pictures.italy\",\"originalName\":\"italy.jpg\",\"fileSize\":333,\"ownerName\":\"Thomaster\",\"parentFolderPath\":\"Thomaster.holiday_pictures\"}]},{\"id\":2,\"relativePath\":\"Thomaster.homework_files\",\"originalName\":\"homework files\",\"fileSize\":1250,\"ownerName\":\"Thomaster\",\"parentFolderPath\":\"Thomaster\",\"containedFiles\":[{\"id\":4,\"relativePath\":\"Thomaster.homework_files.history\",\"originalName\":\"history.txt\",\"fileSize\":500,\"ownerName\":\"Thomaster\",\"parentFolderPath\":\"Thomaster.homework_files\"},{\"id\":5,\"relativePath\":\"Thomaster.homework_files.chemistry\",\"originalName\":\"chemistry.txt\",\"fileSize\":750,\"ownerName\":\"Thomaster\",\"parentFolderPath\":\"Thomaster.homework_files\"}]}]}")
  }

  private fillMapWithTestData():void {
    this.map = new Map();

    this.map.set("Thomaster", '{"id":1,"relativePath":"Thomaster","originalName":"Thomaster","fileSize":1583,"ownerId":1,"parentFolderPath":"","containedFiles":[{"id":3,"relativePath":"Thomaster.holiday_pictures","originalName":"holiday pictures","ownerId":1,"parentFolderPath":"Thomaster","size":333,"folder":true},{"id":2,"relativePath":"Thomaster.homework_files","originalName":"homework files","ownerId":1,"parentFolderPath":"Thomaster","size":1250,"folder":true}]}');
    this.map.set("Thomaster.homework_files", '{"id":2,"relativePath":"Thomaster.homework_files","originalName":"homework files","fileSize":1250,"ownerId":1,"parentFolderPath":"Thomaster","containedFiles":[{"id":4,"relativePath":"Thomaster.homework_files.history","originalName":"history.txt","ownerId":1,"parentFolderPath":"Thomaster.homework_files","size":500,"folder":false},{"id":5,"relativePath":"Thomaster.homework_files.chemistry","originalName":"chemistry.txt","ownerId":1,"parentFolderPath":"Thomaster.homework_files","size":750,"folder":false}]}');
    this.map.set("Thomaster.holiday_pictures", '{"id":3,"relativePath":"Thomaster.holiday_pictures","originalName":"holiday pictures","fileSize":333,"ownerId":1,"parentFolderPath":"Thomaster","containedFiles":[{"id":7,"relativePath":"Thomaster.holiday_pictures.italy","originalName":"italy.jpg","ownerId":1,"parentFolderPath":"Thomaster.holiday_pictures","size":333,"folder":false},{"id":6,"relativePath":"Thomaster.holiday_pictures.2019","originalName":"2019","ownerId":1,"parentFolderPath":"Thomaster.holiday_pictures","size":0,"folder":true}]}');
    this.map.set("Thomaster.holiday_pictures.2019", '{"id":6,"relativePath":"Thomaster.holiday_pictures.2019","originalName":"2019","fileSize":0,"ownerId":1,"parentFolderPath":"Thomaster.holiday_pictures","containedFiles":[]}');
    this.map.set("Thomaster.homework_files.history", '{"id":4,"relativePath":"Thomaster.homework_files.history","originalName":"history.txt","fileSize":500,"ownerId":1,"parentFolderPath":"Thomaster.homework_files"}');
    this.map.set("Thomaster.homework_files.chemistry", '{"id":7,"relativePath":"Thomaster.holiday_pictures.italy","originalName":"italy.jpg","fileSize":333,"ownerId":1,"parentFolderPath":"Thomaster.holiday_pictures"}');
    this.map.set("Other", '{"id":8,"relativePath":"Other","originalName":"Other","fileSize":933,"ownerId":2,"parentFolderPath":"","containedFiles":[{"id":11,"relativePath":"Other.Backstreet_Boys_I_want_it_that_way","originalName":"Backstreet_Boys - I want it that way.mp4","ownerId":2,"parentFolderPath":"Other","size":333,"folder":false},{"id":9,"relativePath":"Other.books","originalName":"books","ownerId":2,"parentFolderPath":"Other","size":600,"folder":true}]}');
    this.map.set("Other.books", '{"id":9,"relativePath":"Other.books","originalName":"books","fileSize":600,"ownerId":2,"parentFolderPath":"Other","containedFiles":[{"id":10,"relativePath":"Other.books.Harry_Potter_and_Prisoner_of_Azkaban","originalName":"Harry Potter and Prisoner of Azkaban.pdf","ownerId":2,"parentFolderPath":"Other.books","size":600,"folder":false}]}');
    this.map.set("Other.books.Harry_Potter_and_Prisoner_of_Azkaban", '{"id":10,"relativePath":"Other.books.Harry_Potter_and_Prisoner_of_Azkaban","originalName":"Harry Potter and Prisoner of Azkaban.pdf","fileSize":600,"ownerId":2,"parentFolderPath":"Other.books"}');
    this.map.set("Other.Backstreet_Boys_I_want_it_that_way", '{"id":11,"relativePath":"Other.Backstreet_Boys_I_want_it_that_way","originalName":"Backstreet_Boys - I want it that way.mp4","fileSize":333,"ownerId":2,"parentFolderPath":"Other"}');
  }
}
