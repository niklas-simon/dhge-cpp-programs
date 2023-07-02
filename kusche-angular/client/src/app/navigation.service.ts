import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private page: Subject<string> = new ReplaySubject();

    navigate(page: string) {
        this.page.next(page);
    }

    getSubject() {
        return this.page;
    }
    
    constructor() {
        this.page.next("prog-cpp.html")
    }
}
