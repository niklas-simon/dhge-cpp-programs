import { Component, Input, OnInit } from '@angular/core';
import { Element, KuscheService } from '../kusche.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-page-element',
    templateUrl: './page-element.component.html',
    styleUrls: ['./page-element.component.scss']
})
export class PageElementComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private kusche: KuscheService
    ) {}

    @Input() element?: Element;
    root: Element = {
        text: "root",
        type: "ROOT",
        href: null,
        children: []
    }

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
    }
}
