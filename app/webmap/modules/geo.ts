import layers from '@/data/layers.json' with { type: 'json' };
import { kml } from '@tmcw/togeojson';
import { fromUrl } from 'geotiff';
import shp from 'shpjs';

export async function parse_geodata(
  file: File,
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

export async function get_bbox(layer: string) {
  const { path } = layers.find((dict) => dict.value == layer);
  const bbox = (await (await fromUrl(path)).getImage()).getBoundingBox() as [
    number,
    number,
    number,
    number,
  ];
  return bbox;
}
