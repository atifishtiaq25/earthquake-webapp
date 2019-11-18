import {Component, ViewChild, OnInit, Input } from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Location, Appearance} from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import {MapComponentApiService} from './map-component/map-component.service';
import { FormControl } from '@angular/forms';
import { DataList } from './dataList.model';
import { MatSnackBar } from "@angular/material";


@Component({
  selector: 'app-root', 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;
  @ViewChild('sidenavright', {static: false}) sidenavright: MatSidenav;

  latitude = 52.5200;
  longitude = 13.4050; 
  radiuskm = 50;
  magnitude: number = 0;

  locationChosenbyPlace = false;
  locationChosenbyMagnitude = false;

  noEarthquakesDetected: boolean ;
  dataList: DataList;
  todaysDataList: DataList;
  todaysdataLoaded: boolean = false;

  autoCompleteCities =   [
    {
      name: "Berlin",
      lat: "52.5200",
      lng: "13.4050"
    },
    {
      name: "Munich",
      lat: "48.1351",
      lng: "11.5820"
    },
    {
      name: "New York",
      lat: "40.7128",
      lng: "-74.0060"
    },
    {
      name: "London",
      lat: "51.5074",
      lng: "0.1278"
    },
    {
      name: "Sydney",
      lat: "-33.8688",
      lng: "151.2093"
    }
  ]

  constructor(    
    private mapServiceApi: MapComponentApiService,
    public snackBar: MatSnackBar
    ) { 
  }

ngOnInit () {
  this.getTodaysIncidents();   
}

// Prepdata for the current day's incidents' call on the page load for earthquakes in the right side nav
getTodaysIncidents() {
  var d = new Date();
  var date = d.getDate();
  var month = d.getMonth();
  var year = d.getFullYear();
  var secondaryDate: number = date;
  var secondaryMonth: number = month;
  var secondaryYear: number = year;

  if (date != 1 && month != 1) {
    secondaryDate = secondaryDate - 1;
  }
  else if (date != 1 && month == 1 ) {
    secondaryDate = secondaryDate - 1;
  }
  else if (date == 1 && month != 1) {
    secondaryMonth = secondaryMonth - 1;
    secondaryDate = 28;
  }
  else {
    secondaryMonth = 12;
  secondaryDate = 31;
    secondaryYear = secondaryYear -1;
  } 

 this.mapServiceApi.getDataForMagnitudeSearch(Math.round(this.magnitude)).subscribe ((res: DataList) => {
    this.todaysDataList = res;
    this.todaysdataLoaded = true;
  })
}

//Trigered when a place is selected on the auto complete search bar
  onAutocompleteSelected(city) {
    console.log('onLocationSelected: ', typeof(city), city);
    let cityObject = this.autoCompleteCities.filter(item => 
      item.name == city
    );
    console.log(cityObject)
    this.longitude = parseInt(cityObject[0].lng);
    this.latitude = parseInt(cityObject[0].lat);
    this.onChosenLocation();
  }

//Trigered when a place is selected on the map
  onLocationSelected(event) {
    console.log('onLocationSelected: ', event);

    this.longitude = event.coords.lng;
    this.latitude = event.coords.lat;
    this.onChosenLocation();
  }

//Trigerred when pressed the 'Find!' button in the left side nav bar by place
  onChosenLocation() {
    this.mapServiceApi.getDataForCircle(Math.round(this.latitude), Math.round(this.longitude), Math.round(this.radiuskm)).subscribe ((res : DataList) => {
      console.log(res);
      this.dataList = res;

      this.noEarthquakesDetected = false;
      if (this.dataList.features == undefined || this.dataList.features == null || this.dataList.features.length == 0 ) {
        this.noEarthquakesDetected = true;
        //pushing an empy object with only map clicked coordinates to show the marker on the map
        this.dataList.features = [];
        this.dataList.features.push({
          type: null,
          properties:{
            mag: 0,
            place: null,
            time: null,
            updated: null,
            tz: null,
            url: null,
            detail: null,
            felt: null,
            cdi: null,
            mmi: null,
            alert: null,
            status: null,
            tsunami: null,
            sig: null,
            net: null,
            code: null,
            ids: null,
            sources: null,
            types: null,
            nst: null,
            dmin: null,
            rms: null,
            gap: null,
            magType: null,
            type: null
          },
          geometry: {
            id: null,
            type: null,
            coordinates: [this.longitude, this.latitude, null]
          },
          id: null
        });
        
        this.locationChosenbyMagnitude = false;
        this.locationChosenbyPlace = true;

        this.openSnackBar('No earthquakes detected in given paramenter!', 'Ok!')
        console.log('No earthquakes detected in given paramenter!');
        console.log(this.dataList);
      }
    })
  }

//Trigerred when pressed the 'Find!' button in the left side nav bar by magnitutde
  searchByMagnitude() {
    this.mapServiceApi.getDataForMagnitudeSearch(Math.round(this.magnitude)).subscribe ((res: DataList) => {
      console.log(res);
      this.dataList = res;

      this.locationChosenbyPlace = false;
      this.locationChosenbyMagnitude = true;
    })  
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
       duration: 5000,
    });
  } 

  close() {
    this.sidenav.close();
  }
}
  