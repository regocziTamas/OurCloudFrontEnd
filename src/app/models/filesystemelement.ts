export class FileSystemElement {

    public id: number
    public relativePath: string
    public originalName: string
    public fileSize: number
    public ownerId: number
    public parentFolderPath: string

    constructor(sourceJSON: JSON) {
        this.id = sourceJSON["id"]
        this.relativePath = sourceJSON["relativePath"]
        this.originalName = sourceJSON["originalName"]
        this.fileSize = sourceJSON["fileSize"]
        this.ownerId = sourceJSON["ownerId"]
        this.parentFolderPath = sourceJSON["parentFolderPath"]
    }
}
