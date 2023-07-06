import { Pipe, PipeTransform } from '@angular/core';
import { Element } from './kusche.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

const iconMap = {
    "pdf": "description",
    "c": "code",
    "cpp": "code"
} as {[key: string]: string}

@Pipe({
    name: 'compress'
})
export class CompressPipe implements PipeTransform {
    constructor(
        private sanitizer: DomSanitizer,
        private route: ActivatedRoute
    ){}

    transform(value: Element, asString?: boolean): SafeHtml | string {
        if (value.type === "BR") return "<br>";
        let str = value.text;
        if (value.children) {
            let match = str.match(/\[(?<i>\d+)\]/);
            let i = 0;
            while (match) {
                i = Number(match.groups?.["i"]) || 0;
                str = str.replace(`[${i}]`, this.transform(value.children?.[i], true) as string);
                match = str.match(/\[(?<i>\d+)\]/);
            }
        }
        if (value.type === "A") {
            str = `<mat-icon class="inline mat-icon notranslate material-icons mat-ligature-font mat-icon-no-color">${iconMap[value.href?.replace(/.*\./, "") || ""] || "link"}</mat-icon><span>${str}</span>`;
        }
        if (value.href?.match(/^.*\.\w{1,3}$/)) {
            // file
            str = `<${value.type} href="${window.location.pathname}?view=${encodeURIComponent(value.href)}">${str}</${value.type}>`;
        } else {
            // link
            str = `<${value.type} href="${value.href}" ${value.href?.includes('http') ? 'target="_blank"' : ''}>${str}</${value.type}>`;
        }
        return asString ? str : this.sanitizer.bypassSecurityTrustHtml(str);
    }

}
