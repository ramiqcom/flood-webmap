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
      "--band=1,2,1,mask",
      "!",
      "scale",
      "--band=1",
      "--src-min=0",
      "--dst-min=0",
      "--src-max=3000",
      "--dst-max=255",
      "--ot=Byte",
      "!",
      "scale",
      "--band=2",
      "--src-min=0",
      "--dst-min=0",
      "--src-max=500",
      "--dst-max=255",
      "--ot=Byte",
       "!",
      "scale",
      "--band=3",
      "--src-min=0",
      "--dst-min=0",
      "--src-max=3000",
      "--dst-max=255",
      "--ot=Byte",
      "!",
      "scale",
      "--band=4",
      "--src-min=0",
      "--dst-min=0",
      "--src-max=255",
      "--dst-max=255",
      "--ot=Byte",
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
    "clip",
    `--bbox=${bbox.join(",")}`,
    "--bbox-crs=EPSG:4326",
    "--allow-bbox-outside-source",
    "!",
    "resize",
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
