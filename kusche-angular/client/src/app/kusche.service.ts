import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Element {
    type: string,
    text: string,
    href: string | null
    children: Element[] | undefined
}

@Injectable({
    providedIn: 'root'
})
export class KuscheService {

    constructor(private http: HttpClient) { }

    get(url: string): Observable<Element[]> {
        return this.http.get<Element[]>("/api/" + url);
    }
}
