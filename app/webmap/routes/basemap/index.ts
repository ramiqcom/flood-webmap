import { Handlers } from '$fresh/server.ts';
import basemaps from '@/data/basemap.json' with { type: "json" };

export const handler: Handlers = {
  async GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const type = searchParams.get('type');
      // FIlter basemap
      let style = {};
      const basemap = basemaps.filter((dict) => dict.value == type)[0];
      if (type != 'satellite') {
        style = await (
          await fetch(
            `${basemap['url']}?api_key=${Deno.env.get('STADIA_API_KEY')}`
          )
        ).json();
      } else {
        style = {
          tilejson: '3.0.0',
          tiles: [basemap['tiles']],
          bounds: [-180.0, -85.05112877980659, 180.0, 85.0511287798066],
          center: [0.0, 0.0, 0],
          minzoom: 0,
          maxzoom: 21,
          scheme: 'xyz',
          name: 'Google Hybrid',
          attribution: '',
        };
      }
      return new Response(JSON.stringify(style), { status: 200, headers: { "Content-type": "application/json" } });
    } catch (error) {
      return new Response(error.message, { status: 404, headers: { "Content-type": "text/plain" } })
    }
  },
};
