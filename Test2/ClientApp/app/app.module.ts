import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { UniversalModule } from "angular2-universal";
import { AppComponent } from "./components/app/app.component";
import { WikiComponent } from "./components/app/wiki.component";
import { MapsComponent } from "./components/app/maps.component";
import { WeatherComponent } from "./components/app/weather.component";
import { HomeComponent } from "./components/app/home.component";
import { SearchService } from "./components/app/search.service";
import { KeysPipe } from "./components/app/keys.pipe";

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        HomeComponent,
        WikiComponent,
        MapsComponent,
        WeatherComponent,
        KeysPipe
    ],
    imports: [
        UniversalModule, // must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        FormsModule,
        RouterModule.forRoot([
            { path: "home", component: HomeComponent },
            { path: "wiki", component: WikiComponent },
            { path: "maps", component: MapsComponent },
            { path: "weather", component: WeatherComponent },
            { path: "", redirectTo: "home", pathMatch: "full" },
            { path: "**", redirectTo: "home" }
        ])
    ],
    providers: [
        SearchService
    ]
})
export class AppModule {
}
