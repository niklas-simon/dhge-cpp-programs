import { Component, OnInit } from '@angular/core';
import { NavigationService } from './navigation.service';
import { Element, KuscheService } from './kusche.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    elements: Element[] = []

    constructor(
        private navigator: NavigationService,
        private kusche: KuscheService
    ) {}

    ngOnInit(): void {
        this.navigator.getSubject().subscribe(page => {
            this.kusche.get(page).subscribe(elements => this.elements = elements);
        })
    }
}
