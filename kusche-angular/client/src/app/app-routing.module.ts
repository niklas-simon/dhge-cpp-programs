import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageElementComponent } from './page-element/page-element.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
    {path: ":site", component: PageElementComponent},
    {path: "", redirectTo: "/prog-cpp.html", pathMatch: "full"},
    {path: "**", component: PageNotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
