"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/protectedroute";

type OrderItem = {
  id: number;
  product: {
    id: number;
    name: string;
    price: string;
    image: string;
    description: string;
  };
  quantity: number;
};

type Order = {
  id: number;
  buyer: {
    id: number;
    first_name: string;
    email: string;
  };
  created_at: string;
  completed: boolean;
  items: OrderItem[];
};

const FarmerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const access = typeof window !== "undefined" ? localStorage.getItem("access") : null;
    const userInfo = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    
    setToken(access);
    if (userInfo) {
      try {
        setCurrentUser(JSON.parse(userInfo));
      } catch (error) {
        console.error("Failed to parse user info:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!token || !currentUser) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/orders/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, currentUser]);

  const markOrderCompleted = async (orderId: number) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/orders/${orderId}/`,
        { completed: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, completed: true }
          : order
      ));
      
      toast.success("Order marked as completed!");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    }
  };

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.completed)
      .reduce((total, order) => {
        const orderTotal = order.items.reduce((sum, item) => {
          return sum + (parseFloat(item.product?.price ?? "0") * item.quantity);
        }, 0);
        return total + orderTotal;
      }, 0);
  };

  const getPendingOrders = () => {
    return orders.filter(order => !order.completed);
  };

  const getCompletedOrders = () => {
    return orders.filter(order => order.completed);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
  <ProtectedRoute>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Orders Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage orders for your products
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{getPendingOrders().length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">GHS {getTotalRevenue().toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600">Orders from customers will appear here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                    order.completed ? "border-l-4 border-green-500" : "border-l-4 border-yellow-500"
                  }`}
                >
                  {/* Order Header */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Customer: {order.buyer.first_name} ({order.buyer.email})
                        </p>
                        <p className="text-sm text-gray-500">
                          Date: {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.completed
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.completed ? "Completed" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={`http://127.0.0.1:8000/${item.product.image}`}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{item.product.description}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Quantity: {item.quantity} × GHS {item.product.price}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              GHS {(parseFloat(item.product?.price ?? "0") * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Total and Actions */}
                    <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          Total: GHS{" "}
                          {order.items
                            .reduce(
                              (total, item) =>
                                total + parseFloat(item.product?.price ?? "0") * item.quantity,
                              0
                            )
                            .toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        {!order.completed && (
                          <button
                            onClick={() => markOrderCompleted(order.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                          >
                            Mark as Completed
                          </button>
                        )}
                        {order.completed && (
                          <span className="text-green-600 text-sm font-medium">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </ProtectedRoute>
  );
};

export default FarmerOrders;