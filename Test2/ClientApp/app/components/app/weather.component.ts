import { Component, Input, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { CurrentWeatherClass, GoogleMapClass } from './google_map_class';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

@Component({
    template: require('./weather.component.html')
})

export class WeatherComponent implements OnInit {
    search: string;
    searchTerm: string;
    results: Observable<string[]>;
    searchCompleted: boolean;
    c_w: CurrentWeatherClass;
    goog: GoogleMapClass;
    weather: Array<any>;
    message: string;
    info: string;
    parsedInfo: string;
    showButtons: boolean;
    searchSatisfied: boolean;
    weatherLocs: any;
    warningMessage: boolean;



    constructor(private searchService: SearchService) {
    }

    ngOnInit(): void {
        this.search = "Enter a city or location in the search box. Please be as accurate as possible, (i.e. \"Santa Cruz\" should be \"Santa Cruz, California\" or \"Santa Cruz, Costa Rica\")";
        this.searchCompleted = false;
        this.warningMessage = false;
        this.showButtons = false;
        this.searchSatisfied = false;

        this.goog = this.searchService.returnGoog();

        if (!this.goog) {
            this.message = "Feel free to make a query, and you will receive the results!";
        } else {
            this.message = "You already have a location on file. Would you like to pull up information about your previous query?";
            this.showButtons = true;
        }        
    }

    confirm(x: boolean): void {
        if (x) {
            this.searchService.getWeatherLocation(this.goog['location']['lat'], this.goog['location']['lng'])
                .subscribe(info => this.searchCity(info));
        }
        this.message = "Feel free to make a query, and you will receive the results!";
        this.showButtons = false;
    }

    searchCity(x: any): void {
        this.searchService.getWeatherCities(x)
            .subscribe(x => {
                console.log(x);
                this.weatherLocs = x;
                this.searchCompleted = true;
                this.warningMessage = false;
                this.showButtons = false;
                this.searchSatisfied = false;
            }, err => {
                console.log(err);
            });
    }

    retrieveCity(x: any): void {
        console.log(x);
        this.search = "Please wait a moment while we retrieve your data....";
        if (x['country'] === 'US') {
            this.searchService.getWeather(x['city'], x['state'], true)
                .subscribe(info => this.parseWeatherInfo(info));
        } else {
            this.searchService.getWeather(x['city'], x['country'], false)
                .subscribe(info => this.parseWeatherInfo(info));
        }
    }

    parseWeatherInfo(x: JSON): void {
        this.search = "Enter a city or location in the search box. Please be as accurate as possible, (i.e. \"Santa Cruz\" should be \"Santa Cruz, California\" or \"Santa Cruz, Costa Rica\")";
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
            this.searchCompleted = false;
            this.warningMessage = true;
        } finally {
            console.log(this.c_w);
            this.searchCompleted = false;
            this.searchSatisfied = true;
        }
    }
}
