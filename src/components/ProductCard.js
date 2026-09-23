import Link from "next/link";

export default function ProductCard({ products, onDelete }) {
  return (
    <div className="md:hidden space-y-3">
      {products.map((p) => (
        <div key={p.id} className="border rounded-lg p-3 flex gap-3">
          <img src={p.thumbnail} alt={p.title} className="w-16 h-16 object-cover rounded" />
          <div className="flex-1">
            <Link href={`/products/${p.id}`} className="font-medium text-blue-600">
              {p.title}
            </Link>
            <p className="text-xs text-gray-500">{p.category}</p>
            <p className="text-sm">${p.price} · ⭐ {p.rating} · Stock: {p.stock}</p>
            <div className="mt-1 space-x-3 text-sm">
              <Link href={`/products/edit/${p.id}`} className="text-blue-600">
                Edit
              </Link>
              <button onClick={() => onDelete(p)} className="text-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}