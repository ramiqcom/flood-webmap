import { Map, RasterTileSource } from 'maplibre-gl';
import { Option } from './type.ts';

export function setBasemapUrl(map: Map, basemapId: string, basemap: Option) {
  (map.getSource(basemapId) as RasterTileSource).setUrl(`/basemap?type=${basemap.value}`);
}
