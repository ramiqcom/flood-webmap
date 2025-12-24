from subprocess import check_call
from tempfile import TemporaryDirectory

import mercantile
from fastapi import BackgroundTasks, FastAPI
from fastapi.responses import FileResponse

app = FastAPI()


def delete_folder(folder: TemporaryDirectory):
    folder.cleanup()


@app.get("/")
def home():
    return "Tile server is active"


@app.get("/cog")
def generate_image(
    path: str, z: int, x: int, y: int, type: str, background_tasks: BackgroundTasks
):
    folder = TemporaryDirectory(delete=False)
    bbox = tuple(mercantile.bounds(mercantile.Tile(x=x, y=y, z=z)))
    image = f"{folder.name}/image.webp"

    add_cmd = ""
    if type == "sentinel-1":
        add_cmd = """\
          ! select --band=1,2,mask,mask \
          ! scale --band=1 --src-min=1000 --src-max=3000 --dst-min=0 --dst-max=255 --ot=Float32 \
          ! scale --band=2 --src-min=0 --src-max=1000 --dst-min=0 --dst-max=255 --ot=Float32 \
          ! scale --band=3 --src-min=0 --src-max=0 --dst-min=0 --dst-max=0 --ot=Float32 \
          ! set-type --ot=Byte \
        """
    cmd = f"""gdal raster pipeline \
              ! read {path} \
              ! clip --bbox={bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]} --bbox-crs=EPSG:4326 --allow-bbox-outside-source \
              ! resize --size=256,256 \
              {add_cmd} \
              ! write -f WEBP {image} --overwrite \
    """
    check_call(
        cmd,
        shell=True,
    )

    background_tasks.add_task(delete_folder, folder)

    return FileResponse(image, status_code=200, media_type="image/webp")
