import {Injectable} from "@angular/core";
import {Jsonp, Http, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import { Observable } from "rxjs/Rx";
import { GoogleMapClass, BasicLocationClass } from "./google_map_class";
import { MapsAPI, WeatherAPI } from "./API";

@Injectable()
export class SearchService {
    dataHere: JSON;
    errorMessage: string;
    public Goog: GoogleMapClass;
    loc: BasicLocationClass;
    // locArray: Array<BasicLocationClass>;

    constructor(private http: Http, private jsonp: Jsonp) { }

    returnGoog(): GoogleMapClass {
        return this.Goog;
    }

    getPlaces(name: string): Observable<GoogleMapClass> {
        console.log(name);
        const url = "https://maps.googleapis.com/maps/api/place/textsearch/json";
        let params = new URLSearchParams();
        params.set("query", name);
        params.set("key", MapsAPI["API"]);
        let headers = new Headers();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET");
        headers.set("Access-Control-Allow-Headers", "Content-Type");
        let options = new RequestOptions({ "method": "GET", "headers": headers, "search": params });

        return this.http.get(url, options)
            .map(r => this.parseTheData(r.json()))
            .catch((error: any) => Observable.throw(error.json().error));
    }

    parseTheData(x: JSON): GoogleMapClass {
        var y = x["results"][0];
        this.Goog = {
            name: y["name"],
            formatted_address: y["formatted_address"],
            location: {
                lat: y["geometry"]["location"]["lat"],
                lng: y["geometry"]["location"]["lng"]
            },
            id: y["id"]
        };
        return this.Goog;
    }

    getWeatherLocation(lat: number, lng: number): Observable<any> {

        const url = "http://api.wunderground.com/api/" + WeatherAPI["API"] + "/geolookup/q/" + lat + "," + lng + ".json";
        let headers = new Headers();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET");
        headers.set("Access-Control-Allow-Headers", "Content-Type");
        let options = new RequestOptions({ "method": "GET", "headers": headers });

        return this.http.get(url, options)
            .map(r => r.json())
            .catch((error: any) => Observable.throw(error.json().error));
    }

    parseWeatherCities(x: JSON): Array<any> {
        var q = 0; 
        var objArray = new Array;
        try {
            var y = x['response']['results'];
            y.forEach(function (i) {
                var z = new BasicLocationClass;
                z = {
                    num: q,
                    city: i['city'],
                    state: i['state'],
                    country: i['country']
                };
                objArray.push(z);
                q += 1;
            });
        } catch (e){
            console.log(e);
        } finally {
            return objArray;
        }
    }

    getWeatherCities(x: string): Observable<Array<any>> {

        const url = "http://api.wunderground.com/api/" + WeatherAPI["API"] + "/geolookup / forecast / q / " + x + ".json";
        let headers = new Headers();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET");
        headers.set("Access-Control-Allow-Headers", "Content-Type");
        let options = new RequestOptions({ "method": "GET", "headers": headers });

        return this.http.get(url, options)
            .map(r => this.parseWeatherCities(r.json()))
            .catch((error: any) => Observable.throw(error));

        // <string[]>response.json()[1]
    }

    getWeather(city: string, second: string, b00l: boolean): Observable<JSON> {
        if(b00l) {
            var url = "http://api.wunderground.com/api/" + WeatherAPI["API"] + "/forecast/geolookup/conditions/q/" + second + "/" + city + ".json";
        } else {
            var url = "http://api.wunderground.com/api/" + WeatherAPI["API"] + "/geolookup/conditions/forecast/q/" + second + "/" + city + ".json";
        }
  
        let headers = new Headers();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET");
        headers.set("Access-Control-Allow-Headers", "Content-Type");
        let options = new RequestOptions({ "method": "GET", "headers": headers });

        return this.http.get(url, options)
            .map(r => this.dataHere = r.json())
            .catch((error: any) => Observable.throw(error.json().error));
    }

    searchWiki(term: string): Observable<string[]> {
        let wikiUrl = "http://en.wikipedia.org/w/api.php";
        let params = new URLSearchParams();
        params.set("search", term); // the user"s search value
        params.set("action", "opensearch");
        params.set("format", "json");
        params.set("callback", "JSONP_CALLBACK");
        // TODO: Add error handling
        return this.jsonp.get(wikiUrl, { search: params })
            .map(response => <string[]>response.json()[1])
            .catch((error: any) => Observable.throw(error.json().error));
    }
    
    getWikiInfo(term: string): Observable<any> {
        let wikiUrl = "http://en.wikipedia.org/w/api.php";
        let params = new URLSearchParams();
        params.set("action", "query");
        params.set("exintro", "true");
        params.set("format", "json");
        params.set("callback", "JSONP_CALLBACK");
        params.set("prop", "extracts");
        params.set("titles", term); // the user"s search value
        return this.jsonp.get(wikiUrl, { search: params })
            .map(r => r.json())
            .catch((error: any) => Observable.throw(error.json().error));
    }
}
