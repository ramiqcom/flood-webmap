FROM gcr.io/ramadhan-s4g/eo-base

WORKDIR /usr/src/app

COPY requirements.txt requirements.txt

RUN python3 -m venv .venv && \
  .venv/bin/pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD [ ".venv/bin/fastapi", "run", "." ]
