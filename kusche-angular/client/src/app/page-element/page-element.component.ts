import { Component, Input, OnInit } from '@angular/core';
import { Element, KuscheService } from '../kusche.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FileViewerComponent } from '../file-viewer/file-viewer.component';
import { map } from 'rxjs';

@Component({
    selector: 'app-page-element',
    templateUrl: './page-element.component.html',
    styleUrls: ['./page-element.component.scss']
})
export class PageElementComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private kusche: KuscheService,
        private dialog: MatDialog
    ) {}

    @Input() element?: Element;
    root: Element = {
        text: "root",
        type: "ROOT",
        href: null,
        children: []
    }

    @Input() params?: Params;

    getA = (e?: Element) : Element | undefined => {
        if (!e) {
            return;
        }
        if (e.type === "A") {
            return e;
        }
        return this.getA(e.children?.[0]);
    } 
    
    getLast = (e: Element) : Element => {
        if (e.children?.length) {
            return this.getLast(e.children[0]);
        }
        return e;
    }

    hasView(e: Element) : boolean {
        return (e.type == "A" ? encodeURI(e.href || "").includes(encodeURI(this.params?.['view'])) : e.children?.some(e => this.hasView(e))) || false;
    }

    ngOnInit(): void {
        if (this.element) {
            this.root.children = [this.element];
            return;
        }
        this.route.params.subscribe(params => this.kusche.get(params["site"]).subscribe(res => {
            if (!this.element) {
                this.root.children = res;
            }
        }));
        if (!this.params) {
            this.route.queryParams.subscribe(params => {
                this.params = params;
                if (params['view']) {
                    this.dialog.open(FileViewerComponent, {
                        data: params['view'],
                        height: "90vh",
                        width: "90vw"
                    });
                }
            });
        }
    }
}
