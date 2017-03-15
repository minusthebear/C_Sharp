import {Component, Input, OnInit} from '@angular/core';
import { SearchService } from './search.service';
import { GoogleMapClass, CurrentWeatherClass, WikiClass, FullClass } from './google_map_class';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

@Component({
    template: require('./search_input.component.html'),
    styles: [require('./search_input.component.css')]
})

export class SearchInputComponent implements OnInit {
    search: string;
    searchTerm: string;
    results: Observable<string[]>;
    thingy: Object;
    fullname: string;
    cityname: string;
    latitude: number;
    longitude: number;
    searchCompleted: boolean;
    goog: GoogleMapClass;
    c_w: CurrentWeatherClass;
    wiki: WikiClass;
    weather: string;
    info: string;
    parsedInfo: string;
    wikiStream = new Subject<string>();
    theHtml: string;



    constructor(private searchService: SearchService) {
    }

    ngOnInit(): void {
        this.search = "Here is the search box";
        this.searchCompleted = false;

        this.results = this.wikiStream
            .debounceTime(500)
            .distinctUntilChanged()
            .switchMap((x: string) => this.searchService.searchWiki(x));
    }

    getWikiInfo(x: string): void {
        var check;
        this.searchService.getWikiInfo(x)
            .subscribe(info => this.parseWikiValues(info));  
    }

    parseWikiValues(x: Object): void {
        var w;
        console.log(x['query']);
        try {
            var y = x['query']['pages'];
            for (var z in y) { 
                w = y[z]['extract'];
            }
        } catch (e) {
            console.log(e);
        } finally {
            this.theHtml = w;
        }
    }

    searchWord(x): void {
        
        this.searchService.getPlaces(x)
            .subscribe(info => this.showConsole(info));
        
    }

    showConsole(x) {
        try {
            var y = x['results'][0];
            this.goog = {
                name: y['name'],
                formatted_address: y['formatted_address'],
                location: {
                    lat: y['geometry']['location']['lat'],
                    lng: y['geometry']['location']['lng']
                },
                id: y['id']
            };

            this.searchCompleted = true;

            this.fullname = this.goog['formatted_address'];
            this.cityname = this.goog['name'];
            this.latitude = this.goog['location']['lat'];
            this.longitude = this.goog['location']['lng'];

            this.searchService.getWeatherLocation(this.latitude, this.longitude)
                .subscribe(info => this.searchCity(info));
        } catch (e) {
            console.log(e);
        }
        
    }

    searchCity(x: any): void {
        if ('location' in x) {
            var y = x['location'];

            if (y['country'] === 'US') {
                this.searchService.getWeather(y['city'], y['state'], true)
                    .subscribe(info => this.parseWeatherInfo(info));
            } else {
                this.searchService.getWeather(y['city'], y['country'], false)
                    .subscribe(info => this.parseWeatherInfo(info));
            }
        }
    }
    
    wikiSearch(x: string): void {
        this.wikiStream.next(x);
    }
    
    parseWeatherInfo(x: JSON): void {
        try {
            var y = x['current_observation'];

            this.c_w = {
                weather: y['weather'],
                icon_url: y['icon_url'],
                temperature_string: y['temperature_string'],
                temp_c: y['temp_c'],
                feelslike_c: y['feelslike_c'],
                temp_f: y['temp_f'],
                feelslike_f: y['feelslike_f'],
                relative_humidity: y['relative_humidity'],
                windchill_c: y['windchill_c'],
                windchill_f: y['windchill_f'],
                windchill_string: y['windchill_string'],
                wind_kph: y['wind_kph'],
                wind_mph: y['wind_mph'],
                precip_today_in: y['precip_today_in'],
                precip_today_metric: y['precip_today_metric'],
                precip_today_string: y['precip_today_string']
            };
        } catch (e) {
            console.log(e);
        } finally {
            this.weather = JSON.stringify(this.c_w);
        }
    }
}
