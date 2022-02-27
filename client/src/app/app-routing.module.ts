import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveComponent } from './live/live.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {
    path : 'live/:trackingId',
    component: LiveComponent  
  },
  {
    path: '',
    component: WelcomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
