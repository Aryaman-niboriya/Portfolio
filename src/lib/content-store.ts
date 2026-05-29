import fs from "fs/promises";
import path from "path";
import { BlobNotFoundError, head, put } from "@vercel/blob";

const CONTENT_PATH = path.join(process.cwd(), "src/data/content.json");
const BLOB_PATHNAME = "portfolio/content.json";

function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function isBlobStorageConfigured(): boolean {
  return useBlobStorage();
}

export function isVercelProduction(): boolean {
  return process.env.VERCEL === "1";
}

async function readFromFile(): Promise<unknown> {
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  return JSON.parse(raw);
}

async function readFromBlob(): Promise<unknown> {
  const meta = await head(BLOB_PATHNAME);
  const res = await fetch(meta.url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch content from blob storage");
  return JSON.parse(await res.text());
}

export async function readContent(): Promise<unknown> {
  if (useBlobStorage()) {
    try {
      return await readFromBlob();
    } catch (err) {
      if (err instanceof BlobNotFoundError) {
        return readFromFile();
      }
      throw err;
    }
  }
  return readFromFile();
}

export async function writeContent(data: unknown): Promise<void> {
  const json = JSON.stringify(data, null, 2);

  if (useBlobStorage()) {
    await put(BLOB_PATHNAME, json, {
      access: "public",
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }

  if (isVercelProduction()) {
    throw new Error("BLOB_NOT_CONFIGURED");
  }

  await fs.writeFile(CONTENT_PATH, json, "utf-8");
}
