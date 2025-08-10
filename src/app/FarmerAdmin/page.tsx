"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/protectedroute";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  stock: string;
}

const FarmerAdminPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

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

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", stock: "" });
    setImage(null);
    setPreview(null);
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
      resetForm();
      setShowModal(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Enhanced Delete function
  const handleDelete = async (productId: number) => {
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    const product = products.find(p => p.id === productId);
    const confirmDelete = confirm(
      `Are you sure you want to delete "${product?.name}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    setDeleteLoading(productId);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/my-products/${productId}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      const result = await res.json();
      toast.success(result.message || "Product deleted successfully!");
      fetchProducts(); // Refresh product list
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Edit product functions
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock.toString(),
    });
    setPreview(`http://127.0.0.1:8000/${product.image}`);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.stock
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!token) {
      toast.error("You must be logged in to update a product.");
      return;
    }

    setLoading(true);

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    submitData.append("stock", formData.stock);
    
    // Only append image if a new one was selected
    if (image) {
      submitData.append("image", image);
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/my-products/${editingProduct.id}/update/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: submitData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update product");
      }

      toast.success("Product updated successfully!");
      resetForm();
      setShowEditModal(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    resetForm();
  };

  const closeAddModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-green-50 pt-24 px-4 md:px-8 lg:px-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-900">
            Farmer Dashboard
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              + Add Product
            </button>
            <Link 
              href="/AdminOrders" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Orders
            </Link>
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No products added yet.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="relative bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-200"
              >
                <img
                  src={`http://127.0.0.1:8000/${product.image}`}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="text-lg font-semibold mt-3 text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-800 font-medium">
                    ₵{product.price}
                  </p>
                  <p className="text-sm text-gray-600">
                    Stock: {product.stock}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
                    title="Edit product"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deleteLoading === product.id}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
                    title="Delete product"
                  >
                    {deleteLoading === product.id ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800">
                Add New Product
              </h2>
              <button
                className="text-gray-500 hover:text-red-600 text-2xl"
                onClick={closeAddModal}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <div className="flex gap-4">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price (₵)"
                  step="0.01"
                  min="0"
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  min="0"
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                required
              />
              {preview && (
                <div className="flex justify-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 h-32 w-32 object-cover rounded-md border"
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-md text-white font-semibold text-sm transition-all duration-300 ${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding Product...
                  </span>
                ) : (
                  "Add Product"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-800">
                Edit Product
              </h2>
              <button
                className="text-gray-500 hover:text-red-600 text-2xl"
                onClick={closeEditModal}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <div className="flex gap-4">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price (₵)"
                  step="0.01"
                  min="0"
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  min="0"
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image {image ? "(New image selected)" : "(Current image will be kept)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {preview && (
                <div className="flex justify-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 h-32 w-32 object-cover rounded-md border"
                  />
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 py-3 rounded-md border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 rounded-md text-white font-semibold text-sm transition-all duration-300 ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    "Update Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </ProtectedRoute>
  );
};

export default FarmerAdminPage;