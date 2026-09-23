export default function EmptyState({ message = "No products found." }) {
  return <p className="text-center text-gray-500 py-10">{message}</p>;
}