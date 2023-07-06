import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-file-viewer',
    templateUrl: './file-viewer.component.html',
    styleUrls: ['./file-viewer.component.scss']
})
export class FileViewerComponent implements OnInit {
    constructor(
        public dialog: MatDialogRef<FileViewerComponent>,
        @Inject(DIALOG_DATA) public url: string
    ) {}
    ngOnInit(): void {
        console.log(this.url);
    }
}
