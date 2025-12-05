from concurrent.futures import ThreadPoolExecutor
from logging import INFO, basicConfig, getLogger
from subprocess import check_call, check_output
from tempfile import TemporaryDirectory

basicConfig(
    level=INFO,
    format="%(asctime)s - %(name)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = getLogger(__name__)


s1_prefix = "gs://gee-ramiqcom-s4g-bucket/sumatera_flood/s1"
paths = check_output(f"gcloud storage ls {s1_prefix}", shell=True, text=True).split(
    "\n"
)[:-1]
dates = list(set([path.split(".tif")[0].split("_")[-1] for path in paths]))


def mosaic_job(date: str):
    with TemporaryDirectory() as dir:
        path_date = [
            path.replace("gs://", "/vsicurl/https://storage.googleapis.com/")
            for path in paths
            if date in path
        ]

        logger.info(f"Mosaic {date}")
        mosaic_result = f"{dir}/mosaicked.tif"
        check_call(
            f"""gdal raster mosaic \
                -f COG \
                --resolution=average \
                --co="COMPRESS=ZSTD" \
                --co="STATISTICS=YES" \
                --co="RESAMPLING=LANCZOS" \
                --co="OVERVIEWS=IGNORE_EXISTING" \
                --co="OVERVIEW_RESAMPLING=LANCZOS" \
                {" ".join(path_date)} \
                {mosaic_result}
            """,
            shell=True,
        )

        logger.info(f"Upload {date}")
        check_call(
            f"gcloud storage cp {mosaic_result} gs://gee-ramiqcom-s4g-bucket/sumatera_flood/s1_mosaic/s1_{date}.tif",
            shell=True,
        )


def main():
    with ThreadPoolExecutor(16) as executor:
        jobs = [executor.submit(mosaic_job, date) for date in dates]
        for job in jobs:
            try:
                job.result()
            except Exception as e:
                logger.info(f"Error: {e}")


if __name__ == "__main__":
    main()
