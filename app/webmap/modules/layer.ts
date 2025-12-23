import layers from "@/data/layers.json" with { "type": "json" };
import { execute_process } from "./server_util.ts";

export async function generate_image(layer: string, bbox: [number, number, number, number], size = 256) {
  const { path, type } = layers.find(dict => dict.value == layer);
  const output = await Deno.makeTempFile({ suffix: ".webp" });
  const addArgs = []
  if (type == "sentinel-1") {
    const args = [
      "!",
      "select",
      "--band=1,2,mask,mask",
      "!",
      "scale",
      "--band=1",
      "--src-min=1000",
      "--dst-min=0",
      "--src-max=4000",
      "--dst-max=255",
      "--ot=Float32",
      "!",
      "scale",
      "--band=2",
      "--src-min=0",
      "--dst-min=0",
      "--src-max=1000",
      "--dst-max=255",
      "--ot=Float32",
       "!",
      "scale",
      "--band=3",
      "--src-min=0",
      "--dst-min=0",
      "--src-max=0",
      "--dst-max=0",
      "--ot=Float32",
    ]
    addArgs.push(...args)
  }
  await execute_process("gdal",[
    "raster",
    "pipeline",
    "!",
    "read",
    path,
    "!",
    "reproject",
    '--resampling=lanczos',
    `--bbox=${bbox.join(",")}`,
    "--bbox-crs=EPSG:4326",
    `--size=${size},${size}`,
    ...addArgs,
    "!",
    "write",
    "-f",
    "WEBP",
    "--overwrite",
    output
  ]);
  const image = await Deno.readFile(output);
  await Deno.remove(output);
  return image
}
