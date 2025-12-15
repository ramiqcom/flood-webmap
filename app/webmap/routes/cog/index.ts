import { Handlers } from '$fresh/server.ts';
import { generate_image } from '@/modules/layer.ts';
import { tileToBBOX } from '@mapbox/tilebelt';

export const handler: Handlers = {
  async GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const layer = searchParams.get('layer');
      const [x, y, z] = ['x', 'y', 'z'].map((n) => Number(searchParams.get(n)));
      const bbox = tileToBBOX([x, y, z]);
      const image = await generate_image(layer, bbox as [number, number, number, number]);

      return new Response(image, {
        status: 200,
        headers: { 'Content-type': 'image/webp' },
      });
    } catch (error) {
      return new Response(error.message, {
        status: 404,
        headers: { 'Content-type': 'text/plain' },
      });
    }
  },
};
