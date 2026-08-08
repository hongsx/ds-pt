// frontend/pages/api/proxy/[...path].ts
import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pathParts = (req.query.path as string[]) || [];
    const path = pathParts.join('/');
    const url = new URL(`${BACKEND}/${path}`);

    // preserve querystring
    Object.keys(req.query || {}).forEach((k) => {
      if (k === 'path') return;
      const v = (req.query as any)[k];
      if (Array.isArray(v)) v.forEach((vv) => url.searchParams.append(k, vv));
      else if (v !== undefined) url.searchParams.append(k, String(v));
    });

    const headers: any = { ...req.headers };
    // remove host to avoid bad upstream header
    delete headers.host;
    // do not forward Next.js specific headers
    delete headers['accept-encoding'];

    const method = req.method || 'GET';
    const fetchOptions: any = { method, headers, redirect: 'manual' };

    if (method !== 'GET' && method !== 'HEAD') {
      // If body is already parsed (JSON), forward JSON string
      if (req.body && typeof req.body === 'object') {
        fetchOptions.body = JSON.stringify(req.body);
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'content-type': 'application/json',
        };
      } else {
        // Raw body fallback
        fetchOptions.body = req.body as any;
      }
    }

    const upstream = await fetch(url.toString(), fetchOptions as RequestInit);

    // copy status
    res.status(upstream.status);

    // copy headers (but not hop-by-hop)
    upstream.headers.forEach((value, key) => {
      if (['transfer-encoding', 'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailer', 'upgrade'].includes(key.toLowerCase())) return;
      // forward set-cookie and others
      res.setHeader(key, value);
    });

    const buffer = await upstream.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err: any) {
    console.error('proxy error', err);
    res.status(500).json({ message: 'Proxy error', detail: err?.message || String(err) });
  }
}
