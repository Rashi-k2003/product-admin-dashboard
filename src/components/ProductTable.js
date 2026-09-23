import Link from "next/link";

export default function ProductTable({ products, onDelete }) {
  return (
    <table className="w-full text-sm hidden md:table">
      <thead>
        <tr className="text-left border-b">
          <th className="py-2">Image</th>
          <th>Title</th>
          <th>Category</th>
          <th>Price</th>
          <th>Rating</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-b">
            <td className="py-2">
              <img src={p.thumbnail} alt={p.title} className="w-12 h-12 object-cover rounded" />
            </td>
            <td>
              <Link href={`/products/${p.id}`} className="text-blue-600">
                {p.title}
              </Link>
            </td>
            <td>{p.category}</td>
            <td>${p.price}</td>
            <td>{p.rating}</td>
            <td>{p.stock}</td>
            <td className="space-x-2">
              <Link href={`/products/edit/${p.id}`} className="text-blue-600">
                Edit
              </Link>
              <button onClick={() => onDelete(p)} className="text-red-600">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}