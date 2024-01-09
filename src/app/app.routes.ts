import { Routes } from "@angular/router";
import { TinyUrlComponent } from "./features/tiny-url/tiny-url.component";

export const routes: Routes = [
    { path: 'tinyurl', component: TinyUrlComponent },
    { path: '', redirectTo: '/tinyurl', pathMatch: 'full' }, // Redirects to /tinyurl as the default route
];