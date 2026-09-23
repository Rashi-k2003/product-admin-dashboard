import api from "@/lib/axios";

export async function getProducts({ limit, skip, sortBy, order }) {
  const params = { limit, skip };
  if (sortBy) params.sortBy = sortBy;
  if (order) params.order = order;
  const res = await api.get("/products", { params });
  return res.data; // { products, total, skip, limit }
}

export async function searchProducts(q, { limit, skip, signal }) {
  const res = await api.get("/products/search", {
    params: { q, limit, skip },
    signal, // lets us cancel stale requests
  });
  return res.data;
}

export async function getCategories() {
  const res = await api.get("/products/categories");
  return res.data;
}

export async function getProductsByCategory(category, { limit, skip }) {
  const res = await api.get(`/products/category/${category}`, {
    params: { limit, skip },
  });
  return res.data;
}

export async function getProduct(id) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}

export async function addProduct(product) {
  const res = await api.post("/products/add", product);
  return res.data;
}

export async function updateProduct(id, product) {
  const res = await api.put(`/products/${id}`, product);
  return res.data;
}

export async function deleteProduct(id) {
  const res = await api.delete(`/products/${id}`);
  return res.data;
}