"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProduct } from "@/services/products";

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", category: "", price: "", stock: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    if (loading || !validate()) return; // guards against double-submit and bad data
    setLoading(true);
    try {
      await addProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      // API doesn't actually persist this — we just navigate back to the list.
      // See README notes on this.
      router.push("/products");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-3">
      <h1 className="text-lg font-semibold">Add Product</h1>

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