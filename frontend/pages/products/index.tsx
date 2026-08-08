--- a/frontend/pages/products/index.tsx
+++ b/frontend/pages/products/index.tsx
@@
-import { useEffect, useState } from 'react';
-import Link from 'next/link';
-import { api } from '../../lib/api';
+import { useEffect, useState } from 'react';
+import Link from 'next/link';
+import { apiGet } from '../../lib/api';
@@
-    setErr('');
-    api(`products?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`)
-      .then((data) => {
-        if (!mounted) return;
-        setItems(data.items || []);
-        setMeta(data.meta || null);
-      })
-      .catch((e) => setErr(e.message || 'Fetch failed'))
-      .finally(() => setLoading(false));
+    setErr('');
+    apiGet('products', { q, page, pageSize })
+      .then((data) => {
+        if (!mounted) return;
+        setItems(data.items || []);
+        setMeta(data.meta || null);
+      })
+      .catch((e) => {
+        const msg = e?.response?.data?.message || e.message || 'Fetch failed';
+        setErr(msg);
+      })
+      .finally(() => setLoading(false));
@@
-        {items.map((p) => (
+        {items.map((p) => (
           <li key={p.id} style={{ marginBottom: 10 }}>
-            <Link href={`/products/${p.id}`}><a><strong>{p.title}</strong></a></Link>
+            <Link href={`/products/${p.id}`}><a><strong>{p.title}</strong></a></Link>
             <div>${p.price.toFixed(2)}</div>
             <div style={{ color: '#666' }}>{p.description}</div>
           </li>
         ))}
       </ul>
@@
-        <button onClick={() => setPage((s) => Math.max(1, s - 1))} disabled={page <= 1}>Prev</button>
+        <button onClick={() => setPage((s) => Math.max(1, s - 1))} disabled={page <= 1}>Prev</button>
         <span style={{ margin: '0 12px' }}>Page {page}{meta ? ` / ${meta.totalPages}` : ''}</span>
         <button onClick={() => setPage((s) => s + 1)} disabled={meta && page >= meta.totalPages}>Next</button>
       </div>
     </main>
   );
 }
