import basemaps from '@/data/basemap.json' with { "type": "json" };
import layers from "@/data/layers.json" with { "type": "json" };
import MapCanvas from '@/islands/map.tsx';
import { Store } from '@/modules/store.ts';
import { Option, Status } from '@/modules/type.ts';
import { Map } from 'maplibre-gl';
import { useState } from 'preact/hooks';

export default function Main() {
  const [map, setMap] = useState<Map>();
  const [basemap, setBasemap] = useState<Option>(basemaps[0]);
  const [layer, setLayer] = useState<Option>(layers[0]);
  const [status, setStatus] = useState<Status>({
    message: 'Loading map...',
    type: 'process',
  });
  const basemapId = 'basemap';

  const states = {
    basemaps,
    basemap,
    basemapId,
    setBasemap,
    map,
    setMap,
    status,
    setStatus,
    layers,
    layer, setLayer
  };

  return (
    <>
      <Store.Provider value={states}>
        <MapCanvas />
      </Store.Provider>
    </>
  );
}
