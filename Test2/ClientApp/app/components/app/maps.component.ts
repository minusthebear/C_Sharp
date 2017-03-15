import { Component, Input, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { GoogleMapClass } from './google_map_class';
import { Observable } from 'rxjs/Rx';

@Component({
    template: require('./maps.component.html')
})

export class MapsComponent implements OnInit {
    search: string;
    searchTerm: string;
    results: Observable<string[]>;
    fullname: string;
    cityname: string;
    latitude: number;
    longitude: number;
    searchCompleted: boolean;
    goog: GoogleMapClass;

    constructor(private searchService: SearchService) {
    }

    ngOnInit(): void {
        this.search = "Enter a city or location in the search box. Please be as accurate as possible, (i.e. \"Santa Cruz\" should be \"Santa Cruz, California\" or \"Santa Cruz, Costa Rica\")";
        this.searchCompleted = false;
    }
   
    searchWord(x): void {
        this.searchService.getPlaces(x)
            .subscribe(info => this.parseInfo(info));
    }

    private parseInfo(x) {
        try {
            this.goog = x;
            this.fullname = this.goog['formatted_address'];
            this.cityname = this.goog['name'];
            this.latitude = this.goog['location']['lat'];
            this.longitude = this.goog['location']['lng'];

            this.searchCompleted = true;
        } catch (e) {
            console.log(e);
        }

    }
}
