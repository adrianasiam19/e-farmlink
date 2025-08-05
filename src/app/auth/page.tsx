"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [userRole, setUserRole] = useState<"farmer" | "customer">("customer");

  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  const [signUpForm, setSignUpForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [signInLoading, setSignInLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInForm({ ...signInForm, [e.target.name]: e.target.value });
  };

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm({ ...signUpForm, [e.target.name]: e.target.value });
  };

  const router = useRouter();
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInLoading(true);

    if (!signInForm.email || !signInForm.password) {
      toast.error("Please fill in all fields.");
      setSignInLoading(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signInForm),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.detail || "Login failed.");
        setSignInLoading(false);
        return;
      }

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");


      toast.success("Signed in successfully!");
      setSignInForm({ email: "", password: "" });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpLoading(true);

    const { first_name, last_name, email, password, confirmPassword } =
      signUpForm;

    if (!first_name || !last_name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      setSignUpLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setSignUpLoading(false);
      return;
    }

    const payload = {
      email,
      password,
      first_name,
      last_name,
      is_farmer: userRole === "farmer",
      is_buyer: userRole === "customer",
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.detail || "Registration failed.");
        setSignUpLoading(false);
        return;
      }

      toast.success(`Account created successfully as a ${userRole}!`);
      setSignUpForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setActiveTab("signin");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-16">
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="group inline-flex items-center text-white font-semibold text-sm md:text-base"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-all duration-300" />
          <p>Return Home</p>
        </Link>
      </div>
      <div className="absolute inset-0 bg-[url(/auth.jpg)] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="z-10 max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "signin"
                ? "bg-white text-green-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "signup"
                ? "bg-white text-green-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Sign In */}
        {activeTab === "signin" && (
          <div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-green-900">
              Welcome back
            </h2>
            <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
              <input
                type="email"
                name="email"
                value={signInForm.email}
                onChange={handleSignInChange}
                required
                placeholder="Email address"
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <input
                type="password"
                name="password"
                value={signInForm.password}
                onChange={handleSignInChange}
                required
                placeholder="Password"
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <button
                type="submit"
                disabled={signInLoading}
                className={`w-full py-2 px-4 rounded-md text-white text-sm ${
                  signInLoading
                    ? "bg-green-700 cursor-not-allowed"
                    : "bg-green-900 hover:bg-green-800"
                }`}
              >
                {signInLoading ? (
                  <span className="loader w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin inline-block" />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Sign Up */}
        {activeTab === "signup" && (
          <div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-green-900">
              Create your account
            </h2>

            {/* Role Selection */}
            <div className="mt-6 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to sign up as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserRole("customer")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    userRole === "customer"
                      ? "border-green-500 bg-green-50 text-green-900"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold">Customer</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Buy fresh produce
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole("farmer")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    userRole === "farmer"
                      ? "border-green-500 bg-green-50 text-green-900"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold">Farmer</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Sell your products
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSignUp}>
              <input
                type="text"
                name="first_name"
                value={signUpForm.first_name}
                onChange={handleSignUpChange}
                required
                placeholder="First Name"
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <input
                type="text"
                name="last_name"
                value={signUpForm.last_name}
                onChange={handleSignUpChange}
                required
                placeholder="Last Name"
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <input
                type="email"
                name="email"
                value={signUpForm.email}
                onChange={handleSignUpChange}
                required
                placeholder="Email address"
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <input
                type="password"
                name="password"
                value={signUpForm.password}
                onChange={handleSignUpChange}
                required
                placeholder="Password"
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <input
                type="password"
                name="confirmPassword"
                value={signUpForm.confirmPassword}
                onChange={handleSignUpChange}
                required
                placeholder="Confirm Password"
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <button
                type="submit"
                disabled={signUpLoading}
                className={`w-full py-2 px-4 rounded-md text-white text-sm ${
                  signUpLoading
                    ? "bg-green-700 cursor-not-allowed"
                    : "bg-green-900 hover:bg-green-800"
                }`}
              >
                {signUpLoading ? (
                  <span className="loader w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin inline-block" />
                ) : (
                  `Sign Up as ${
                    userRole.charAt(0).toUpperCase() + userRole.slice(1)
                  }`
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
