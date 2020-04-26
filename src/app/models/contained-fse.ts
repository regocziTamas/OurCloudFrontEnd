export class ContainedFse {

    public id: number
    public relativePath: string
    public originalName: string
    public ownerId: number
    public parentFolderPath: string
    public fileSize: number
    public isFolder: boolean
    public mimeType: string

    constructor(sourceJSON: JSON) {
        this.id = sourceJSON["id"]
        this.relativePath = sourceJSON["relativePath"]
        this.originalName = sourceJSON["originalName"]
        this.ownerId = sourceJSON["ownerId"]
        this.parentFolderPath = sourceJSON["parentFolderPath"]
        this.fileSize = sourceJSON["size"]
        this.isFolder = sourceJSON["folder"]
        this.mimeType = sourceJSON["mimeType"]
    }

    static compareTwo(fse1 : ContainedFse, fse2: ContainedFse) : number {
        if(fse1.isFolder && !fse2.isFolder){
            return -1
        }

        else if(!fse1.isFolder && fse2.isFolder) {
            return 1
        }

        else {
            return fse1.originalName.localeCompare(fse2.originalName)
        }
    }
}
