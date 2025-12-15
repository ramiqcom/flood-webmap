FROM gcr.io/ramadhan-s4g/eo-base

WORKDIR /usr/src/app

COPY . .

RUN deno task build

EXPOSE 3000

CMD [ "deno", "task", "preview" ]
