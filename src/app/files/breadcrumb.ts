import { BreadcrumbElement } from './breadcrumb-element';

export class Breadcrumb {

    public crumbs: BreadcrumbElement[] = new Array();

    pushElement(path: string, name: string) {
        this.crumbs.push(new BreadcrumbElement(path, name));
    }

    removeElementsUntilAndGetRemovedCount(path: string) : number{
        let previousCount = this.crumbs.length;
        this.crumbs = this.crumbs.filter(e => e.path.length <= path.length)

        return previousCount - this.crumbs.length;
    }


}
