import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatInputModule} from '@angular/material/input';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LiveComponent } from './live/live.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { WelcomeComponent } from './welcome/welcome.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MomentModule } from 'ngx-moment';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider'
import {MatChipsModule} from '@angular/material/chips';
import {MatListModule} from '@angular/material/list';

@NgModule({
  declarations: [
    AppComponent,
    LiveComponent,
    WelcomeComponent
  ],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatIconModule,
    MatDividerModule,
    MomentModule,
    HttpClientModule,
    MatChipsModule,
    MatListModule,

  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


