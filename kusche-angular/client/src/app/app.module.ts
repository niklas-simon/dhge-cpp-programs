import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MenuComponent } from './menu/menu.component';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FilterPipe } from './filter.pipe';
import { PageElementComponent } from './page-element/page-element.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CompressPipe } from './compress.pipe';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FileViewerComponent } from './file-viewer/file-viewer.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [
        AppComponent,
        MenuComponent,
        FilterPipe,
        PageElementComponent,
        PageNotFoundComponent,
        CompressPipe,
        FileViewerComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        HttpClientModule,
        MatMenuModule,
        MatButtonModule,
        MatExpansionModule,
        MatIconModule,
        PdfViewerModule,
        MatDialogModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
