import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public trackingId="";
  constructor(private http: HttpClient, private router: Router,private _snackBar: MatSnackBar) { 
    console.log('defaut');
  }

  ngOnInit(): void {
  }

  async go()  {
    this.trackingId = this.trackingId.split('/').pop();
    // do we have a user?
    try {
      const trackingUser =  await this.http.get(`https://storagekarootrack.blob.core.windows.net/tracking/${this.trackingId}`).toPromise();
      if (trackingUser) {
        this.router.navigate(['live',this.trackingId]);
      }
    }
    catch {
      console.log('user not found'); 
      // lets try to create
      try {
        console.log('creating users');
        var karooTracking : any = await this.http.get(`/api/Register?token=${this.trackingId}`).toPromise();
        await this._snackBar.open(`Welcome ${karooTracking.riderName}`);
        console.log('created user');
        this.router.navigate(['live',this.trackingId]);
      }
      catch {
        await this._snackBar.open('Could not create user, did you enter the correct live tracking ID?');
      }

    }
  }
}
