import { Store } from '@/modules/store.ts';
import maplibregl from 'maplibre-gl';
import { useContext, useEffect, useState } from 'preact/hooks';

export default function MapCanvas() {
  // All the stored states
  const { map, setMap, setStatus, basemap, basemapId, layer } = useContext(Store);

  const [mapLoaded, setMapLoaded] = useState(false);

  const divId = 'map';

  // Load maplibre at the first time
  useEffect(() => {
    try {
      const map = new maplibregl.Map({
        container: divId,
        center: [117, 0],
        maxZoom: 20,
        minZoom: 2,
        zoom: 4,
        style: {
          projection: {
            type: 'globe',
          },
          version: 8,
          sources: {
            [basemapId]: {
              type: 'raster',
              url: `/basemap?type=${basemap.value}`,
              tileSize: 256,
            },
          },
          layers: [
            {
              id: basemapId,
              source: basemapId,
              type: 'raster',
            },
          ],
        },
      });
      setMap(map);

      map.on('load', () => {
        setMapLoaded(true);
      });
    } catch ({ message }) {
      setStatus({ message, type: 'failed' });
    }
  }, []);

  useEffect(() => {
    if (map && mapLoaded && layer) {
      if (!map.getSource(layer.value)) {
        map.addSource(layer.value, {
          type: 'raster',
          url: `/cog/tilejson?layer=${layer.value}`,
          tileSize: 256,
        });
        map.addLayer({ source: layer.value, id: layer.value, type: 'raster' });
      }

      map.getStyle().layers.map((layer_dict) => {
        if (layer_dict.id != basemapId) {
          map.setLayoutProperty(
            layer_dict.id,
            'visibility',
            layer_dict.id == layer.value ? 'visible' : 'none'
          );
        }
      });
    }
  }, [map, mapLoaded, layer]);

  return <div id={divId} />;
}
