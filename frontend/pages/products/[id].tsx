--- a/frontend/pages/products/[id].tsx
+++ b/frontend/pages/products/[id].tsx
@@
-import { useRouter } from 'next/router';
-import { useEffect, useState } from 'react';
-import { api } from '../../lib/api';
+import { useRouter } from 'next/router';
+import { useEffect, useState } from 'react';
+import { apiGet, apiPut, apiDelete } from '../../lib/api';
@@
-    if (!id) return;
-    api(`products/${id}`).then((data) => {
-      setProduct(data);
-      setTitle(data.title || '');
-      setDesc(data.description || '');
-      setPrice(String(data.price || ''));
-    }).catch((e) => setErr(e.message || 'Load failed'));
+    if (!id) return;
+    apiGet(`products/${id}`)
+      .then((data) => {
+        setProduct(data);
+        setTitle(data.title || '');
+        setDesc(data.description || '');
+        setPrice(String(data.price || ''));
+      })
+      .catch((e) => {
+        const msg = e?.response?.data?.message || e.message || 'Load failed';
+        setErr(msg);
+      });
   }, [id]);
@@
-    try {
-      await api(`products/${id}`, { method: 'PUT', body: { title, description: desc, price: parseFloat(price) }});
-      setEditing(false);
-      // reload
-      const d = await api(`products/${id}`);
-      setProduct(d);
-    } catch (e: any) {
-      setErr(e.message || 'Save failed');
-    }
+    // validation
+    if (!title || title.length < 2) return setErr('Title must be at least 2 characters');
+    const p = parseFloat(price);
+    if (Number.isNaN(p) || p <= 0) return setErr('Price must be a positive number');
+    try {
+      await apiPut(`products/${id}`, { title, description: desc, price: p });
+      setEditing(false);
+      const d = await apiGet(`products/${id}`);
+      setProduct(d);
+    } catch (e: any) {
+      const msg = e?.response?.data?.message || e.message || 'Save failed';
+      setErr(msg);
+    }
   }
 
   async function remove() {
@@
-    try {
-      await api(`products/${id}`, { method: 'DELETE' });
-      router.push('/products');
-    } catch (e: any) {
-      setErr(e.message || 'Delete failed');
-    }
+    try {
+      await apiDelete(`products/${id}`);
+      router.push('/products');
+    } catch (e: any) {
+      const msg = e?.response?.data?.message || e.message || 'Delete failed';
+      setErr(msg);
+    }
   }
