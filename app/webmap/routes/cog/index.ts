import { Handlers } from '$fresh/server.ts';
import layers from '@/data/layers.json';
import { tileToBBOX } from '@mapbox/tilebelt';

export const handler: Handlers = {
  async GET(req: Request) {
    const deno = await Deno.makeTempDir();
    try {
      const { searchParams } = new URL(req.url);
      const layer = searchParams.get('layer');
      const [x, y, z] = ['x', 'y', 'z'].map((n) => Number(searchParams.get(n)));
      const layerInfo = layers.find((layerDict) => layerDict.value == layer);
      const bbox = tileToBBOX([x, y, z]);

      return new Response(JSON.stringify(style), {
        status: 200,
        headers: { 'Content-type': 'application/json' },
      });
    } catch (error) {
      return new Response(error.message, {
        status: 404,
        headers: { 'Content-type': 'text/plain' },
      });
    }
  },
};
