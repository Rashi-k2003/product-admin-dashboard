"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
  deleteProduct,
} from "@/services/products";
import { useDebounce } from "@/hooks/useDebounce";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import Pagination from "@/components/Pagination";
import ConfirmModal from "@/components/ConfirmModal";
import ProductTable from "@/components/ProductTable";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ---- read state from the URL (source of truth) ----
  const rawPage = parseInt(searchParams.get("page"));
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1; // guards ?page=abc / negative
  const limit = parseInt(searchParams.get("limit")) || 10;
  const qParam = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "asc";

  const [searchInput, setSearchInput] = useState(qParam);
  const debouncedSearch = useDebounce(searchInput, 500);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // helper: update the URL query params without a full reload
  function updateParams(updates) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === "" || val === null) params.delete(key);
      else params.set(key, val);
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  // when the debounced text changes, push it into the URL and reset to page 1
  useEffect(() => {
    if (debouncedSearch !== qParam) {
      updateParams({ q: debouncedSearch || undefined, page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // load categories once
  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const fetchData = useCallback(
    async (signal) => {
      setLoading(true);
      setError(false);
      try {
        const skip = (page - 1) * limit;
        let data;
        if (qParam) {
          // API can't search + filter by category together —
          // we prioritize search and ignore category while searching
          data = await searchProducts(qParam, { limit, skip, signal });
        } else if (category) {
          data = await getProductsByCategory(category, { limit, skip });
        } else {
          data = await getProducts({ limit, skip, sortBy, order });
        }

        let list = data.products || [];
        // client-side sort fallback for search/category results
        if (sortBy && (qParam || category)) {
          list = [...list].sort((a, b) => {
            const av = a[sortBy], bv = b[sortBy];
            if (typeof av === "string") return order === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
            return order === "asc" ? av - bv : bv - av;
          });
        }

        setProducts(list);
        setTotal(data.total || list.length);
      } catch (err) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    },
    [page, limit, qParam, category, sortBy, order]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort(); // cancels an in-flight request when params change again
  }, [fetchData]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  // clamp: if the URL asks for a page beyond the real range, we don't crash —
  // fetch above just returns fewer/no results and EmptyState handles it

  async function handleDelete(product) {
    await deleteProduct(product.id);
    // API doesn't really persist deletes — reflect it locally
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    setTotal((t) => t - 1);
    setDeleteTarget(null);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border rounded px-3 py-2 flex-1 min-w-[200px]"
        />

        <select
          value={category}
          disabled={!!qParam} // rule: search takes priority over category
          onChange={(e) => updateParams({ category: e.target.value, page: 1 })}
          className="border rounded px-3 py-2"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug || c} value={c.slug || c}>
              {c.name || c}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => updateParams({ sortBy: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="">Sort by</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="title">Title</option>
        </select>

        <select
          value={order}
          onChange={(e) => updateParams({ order: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>

        <select
          value={limit}
          onChange={(e) => updateParams({ limit: e.target.value, page: 1 })}
          className="border rounded px-3 py-2"
        >
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>

        <Link href="/products/add" className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Product
        </Link>
      </div>

      {qParam && (
        <p className="text-xs text-gray-500 mb-2">
          Category filter is disabled while searching. Clear search to filter by category.
        </p>
      )}

      {loading && <Loader />}
      {!loading && error && <ErrorState onRetry={() => fetchData()} />}
      {!loading && !error && products.length === 0 && <EmptyState />}

      {!loading && !error && products.length > 0 && (
        <>
          <ProductTable products={products} onDelete={setDeleteTarget} />
          <ProductCard products={products} onDelete={setDeleteTarget} />

          <p className="text-sm text-gray-500 mt-3">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </p>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => updateParams({ page: p })}
          />
        </>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.title}"?`}
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}