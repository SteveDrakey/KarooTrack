import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subscription, timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as L from 'leaflet';
import  'leaflet-rotatedmarker'

import * as polyUtil from 'polyline-encoded';

import { ActivityStatus } from 'src/types';
import { LatLngExpression } from 'leaflet';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements AfterViewInit, OnDestroy {
  map: any;
  polyline: any;
  routePolylineLayer: any;
  routePolyline: any;

  trackingId: string;
  subscription: Subscription = new Subscription();
  currentLocationMarker: L.Marker;
  mapLoaded = false;
  defaultIcon: L.Icon<L.IconOptions>;

  public ngAfterViewInit(): void {
    console.log('load map', this.mapLoaded);
    if (!this.mapLoaded) this.loadMap();
    this.mapLoaded = true;
  }

  public liveTracking: ActivityStatus;

  constructor(public route: ActivatedRoute, private router: Router, private http: HttpClient, private _snackBar: MatSnackBar) {

    this.defaultIcon = new L.Icon({
      iconUrl: 'assets/outline_location_on_black_24dp.png',
      iconSize: [48, 48], // size of the icon
      iconAnchor: [24, 24], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -51] // point from which the popup should open relative to the iconAnchor                                 
  });

    const reloadTimer = timer(5000, 5000);

    this.subscription.add(reloadTimer.subscribe(async val => {
      try {
        this.liveTracking = await http.get<ActivityStatus>(`https://storagekarootrack.blob.core.windows.net/tracking/${this.trackingId}`).toPromise();
        this.updateTracking();
      } catch {
        console.log('Error during timer, maybe tracking os not setup?');
      }
    }));

    this.route.params.subscribe(async params => {
      this.trackingId = params.trackingId;
      http.get<ActivityStatus>(`https://storagekarootrack.blob.core.windows.net/tracking/${this.trackingId}`).subscribe(async liveTracking => {
        this.liveTracking = liveTracking;
        this.updateTracking();

      }, async error => {
        try {
          await this._snackBar.open('No ride tracking history found creating');
          var karooTracking = await http.get<ActivityStatus>(`/api/Register?token=${this.trackingId}`).toPromise();
          await this._snackBar.open(`Welcome ${karooTracking.riderName}`);
        }
        catch {
          await this._snackBar.open('Could not create user, did you enter the correct live tracking ID?');
        }
      });
    });
  }
  ngOnDestroy(): void {
    this.map.remove();
  }

  private loadMap(): void {
    this.map = L.map('map').setView([0, 0], 1);
    console.log('map', this.map);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/outdoors-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: environment.mapbox.accessToken,
    }).addTo(this.map);
  }
  private updateTracking() {

    if (!this.liveTracking) return;
    
    if (this.liveTracking.route) {

      if (this.routePolyline != this.liveTracking.route.routePolyline) {
        if (this.routePolyline) this.map.removeLayer(this.routePolyline);
        this.routePolyline = null;
      }

      if (!this.routePolylineLayer) {
        this.routePolyline = this.liveTracking.route.routePolyline;
        var latlngs = polyUtil.decode(this.liveTracking.route.routePolyline);
        this.routePolylineLayer = L.polyline(latlngs, { color: "orange", fillOpacity: 50, weight:8 }).addTo(this.map);
      }
    }

    if (!this.currentLocationMarker) {
      if (this.liveTracking.locations && this.liveTracking.locations.length > 0) {
        L.circleMarker(this.liveTracking.locations[0],{ radius: 15}).addTo(this.map);
      } else {
        L.circleMarker(this.liveTracking.location,{ radius: 15}).addTo(this.map);
      }
      // first time, we centre 
      this.map.setView([this.liveTracking.location.lat, this.liveTracking.location.lng], 16, false);
      this.currentLocationMarker = L.marker(this.liveTracking.location,{ rotationAngle: this.liveTracking.bearing, icon: this.defaultIcon}).addTo(this.map);
    }

    this.currentLocationMarker.setLatLng(this.liveTracking.location);
    this.currentLocationMarker.setRotationAngle(this.liveTracking.bearing);

    if (this.liveTracking?.locations?.length > 0) {
      if (this.polyline) {
        const currentLatLngs: [] = this.polyline.getLatLngs();
        if (this.liveTracking.locations.length > currentLatLngs.length) {
          this.liveTracking.locations.slice(currentLatLngs.length).forEach((f) => this.polyline.addLatLng([f.lat, f.lng]));
        }
      } else {
        this.polyline = L.polyline(this.liveTracking.locations).addTo(this.map);
      }
    }
  }
}

