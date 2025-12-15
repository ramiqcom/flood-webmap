import { Handlers } from '$fresh/server.ts';
import layers from '@/data/layers.json' with { type: "json" };
import { execute_process } from '@/modules/server_util.ts';

export const handler: Handlers = {
  async GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const layer = searchParams.get('layer');
      const { path } = layers.find((dict) => dict.value == layer);
      const layerInfo = JSON.parse(
        (await execute_process(
          'gdal',
          ['raster', 'info', '-f', 'json', path],
          undefined,
          true
        )) as string
      );
      const corner = layerInfo['cornerCoordinates'];
      const bbox = [
        corner['lowerLeft'][0],
        corner['lowerLeft'][1],
        corner['upperRight'][0],
        corner['upperRight'][1],
      ];

      // Filter layer basemap
      const style = {
        tilejson: '3.0.0',
        tiles: [`/cog?layer=${layer}&x={x}&y={y}&z={z}`],
        bounds: bbox,
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
