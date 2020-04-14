import { BreadcrumbElement } from './breadcrumb-element';

export class Breadcrumb {

    public crumbs: BreadcrumbElement[] = new Array();

    pushElement(path: string, name: string) {
        this.crumbs.push(new BreadcrumbElement(path, name));
    }

    removeElementsUntil(path: string) {
        this.crumbs = this.crumbs.filter(e => e.path.length <= path.length)
    }


}
