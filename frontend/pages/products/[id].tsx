import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { apiGet, apiPut, apiDelete } from '../../lib/api';

type Product = { id: number; title: string; description?: string; price: number; createdAt: string };

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [editing, setEditing] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!id) return;
    apiGet(`products/${id}`)
      .then((data) => {
        setProduct(data);
        setTitle(data.title || '');
        setDesc(data.description || '');
        setPrice(String(data.price || ''));
      })
      .catch((e) => {
        const msg = e?.response?.data?.message || e.message || 'Load failed';
        setErr(msg);
      });
  }, [id]);

  async function save() {
    setErr('');
    if (!product) return;
    // validation
    if (!title || title.length < 2) return setErr('Title must be at least 2 characters');
    const p = parseFloat(price);
    if (Number.isNaN(p) || p <= 0) return setErr('Price must be a positive number');
    try {
      await apiPut(`products/${product.id}`, { title, description: desc, price: p });
      setEditing(false);
      const d = await apiGet(`products/${product.id}`);
      setProduct(d);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e.message || 'Save failed';
      setErr(msg);
    }
  }

  async function remove() {
    if (!product) return;
    try {
      await apiDelete(`products/${product.id}`);
      router.push('/products');
    } catch (e: any) {
      const msg = e?.response?.data?.message || e.message || 'Delete failed';
      setErr(msg);
    }
  }

  if (!product) {
    return (
      <main style={{ padding: 24 }}>
        <div>Loading...</div>
        {err && <div style={{ color: 'red' }}>{err}</div>}
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Product</h1>
      {err && <div style={{ color: 'red' }}>{err}</div>}

      {!editing ? (
        <div>
          <h2>{product.title}</h2>
          <div>${product.price.toFixed(2)}</div>
          <div style={{ color: '#666' }}>{product.description}</div>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => setEditing(true)} style={{ marginRight: 8 }}>Edit</button>
            <button onClick={remove} style={{ background: '#c00', color: '#fff' }}>Delete</button>
          </div>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); save(); }} style={{ maxWidth: 480 }}>
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
          <div>
            <button type="submit" style={{ marginRight: 8 }}>Save</button>
            <button type="button" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      )}
    </main>
  );
}
