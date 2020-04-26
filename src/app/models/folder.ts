import { FileSystemElement } from './filesystemelement';
import { ContainedFse } from './contained-fse';

export class Folder extends FileSystemElement{

    containedFiles: ContainedFse[]

    constructor(sourceJSON: JSON) {
        super(sourceJSON)

        var files: JSON[] = sourceJSON["containedFiles"]

        this.containedFiles = Folder.parseContainedFiles(files)
    }

    public static parseContainedFiles(sourceJSONs : JSON[]) : ContainedFse[] {
        let result: ContainedFse[] = new Array()
        
        for(let fse of sourceJSONs) {
            result.push(new ContainedFse(fse));
        }

        return result.sort(ContainedFse.compareTwo);
    }

}
