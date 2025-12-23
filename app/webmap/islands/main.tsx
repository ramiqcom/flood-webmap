import MapCanvas from '@/islands/map.tsx';
import { Store } from '@/modules/store.ts';
import { Option, Options, Status } from '@/modules/type.ts';
import { Map } from 'maplibre-gl';
import { useState } from 'preact/hooks';

export default function Main({
  layers,
  basemaps,
  defaultLayer,
  defaultBounds,
}: {
  layers: Options;
  basemaps: Options;
  defaultLayer: Option;
  defaultBounds: [number, number, number, number];
}) {
  const [map, setMap] = useState<Map>();
  const [basemap, setBasemap] = useState<Option>(basemaps[0]);
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
        <MapCanvas defaultBounds={defaultBounds} />
      </Store.Provider>
    </>
  );
}
