"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProduct, updateProduct } from "@/services/products";
import Loader from "@/components/Loader";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", category: "", price: "", stock: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getProduct(id)
      .then((data) => {
        setForm({
          title: data.title || "",
          category: data.category || "",
          price: data.price ?? "",
          stock: data.stock ?? "",
        });
      })
      .finally(() => setFetching(false));
  }, [id]);

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.category.trim()) e.category = "Category is required";
    if (!form.price || Number(form.price) <= 0) e.price = "Price must be greater than 0";
    if (!form.stock || Number(form.stock) < 0) e.stock = "Stock must be 0 or more";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading || !validate()) return;
    setLoading(true);
    try {
      await updateProduct(id, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      // API doesn't persist this either — navigating back reflects intent only
      router.push("/products");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <Loader />;

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-3">
      <h1 className="text-lg font-semibold">Edit Product</h1>

      <div>
        <input
          placeholder="Title"
          className="border rounded px-3 py-2 w-full"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        {errors.title && <p className="text-red-600 text-xs">{errors.title}</p>}
      </div>

      <div>
        <input
          placeholder="Category"
          className="border rounded px-3 py-2 w-full"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        {errors.category && <p className="text-red-600 text-xs">{errors.category}</p>}
      </div>

      <div>
        <input
          placeholder="Price"
          type="number"
          className="border rounded px-3 py-2 w-full"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        {errors.price && <p className="text-red-600 text-xs">{errors.price}</p>}
      </div>

      <div>
        <input
          placeholder="Stock"
          type="number"
          className="border rounded px-3 py-2 w-full"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        {errors.stock && <p className="text-red-600 text-xs">{errors.stock}</p>}
      </div>

      <button
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}