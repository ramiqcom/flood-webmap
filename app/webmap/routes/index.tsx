import basemaps from '@/data/basemap.json' with { "type": "json" };
import layers from "@/data/layers.json" with { "type": "json" };
import Main from '@/islands/main.tsx';
import { get_bbox } from "@/modules/geo.ts";

export default async function Home() {
  const layer = layers[0];
  const bounds = await get_bbox(layer.value);
  return (
    <>
      <Main basemaps={basemaps} layers={layers} defaultLayer={layer} defaultBounds={bounds} />
    </>
  );
}
