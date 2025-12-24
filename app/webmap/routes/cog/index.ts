import { Handlers } from '$fresh/server.ts';
import layers from "@/data/layers.json" with { "type": "json" };

export const handler: Handlers = {
  async GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const layer = searchParams.get('layer');
      const { path, type } = layers.find(dict => dict.value == layer)
      const [x, y, z] = ['x', 'y', 'z'].map((n) => Number(searchParams.get(n)));
      const image = await (await fetch(`${Deno.env.get('TILE_SERVER')}/cog?path=${path}&z=${z}&x=${x}&y=${y}&type=${type}`)).arrayBuffer();

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
