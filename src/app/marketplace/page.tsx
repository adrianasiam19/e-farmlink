"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";

const Marketplace = () => {
  type Product = {
    id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    image: string;
    category?: string;
  };

  type OrderData = {
    product_id: number;
    quantity: number;
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [orderLoading, setOrderLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const categories = ["Fruits", "Vegetables", "Dairy", "Grains"];

  useEffect(() => {
    const access = typeof window !== "undefined" ? localStorage.getItem("access") : null;
    setToken(access);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/products/");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products", error);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchQuery = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchQuery && matchCategory;
  });

  const openOrderModal = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const placeOrder = async () => {
    if (!token || !selectedProduct) return;

    setOrderLoading(true);
    try {
      // Create order
      const orderRes = await axios.post(
        "http://localhost:8000/api/orders/",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Create order item
      await axios.post(
        "http://localhost:8000/api/order-items/",
        {
          order: orderRes.data.id,
          product: selectedProduct.id,
          quantity: quantity
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order placed successfully!");
      closeOrderModal();
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-start py-16 px-4 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold py-4 text-green-900">Marketplace</h1>
        <p className="text-gray-600">
          Shop fresh produce directly from farmers
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
          <input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md sm:text-sm px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="mt-12">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="mt-12">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-14 w-full">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-xl p-4 shadow hover:shadow-lg transition"
              >
                <div className="w-full h-40 relative mb-2">
                  <img
                    src={`${product.image}`}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                </div>
                <h2 className="text-lg font-semibold">{product.name}</h2>

                <p className="text-sm text-gray-500 line-clamp-2">
                  {product.description}
                </p>
                <p className="font-bold text-green-700 mt-2">
                  GHS {product.price}
                </p>
                <button
                  onClick={() => openOrderModal(product)}
                  className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded-md text-sm"
                >
                  Place Order
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/30">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Place Order</h2>
            
            <div className="mb-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-32 object-cover rounded-md mb-3"
              />
              <h3 className="font-semibold">{selectedProduct.name}</h3>
              <p className="text-gray-600 text-sm">{selectedProduct.description}</p>
              <p className="font-bold text-green-700 mt-2">GHS {selectedProduct.price}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max={selectedProduct.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Available stock: {selectedProduct.stock}
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold">
                Total: GHS {(parseFloat(selectedProduct.price) * quantity).toFixed(2)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeOrderModal}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={placeOrder}
                disabled={orderLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
              >
                {orderLoading ? "Placing Order..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Marketplace;