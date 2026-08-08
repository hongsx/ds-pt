import { useState } from 'react';
import { useRouter } from 'next/router';
import { apiPost } from '../../lib/api';

export default function NewProductPage() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    // client-side validation
    if (!title || title.length < 2) return setErr('Title must be at least 2 characters');
    const p = parseFloat(price);
    if (Number.isNaN(p) || p <= 0) return setErr('Price must be a positive number');
    try {
      await apiPost('products', { title, description: desc, price: p });
      router.push('/products');
    } catch (e: any) {
      const msg = e?.response?.data?.message || e.message || 'Create failed';
      setErr(msg);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>New Product</h1>
      <form onSubmit={submit} style={{ maxWidth: 480 }}>
        <div style={{ marginBottom: 8 }}>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Description</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Price</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" style={{ width: '100%', padding: 8 }} />
        </div>
        {err && <div style={{ color: 'red' }}>{err}</div>}
        <button type="submit">Create</button>
      </form>
    </main>
  );
}
