import { Component, Input, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { GoogleMapClass, WikiClass } from './google_map_class';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

@Component({
    template: require('./wiki.component.html')
})

export class WikiComponent implements OnInit {
    search: string;
    searchTerm: string;
    message: string;
    results: Observable<string[]>;
    searchCompleted: boolean;
    goog: GoogleMapClass;
    wiki: WikiClass;
    weather: string;
    info: string;
    parsedInfo: string;
    wikiStream = new Subject<string>();
    theHtml: string;
    buttonsLine: string;
    showButtons: boolean;



    constructor(private searchService: SearchService) {
    }

    ngOnInit(): void {
        this.showButtons = false;
        this.searchCompleted = false;
        this.goog = this.searchService.returnGoog();

        if (!this.goog) {
            this.message = "Feel free to make a query, and you will receive the results!";
        } else {
            this.message = "You already have a location on file. Would you like to pull up information about your previous query?";
            this.showButtons = true; 
        }
        

        this.results = this.wikiStream
            .debounceTime(500)
            .distinctUntilChanged()
            .switchMap((x: string) => this.searchService.searchWiki(x));
    }

    confirm(x: boolean): void {
        if (x) {
            this.getWikiInfo(this.goog["name"]);
            this.message = "If this isn't what you were looking for, try searching again!";
        } else {
            this.message = "Feel free to make a query, and you will receive the results!";
        }
        this.showButtons = false;
    }

    getWikiInfo(x: string): void {
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

    wikiSearch(x: string): void {
        this.wikiStream.next(x);
    }
}
