import { Folder } from './folder';

export class DummyFolder extends Folder {
    constructor() {
        super(JSON.parse('{"id":0,"relativePath":"","originalName":"","fileSize":0,"ownerId":0,"parentFolderPath":"","containedFiles":[]}'))
        this.id = 0
        this.relativePath = ""
        this.originalName = ""
        this.fileSize = 0
        this.ownerId = 0
        this.parentFolderPath = ""
    }
}
