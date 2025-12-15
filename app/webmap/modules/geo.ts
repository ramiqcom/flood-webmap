import { kml } from '@tmcw/togeojson';
import shp from 'shpjs';

export async function parse_geodata(
  file: File
): Promise<GeoJSON.FeatureCollection<any, { [name: string]: any }>> {
  // Get filename
  const name = file.name;
  const format = name.split('.').at(-1);

  let geojson: GeoJSON.FeatureCollection<any, { [name: string]: any }>;

  if (format == 'zip') {
    geojson = await shp(await file.arrayBuffer());
  } else if (format == 'kml' || format == 'kmz') {
    const parser = new DOMParser();
    geojson = kml(parser.parseFromString(await file.text(), 'text/xml'));
  } else if (format == 'geojson' || format == 'json') {
    geojson = JSON.parse(await file.text());
  }

  return geojson;
}
