import "source-map-support/register";

export interface Earthquake {
    mag: number;
    place: string;
    time: number;
    updated: number;
    tz?: any;
    url: string;
    detail: string;
    felt?: any;
    cdi?: any;
    mmi?: any;
    alert?: any;
    status: string;
    tsunami: number;
    sig: number;
    net: string;
    code: string;
    ids: string;
    sources: string;
    types: string;
    nst?: any;
    dmin?: any;
    rms?: number;
    gap?: any;
    magType: string;
    type: string;
    title: string;
}