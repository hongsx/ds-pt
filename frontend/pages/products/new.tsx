--- a/frontend/pages/products/new.tsx
+++ b/frontend/pages/products/new.tsx
@@
-import { useState } from 'react';
-import { useRouter } from 'next/router';
-import { api } from '../../lib/api';
+import { useState } from 'react';
+import { useRouter } from 'next/router';
+import { apiPost } from '../../lib/api';
@@
   async function submit(e: React.FormEvent) {
     e.preventDefault();
     setErr('');
-    try {
-      await api('products', { method: 'POST', body: { title, description: desc, price: parseFloat(price) } });
-      router.push('/products');
-    } catch (e: any) {
-      setErr(e.message || 'Create failed');
-    }
+    // client-side validation
+    if (!title || title.length < 2) return setErr('Title must be at least 2 characters');
+    const p = parseFloat(price);
+    if (Number.isNaN(p) || p <= 0) return setErr('Price must be a positive number');
+    try {
+      await apiPost('products', { title, description: desc, price: p });
+      router.push('/products');
+    } catch (e: any) {
+      const msg = e?.response?.data?.message || e.message || 'Create failed';
+      setErr(msg);
+    }
   }
@@
-        {err && <div style={{ color: 'red' }}>{err}</div>}
+        {err && <div style={{ color: 'red' }}>{err}</div>}
         <button type="submit">Create</button>
       </form>
     </main>
   );
 }
