import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet } from '../../lib/api';

type Product = { id: number; title: string; description?: string; price: number; createdAt: string };

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr('');
    apiGet('products', { q, page, pageSize })
      .then((data) => {
        if (!mounted) return;
        setItems(data.items || []);
        setMeta(data.meta || null);
      })
      .catch((e) => {
        const msg = e?.response?.data?.message || e.message || 'Fetch failed';
        setErr(msg);
      })
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, [q, page, pageSize]);

  return (
    <main style={{ padding: 24 }}>
      <h1>Products</h1>
      <div style={{ marginBottom: 12 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="search title or description" style={{ padding: 8, width: 320 }} />
        <Link href="/products/new"><button style={{ marginLeft: 12 }}>New Product</button></Link>
      </div>

      {loading && <div>Loading...</div>}
      {err && <div style={{ color: 'red' }}>{err}</div>}

      <ul>
        {items.map((p) => (
          <li key={p.id} style={{ marginBottom: 10 }}>
            <Link href={`/products/${p.id}`}><a><strong>{p.title}</strong></a></Link>
            <div>${p.price.toFixed(2)}</div>
            <div style={{ color: '#666' }}>{p.description}</div>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 16 }}>
        <button onClick={() => setPage((s) => Math.max(1, s - 1))} disabled={page <= 1}>Prev</button>
        <span style={{ margin: '0 12px' }}>Page {page}{meta ? ` / ${meta.totalPages}` : ''}</span>
        <button onClick={() => setPage((s) => s + 1)} disabled={meta && page >= meta.totalPages}>Next</button>
      </div>
    </main>
  );
}
