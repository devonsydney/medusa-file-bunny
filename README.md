# Bunny.net

Store uploaded files to your Medusa backend on bunny.net CDN.

[Medusa Website](https://medusajs.com) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Store product images on bunny.net

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [Bunny account](https://bunny.net/)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

```bash
npm install @devon/medusa-file-bunny
```

2\. Set the following environment variables in `.env`:

```bash
BUNNY_STORAGE_ACCESS_KEY=<YOUR_BUNNY_STORAGE_ACCESS_KEY> # Also referred to as Storage FTP Password
BUNNY_STORAGE_ENDPOINT=<YOUR_BUNNY_STORAGE_ENDPOINT> # e.g. https://storage.bunnycdn.com
BUNNY_STORAGE_ZONE_NAME=<YOUR_BUNNY_STORAGE_ZONE_NAME>
BUNNY_STORAGE_PATH=<YOUR_BUNNY_STORAGE_PATH> # optional, will upload to top folder if not provided
BUNNY_PULL_ZONE_DOMAIN=<YOUR_BUNNY_PULL_ZONE_DOMAIN>
```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

```js
const plugins = [
  // ...
  {
    resolve: `@devon/medusa-file-bunny`,
    options: {
      storageAccessKey: process.env.BUNNY_STORAGE_ACCESS_KEY,
      storageEndpoint: process.env.BUNNY_STORAGE_ENDPOINT,
      storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME,
      storagePath: process.env.BUNNY_STORAGE_PATH,
      pullZoneDomain: process.env.BUNNY_PULL_ZONE_DOMAIN,
    },
  },
]
```

---

## Test the Plugin

1\. Run the following command in the directory of the Medusa backend to run the backend:

```bash
npm run start
```

2\. Upload an image for a product using the admin dashboard or using [the Admin APIs](https://docs.medusajs.com/api/admin#tag/Upload).