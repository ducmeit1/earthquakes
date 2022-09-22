import { Earthquake } from "../model";
import { Pagination } from "./Pagination";
import "source-map-support/register";

export interface EarthquakeFeature {
    type: string;
    properties: Earthquake;
}

export interface EarthquakeFilter {
    pagination?: Pagination | undefined;
}