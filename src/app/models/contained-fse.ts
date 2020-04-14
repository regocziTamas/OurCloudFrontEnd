export class ContainedFse {

    private id: number
    private relativePath: String
    private originalName: String
    private ownerId: number
    private parentFolderPath: String
    private fileSize: number
    private isFolder: boolean

    constructor(sourceJSON: JSON) {
        this.id = sourceJSON["id"]
        this.relativePath = sourceJSON["relativePath"]
        this.originalName = sourceJSON["originalName"]
        this.ownerId = sourceJSON["ownerId"]
        this.parentFolderPath = sourceJSON["parentFolderPath"]
        this.fileSize = sourceJSON["size"]
        this.isFolder = sourceJSON["folder"]
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

    get getIsFolder() {
        return this.isFolder;
    }
}
