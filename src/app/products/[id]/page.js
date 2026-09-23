"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProduct } from "@/services/products";
import Loader from "@/components/Loader";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then((data) => {
        if (data.message) setNotFound(true); // DummyJSON returns a message on invalid id
        else setProduct(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (notFound) return <p className="text-center py-10">Product not found.</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex gap-3 overflow-x-auto mb-4">
        {product.images?.map((img, i) => (
          <img key={i} src={img} className="w-32 h-32 object-cover rounded" alt={`${product.title} ${i + 1}`} />
        ))}
      </div>
      <h1 className="text-xl font-semibold">{product.title}</h1>
      <p className="text-gray-600 mt-1">{product.description}</p>
      <p className="text-lg font-medium mt-2">${product.price}</p>

      <h2 className="font-semibold mt-4 mb-2">Reviews</h2>
      {product.reviews?.length ? (
        product.reviews.map((r, i) => (
          <div key={i} className="border-b py-2 text-sm">
            <p className="font-medium">{r.reviewerName} — ⭐ {r.rating}</p>
            <p>{r.comment}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No reviews yet.</p>
      )}
    </div>
  );
}