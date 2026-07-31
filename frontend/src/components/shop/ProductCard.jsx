'use client';

import Image from 'next/image';

export default function ProductCard({ product }) {
  const isOutOfStock = product.stockQuantity === 0;

  const handleAddToCart = () => {
    // We will attach the Cart context state here next!
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div className="group border border-gray-200 rounded-md bg-white p-6 flex flex-col justify-between hover:border-black transition-all duration-300">
      <div>
        {/* Product Image Container */}
        <div className="relative w-full h-[260px] bg-[#EBEBEB] rounded-sm overflow-hidden mb-6">
          <Image
            src={product.imageUrl || '/hero-interior.jpg'} // Fallback image if none provided
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Stock Tag */}
          <span
            className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-sm uppercase tracking-wider ${
              isOutOfStock
                ? 'bg-red-100 text-red-700'
                : 'bg-white text-black shadow-sm'
            }`}
          >
            {isOutOfStock ? 'Sold Out' : `${product.stockQuantity} Left`}
          </span>
        </div>

        {/* Product Info */}
        <h3 className="text-xl font-bold tracking-tight mb-2 text-black">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
          {product.description}
        </p>
      </div>

      {/* Price & Action */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs text-gray-500 block">Price</span>
          <span className="text-xl font-bold text-black tracking-tight">
            Rs. {product.price}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="bg-black text-white px-5 py-2.5 text-sm font-medium rounded-md hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}