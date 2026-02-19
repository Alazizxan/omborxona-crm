import Link from "next/link";

export default function CategoryCard({ category }: any) {
  return (
    <Link
      href={`/category/${category.id}`}
      className="block p-4 bg-white rounded-xl border border-gray-200"
    >
      {category.name}
    </Link>
  );
}
