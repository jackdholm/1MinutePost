import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { PostComponent } from './post/post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule } from '@angular/material';
import { PostContainerComponent } from './post-container/post-container.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { CountdownGlobalConfig, CountdownModule } from 'ngx-countdown';
import { MatGridListModule } from '@angular/material/grid-list';
import { LoginComponent } from './login/login.component';
import { LoginPopupComponent } from './login-popup/login-popup.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    PostComponent,
    PostContainerComponent,
    PostCreateComponent,
    LoginComponent,
    LoginPopupComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot
      ([
        { path: '', component: PostContainerComponent, pathMatch: 'full' }
      ]),
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    CountdownModule,
    MatGridListModule,
    MatDialogModule
  ],
  providers: [CountdownGlobalConfig],
  bootstrap: [AppComponent],
  entryComponents: [LoginPopupComponent]
})
export class AppModule { }
