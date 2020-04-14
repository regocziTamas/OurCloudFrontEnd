export class FileSystemElement {

    private id: number
    private relativePath: string
    private originalName: string
    private fileSize: number
    private ownerId: number
    private parentFolderPath: string

    constructor(sourceJSON: JSON) {
        this.id = sourceJSON["id"]
        this.relativePath = sourceJSON["relativePath"]
        this.originalName = sourceJSON["originalName"]
        this.fileSize = sourceJSON["fileSize"]
        this.ownerId = sourceJSON["ownerId"]
        this.parentFolderPath = sourceJSON["parentFolderPath"]

    }

    get getId() {
        return this.id;
    }

    get getRelativePath() {
        return this.relativePath;
    }

    get getOriginalName() {
        return this.originalName;
    }

    get getOwnerId() {
        return this.ownerId;
    }

    get getParentFolderPath() {
        return this.parentFolderPath;
    }

    get getFileSize() {
        return this.fileSize;
    }
}
