"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/protectedroute";
import Link from "next/link";

const FarmerAdminPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;

  const fetchProducts = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/api/my-products/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log("Fetched products:", data);
      setProducts(data);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.stock ||
      !image
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!token) {
      toast.error("You must be logged in to add a product.");
      return;
    }

    setLoading(true);

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    submitData.append("stock", formData.stock);
    submitData.append("image", image);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/products/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to add product");
      }

      toast.success("Product added successfully!");
      setFormData({ name: "", description: "", price: "", stock: "" });
      setImage(null);
      setPreview(null);
      setShowModal(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  //delete
  const handleDelete = async (productId: number) => {
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/products/${productId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      toast.success("Product deleted successfully!");
      fetchProducts(); // Refresh product list
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-green-50 pt-24 px-4 md:px-8 lg:px-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-900">
            Farmer Dashboard
          </h2>
          <div>
            <button
            onClick={() => setShowModal(true)}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            + Add Product
          </button>
           <Link href="/AdminOrders" className="ml-20 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium">Orders</Link>
          </div>
          
        </div>
       

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <p>No products added yet.</p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="relative bg-white rounded-lg shadow p-4 border border-gray-200"
              >
                <img
                  src={`http://127.0.0.1:8000/${product.image}`}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  {product.description}
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  Price: ₵{product.price} | Stock: {product.stock}
                </p>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                  title="Delete product"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-md">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-lg"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-green-800 text-center">
              Add New Product
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full px-4 py-2 border rounded-md text-sm"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Description"
                className="w-full px-4 py-2 border rounded-md text-sm resize-none"
                required
              />
              <div className="flex gap-4">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price (₵)"
                  className="w-1/2 px-4 py-2 border rounded-md text-sm"
                  required
                />
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  className="w-1/2 px-4 py-2 border rounded-md text-sm"
                  required
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-2 h-36 object-cover rounded-md border"
                />
              )}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-md text-white font-semibold text-sm transition-all duration-300 ${
                  loading
                    ? "bg-green-700 cursor-not-allowed"
                    : "bg-green-900 hover:bg-green-800"
                }`}
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Submit Product"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </ProtectedRoute>
  );
};

export default FarmerAdminPage;
