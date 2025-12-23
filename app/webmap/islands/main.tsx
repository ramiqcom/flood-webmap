import MapCanvas from '@/islands/map.tsx';
import { Store } from '@/modules/store.ts';
import { Option, Options, Status } from '@/modules/type.ts';
import { Map } from 'maplibre-gl';
import { useState } from 'preact/hooks';
import Float from './float_panel.tsx';

export default function Main({
  layers,
  basemaps,
  defaultBasemap,
  defaultLayer,
  defaultBounds,
}: {
  layers: Options;
  basemaps: Options;
  defaultBasemap: Option;
  defaultLayer: Option;
  defaultBounds: [number, number, number, number];
}) {
  const [map, setMap] = useState<Map>();
  const [basemap, setBasemap] = useState<Option>(defaultBasemap);
  const [layer, setLayer] = useState<Option>(defaultLayer);
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
    layer,
    setLayer,
  };

  return (
    <>
      <Store.Provider value={states}>
        <Float />
        <MapCanvas defaultBounds={defaultBounds} />
      </Store.Provider>
    </>
  );
}
