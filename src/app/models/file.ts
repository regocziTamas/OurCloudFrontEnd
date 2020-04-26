import { FileSystemElement } from './filesystemelement';

export class OCFile extends FileSystemElement {

    mimeType : string;

    constructor(sourceJSON: JSON) {
        super(sourceJSON)
        this.mimeType = sourceJSON['mimeType']
    }

}
