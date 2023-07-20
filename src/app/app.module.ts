import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import {ErrorInterceptor} from "./shared/core/interceptors/error.interceptor";
import {MatSnackBarModule} from "@angular/material/snack-bar";

const routes: Routes = [
  {
    path: 'arena',
    loadComponent: () => import('./pages/arena-page/arena-page.component').then((x) => x.ArenaPageComponent),
  },
  { path: '', redirectTo: 'arena', pathMatch: 'full' },
  { path: '**',redirectTo: 'arena' },
]

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MatToolbarModule,
    MatButtonToggleModule,
    ToolbarComponent,
    MatSnackBarModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
