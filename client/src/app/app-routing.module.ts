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
    // we have an issue with the map layer not reloading, 
    path: 'live',
    component: LiveComponent  ,
    redirectTo: 'live/none'
  },
  {
    path: '**',
    redirectTo: 'live/none'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
