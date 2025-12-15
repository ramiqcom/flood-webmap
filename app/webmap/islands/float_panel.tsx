import { setBasemapUrl } from '@/modules/map_util.ts';
import { Store } from '@/modules/store.ts';
import { useContext } from 'preact/hooks';

export default function Float() {
  const { basemaps, basemap, setBasemap, map, basemapId } = useContext(Store);
  const selectLayers = basemaps.map((dict, key) => (
    <button
      type='button'
      disabled={basemap.value == dict.value}
      key={key}
      onClick={() => {
        setBasemap(dict);
        setBasemapUrl(map, basemapId, dict);
      }}
      className='button-select'
    >
      {dict.label}
    </button>
  ));
  return (
    <>
      <div className='float basemap'>
        <div className='float-panel'>
          <div className='flexible'>{selectLayers}</div>
        </div>
      </div>
    </>
  );
}
