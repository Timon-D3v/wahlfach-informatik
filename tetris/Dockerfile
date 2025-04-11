FROM denoland/deno:debian

WORKDIR /build

COPY deno.json .
COPY deno.lock .

COPY . .

CMD ["deno", "-A", "main.ts"]