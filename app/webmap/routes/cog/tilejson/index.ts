import { Handlers } from '$fresh/server.ts';

export const handler: Handlers = {
  GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const layer = searchParams.get('layer');

      // Filter layer basemap
      const style = {
        tilejson: '3.0.0',
        tiles: [`/cog?layer=${layer}&x={x}&y={y}&z={z}`],
        bounds: [-180, -90, 180, 90],
        center: [0.0, 0.0, 0],
        minzoom: 0,
        maxzoom: 15,
        scheme: 'xyz',
        attribution: '',
      };

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
