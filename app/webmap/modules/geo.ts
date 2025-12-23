import layers from '@/data/layers.json' with { type: "json" };
import { kml } from '@tmcw/togeojson';
import shp from 'shpjs';
import { execute_process } from './server_util.ts';

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

export async function get_bbox(layer: string) {
  const { path } = layers.find((dict) => dict.value == layer);
  const layerInfo = JSON.parse(
    (await execute_process(
      'gdal',
      ['raster', 'info', '-f', 'json', path],
      undefined,
      true
    )) as string
  );
  const corner = layerInfo['cornerCoordinates'];
  const bbox = [
    corner['lowerLeft'][0],
    corner['lowerLeft'][1],
    corner['upperRight'][0],
    corner['upperRight'][1],
  ] as [number, number, number, number];

  return bbox;
}
