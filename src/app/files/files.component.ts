import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileService } from '../services/file/file.service';
import { FileSystemElement } from '../models/filesystemelement';
import { Breadcrumb } from './breadcrumb';
import { Folder } from '../models/folder';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { YesNoDialog } from './yesnodialog';
import { DummyFolder } from '../models/dummyfile';
import { DomSanitizer } from '@angular/platform-browser';
import * as FileSaver from 'file-saver';
import { ContainedFse } from '../models/contained-fse';


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

  constructor(private http: HttpClient,
    private fileService: FileService,
    public dialog: MatDialog) {
    
  }

  ngOnInit() {
    this.fileService.getFileSystemElement("Thomaster").subscribe(model => {
      this.modelToShow = model 
      this.breadcrumb.pushElement(this.modelToShow.relativePath, this.modelToShow.originalName);
    });
  }
  

  onModelChange(pathToNewModel: string) {
    console.log("On model change called")
    this.fileService.getFileSystemElement(pathToNewModel).subscribe(model => {
        this.modelToShow = model 
        this.breadcrumb.pushElement(this.modelToShow.relativePath, this.modelToShow.originalName);
    });
  }


  onFileUpload(fileUploadHappened : boolean) {
    this.fileService.getFileSystemElement(this.modelToShow.relativePath).subscribe(model => {
      this.modelToShow = model 
    });
  }

  
  onFolderUpload(newFolderName : string) {
    let unique : boolean = this.fileService.isFolderNameTakenInFolder(this.modelToShow as Folder, newFolderName)
    
    if(!unique) {
      this.confirmOverrideDialog(this.modelToShow.originalName, newFolderName, "Folder").subscribe(confirmation => {
        if(confirmation) {
          this.fileService.sendUploadFolderRequest(newFolderName, this.modelToShow as Folder).subscribe(res => {
            this.fileService.getFileSystemElement(this.modelToShow.relativePath).subscribe(model => {
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
        this.fileService.getFileSystemElement(this.modelToShow.relativePath).subscribe(model => {
          this.modelToShow = model 
        });
      });
    }
  }


  onNavigateBreadcrumb(path: string) {
    this.fileService.getFileSystemElement(path).subscribe(model => {
      this.modelToShow =  model
      this.breadcrumb.removeElementsUntil(path);
    });
  }


  confirmOverrideDialog(parentFolder: string, conflictingFSEName: string, conflictingFSEType: string): Observable<any> {
    let msg = `Folder "${parentFolder}" already has a ${conflictingFSEType} with the name "${conflictingFSEName}" ! Do you want to override?`;

    const dialogRef = this.dialog.open(YesNoDialog, {
      width: '400px',
      data: {msg}
    });

    return dialogRef.afterClosed()
  }


  onDownloadFileEvent(fileToDownload : ContainedFse) {
    this.fileService.sendDownloadRequest(fileToDownload).subscribe(result => {

      let file = new File([result], fileToDownload.originalName, {type: fileToDownload.mimeType});

      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob([result], {type: fileToDownload.mimeType}));

      downloadLink.setAttribute('download', fileToDownload.originalName);
      document.body.appendChild(downloadLink);
      downloadLink.click();

      //FileSaver.saveAs(file, fileToDownload.originalName)   
    })
  }


  onDeleteFileEvent(fileToDelete : ContainedFse) {
    console.log("File to delete " + fileToDelete.originalName);
    this.fileService.sendDeleteRequest(fileToDelete).subscribe(result => {
      console.log(result);
      this.fileService.getFileSystemElement(this.modelToShow.relativePath).subscribe(model => {
        this.modelToShow = model 
      });
      return result;
    })
  }
}






