import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  RequestUploadUrlBody,
  RequestUploadUrlResponse,
} from '@workspace/api-zod';
import { Router, type IRouter, type Request, type Response } from 'express';

const router: IRouter = Router();
const uploadDirectory = path.resolve(
  process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'uploads'),
);
const allowedContentTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maximumUploadSize = 10 * 1024 * 1024;

function safeObjectId(value: string): string | null {
  return /^[0-9a-f-]{36}$/i.test(value) ? value : null;
}

router.post('/storage/uploads/request-url', (req: Request, res: Response) => {
  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Missing or invalid required fields' });
    return;
  }

  const { name, size, contentType } = parsed.data;
  if (size > maximumUploadSize || !allowedContentTypes.has(contentType)) {
    res.status(400).json({ error: 'Unsupported image or file is too large' });
    return;
  }

  const objectId = randomUUID();
  res.json(RequestUploadUrlResponse.parse({
    uploadURL: `/api/storage/uploads/${objectId}`,
    objectPath: `/objects/${objectId}`,
    metadata: { name, size, contentType },
  }));
});

router.put('/storage/uploads/:objectId', async (req: Request, res: Response) => {
  const rawObjectId = req.params.objectId;
  const objectId = safeObjectId(
    Array.isArray(rawObjectId) ? rawObjectId.join('') : rawObjectId,
  );
  const contentType = req.headers['content-type']?.split(';')[0];
  if (!objectId || !contentType || !allowedContentTypes.has(contentType)) {
    res.status(400).json({ error: 'Invalid upload' });
    return;
  }

  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > maximumUploadSize) {
      res.status(413).json({ error: 'File is too large' });
      return;
    }
    chunks.push(buffer);
  }

  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(path.join(uploadDirectory, objectId), Buffer.concat(chunks));
  await writeFile(path.join(uploadDirectory, `${objectId}.json`), JSON.stringify({ contentType }));
  res.status(204).end();
});

router.get('/storage/objects/*path', async (req: Request, res: Response) => {
  const raw = req.params.path;
  const objectId = safeObjectId(Array.isArray(raw) ? raw.join('/') : raw);
  if (!objectId) {
    res.status(404).json({ error: 'Object not found' });
    return;
  }

  try {
    const metadata = JSON.parse(
      await readFile(path.join(uploadDirectory, `${objectId}.json`), 'utf8'),
    ) as { contentType?: string };
    const file = await readFile(path.join(uploadDirectory, objectId));
    res.setHeader('Content-Type', metadata.contentType ?? 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(file);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      res.status(404).json({ error: 'Object not found' });
      return;
    }
    req.log.error({ err: error }, 'Error serving object');
    res.status(500).json({ error: 'Failed to serve object' });
  }
});

export default router;
