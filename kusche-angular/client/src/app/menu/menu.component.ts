import { Component, ViewChild } from '@angular/core';
import { KuscheService, Element } from '../kusche.service';
import { OnInit } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { NavigationService } from '../navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';

interface MenuItem extends Element {
    id: number
}

const compress = (e: Element): Element => {
    const clone = JSON.parse(JSON.stringify(e)) as Element;
    if ((!clone.href || !clone.text || clone.text.match(/\[\d+\]/)) && clone.children?.length) {
        if (clone.children.length <= 1) {
            const children = clone.children.map(compress);
            clone.href = children.filter(c => c.href)[0]?.href || null;
        }
        let match = clone.text.match(/\[(?<i>\d+)\]/);
        while (match) {
            const i = Number(match.groups?.["i"]) || 0;
            clone.text = clone.text.replace(`[${i}]`, compress(clone.children[i]).text);
            match = clone.text.match(/\[(?<i>\d+)\]/);
        }
    }
    clone.text = clone.text.replace("...", "");
    return clone;
}

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
    title?: Element;
    menu: MenuItem[] = [];
    submenu: MenuItem[] = [];
    selected: number = 0;

    urlBuffer: ReplaySubject<string> = new ReplaySubject<string>();
    current?: MenuItem;

    @ViewChild(MatMenu) matMenu?: MatMenu;

    constructor(
        private kusche: KuscheService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.kusche.get("nav.html").subscribe(res => {
            this.title = compress(res.filter(e => e.type === "FONT")[0]);
            res.filter(e => e.type !== "FONT").forEach((e, i) => {
                this.menu.push(Object.assign(compress(e), {
                    id: i
                }));
                this.submenu.push(...(e.children?.[0].children?.map(compress).map(sub => Object.assign(sub, {
                    id: i
                })) || []));
            })
            this.urlBuffer.subscribe(url => {
                this.current = this.submenu.concat(this.menu).find(s => url === s.href);
            })
        })
        this.router.events.subscribe(() => {
            this.urlBuffer.next(this.router.url.replace(/.*\//, ""));
        });
    }

    navigate(url: string): number {
        this.router.navigateByUrl(url);
        return -1;
    }
}
