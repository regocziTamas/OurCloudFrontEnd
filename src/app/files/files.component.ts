import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FileService } from '../services/file/file.service';
import { FileSystemElement } from '../models/filesystemelement';
import { Breadcrumb } from './breadcrumb';
import { Folder } from '../models/folder';
import { MatDialog } from '@angular/material/dialog';
import { YesNoDialog } from './yesnodialog';
import { DummyFolder } from '../models/dummyfile';
import { ContainedFse } from '../models/contained-fse';
import { catchError } from 'rxjs/operators';
import * as FileSaver from 'file-saver';
import { AuthService } from '../auth/authservice/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from "@angular/common";
import { pairwise, tap, filter } from 'rxjs/operators';


export interface DialogData {
  parentFolder: string;
  conflictingFSEName: string;
  conflictingFSEType: string;
}

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

  modelToShow: FileSystemElement = new DummyFolder()
  breadcrumb: Breadcrumb = new Breadcrumb();
  errorExists : boolean = false;
  errorMsg : string = "";

  constructor(private http: HttpClient,
    private fileService: FileService,
    public dialog: MatDialog,
    public authService : AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(res => {
      this.requestFileSystemElement(res.file).subscribe(
        model => {
          let previousModel : FileSystemElement = this.modelToShow
          this.modelToShow = model 
          if(this.modelToShow.relativePath.length > previousModel.relativePath.length) {
            this.breadcrumb.pushElement(this.modelToShow.relativePath, this.modelToShow.originalName)
          } 
          else {
            this.breadcrumb.removeElementsUntilAndGetRemovedCount(this.modelToShow.relativePath)
          }
        },
        err => {
          this.showErrorMsg(err)
        }
      )
    })
  }
  

  onModelChange(pathToNewModel: string) {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: {file: pathToNewModel}});
  }

  onFileUpload(fileUploadHappened : boolean) {
    this.requestFileSystemElement(this.modelToShow.relativePath).subscribe(
      model => {
      this.modelToShow = model 
      },
      err => {
        this.showErrorMsg(err)
      });
  }


  onUploadError(errorMsg : HttpErrorResponse) {
    this.showErrorMsg(errorMsg);
  }

  
  onFolderUpload_old(newFolderName : string) {
    let unique : boolean = this.fileService.isFolderNameTakenInFolder(this.modelToShow as Folder, newFolderName)
    
    if(!unique) {
      this.openConfirmOverrideDialog(this.modelToShow.originalName, newFolderName, "Folder").subscribe(confirmation => {
        if(confirmation) {
          this.fileService.sendUploadFolderRequest(newFolderName, this.modelToShow as Folder).subscribe(res => {
            this.requestFileSystemElement(this.modelToShow.relativePath).subscribe(model => {
              this.modelToShow = model 
            });
          })
        } else {
          console.log("Name not unique, user denied override, no upload happens")
        }
      });
    }
    else {
      this.fileService.sendUploadFolderRequest(newFolderName, this.modelToShow as Folder).subscribe(res => {
        this.requestFileSystemElement(this.modelToShow.relativePath).subscribe(model => {
          this.modelToShow = model 
        });
      });
    }
  }

  onFolderUpload(folderUploadHappened : boolean) {
    this.requestFileSystemElement(this.modelToShow.relativePath).subscribe(
      model => {
        this.modelToShow = model 
      },
      err => {
        this.showErrorMsg(err)
      });
  }


  onNavigateBreadcrumb(path: string) {
    let removedElementCount : number = this.breadcrumb.removeElementsUntilAndGetRemovedCount(path);

    if(removedElementCount !== 0) {
      window.history.go(removedElementCount * -1)
    }
  }


  openConfirmOverrideDialog(parentFolder: string, conflictingFSEName: string, conflictingFSEType: string): Observable<any> {
    let msg = `Folder "${parentFolder}" already has a ${conflictingFSEType} with the name "${conflictingFSEName}" ! Do you want to override?`;

    const dialogRef = this.dialog.open(YesNoDialog, {
      width: '400px',
      data: {msg}
    });

    return dialogRef.afterClosed()
  }


  onDownloadFileEvent(fileToDownload : ContainedFse) {
    this.fileService.sendDownloadRequest(fileToDownload)
    .subscribe(
      result => {
        let file = new File([result], fileToDownload.originalName, {type: fileToDownload.mimeType});
        FileSaver.saveAs(file, fileToDownload.originalName)   
      },
      err => {
        this.showErrorMsg(err)
      }
    )
  }


  onDeleteFileEvent(fileToDelete : ContainedFse) {
    this.fileService.sendDeleteRequest(fileToDelete).subscribe(result => {
      this.requestFileSystemElement(this.modelToShow.relativePath).subscribe(model => {
        this.modelToShow = model 
      },
      err => {
        this.showErrorMsg(err);
      });
      return result;
    })
  }


  requestFileSystemElement(path : string) : Observable<FileSystemElement> {
    return this.fileService.getFileSystemElement(path);
  }

  showErrorMsg(error : HttpErrorResponse) {
    this.errorExists = true;

    if(error.status >= 400 && error.status < 500) {
      if(error.error instanceof Blob) {
        let blobError : Blob = error.error
        blobError.text().then(text => this.errorMsg = text)
      } else {
        this.errorMsg = error.error;
      }
    } else {
      this.errorMsg = "There has been an internal error, we are sorry for the inconveniences!";
    }
  }

  dismissError() {
    this.errorExists = false;
    this.errorMsg = "";
  }
}






