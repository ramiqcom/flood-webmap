import { Store } from '@/modules/store.ts';
import { useContext } from 'preact/hooks';
import { Select } from './input.tsx';

export default function Panel() {
  return (
    <div id='panel'>
      <LayerSelect />
    </div>
  );
}

function LayerSelect() {
  const { layer, setLayer, layers, status } = useContext(Store);
  const layerSelect = (
    <Select
      value={layer}
      options={layers}
      onChange={setLayer}
      disabled={status.type == 'process'}
    />
  );
  return layerSelect;
}
