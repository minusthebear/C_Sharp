export class BasicLocationClass {
    num: number;
    city: string;
    state: string;
    country: string;
}

export class GoogleMapClass {
    name: string;
    formatted_address: string;
    location: {
        lat: number,
        lng: number
    };
    id: string;
}

export class CurrentWeatherClass {
    weather: string;
    icon_url: string;
    temperature_string: string;
    temp_c: number;
    feelslike_c: number;
    temp_f: number;
    feelslike_f: number;
    relative_humidity: string;
    windchill_c: string;
    windchill_f: string;
    windchill_string: string;
    wind_kph: number;
    wind_mph: number;
    precip_today_in: string;
    precip_today_metric: string;
    precip_today_string: string;
}

export class WikiClass {
    title: string;
    extract: string;
}

export class FullClass {
    name: string;
    formatted_address?: string;
    location?: {
        lat: number,
        lng: number
    };
    id?: string;
    weather?: string;
    icon_url?: string;
    temperature_string?: string;
    temp_c?: number;
    feelslike_c?: number;
    temp_f?: number;
    feelslike_f?: number;
    relative_humidity?: string;
    windchill_c?: string;
    windchill_f?: string;
    windchill_string?: string;
    wind_kph?: number;
    wind_mph?: number;
    precip_today_in?: string;
    precip_today_metric?: string;
    precip_today_string?: string;
    extract?: string;
}