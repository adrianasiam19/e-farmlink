// src/app/how-it-works/page.tsx
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const HowItWorksPage = () => (
    <>
    <Navbar />
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4 py-16">
    <div className="w-full max-w-4xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-10">
      <div className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-green-900 mb-4 tracking-tight drop-shadow-lg">How It Works</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">A simple, secure, and smart way to connect farmers and customers. Here’s how you can get started and thrive on e-farmlink.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Step 1 */}
        <div className="group flex flex-col items-center text-center p-8 bg-green-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 hover:border-green-300">
          <div className="mb-4 text-green-700">
            <span className="inline-block w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-2xl font-bold text-green-900 mb-2">1</span>
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 1.79-8 4v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2c0-2.21-3.582-4-8-4Z"/></svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-green-900">Sign Up or Log In</h2>
          <p className="text-gray-700 text-base">Farmers and customers create an account and select their role.</p>
        </div>
        {/* Step 2 */}
        <div className="group flex flex-col items-center text-center p-8 bg-green-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 hover:border-green-300">
          <div className="mb-4 text-green-700">
            <span className="inline-block w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-2xl font-bold text-green-900 mb-2">2</span>
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2H4V6Zm0 4h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8Zm4 2v4h8v-4H8Z"/></svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-green-900">Farmers List Products</h2>
          <p className="text-gray-700 text-base">Farmers add fresh produce to the marketplace, including details and prices.</p>
        </div>
        {/* Step 3 */}
        <div className="group flex flex-col items-center text-center p-8 bg-green-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 hover:border-green-300">
          <div className="mb-4 text-green-700">
            <span className="inline-block w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-2xl font-bold text-green-900 mb-2">3</span>
            {/* Shopping Cart Icon */}
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM7.16 14l.94-2h7.8a1 1 0 0 0 .96-.74l2.1-7A1 1 0 0 0 18 3H6.21l-.94-2H2v2h2l3.6 7.59-1.35 2.44A1 1 0 0 0 6 16h12v-2H7.16Z"/></svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-green-900">Customers Browse & Buy</h2>
          <p className="text-gray-700 text-base">Customers explore available products, compare options, and place orders directly.</p>
        </div>
        {/* Step 4 */}
        <div className="group flex flex-col items-center text-center p-8 bg-green-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 hover:border-green-300">
          <div className="mb-4 text-green-700">
            <span className="inline-block w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-2xl font-bold text-green-900 mb-2">4</span>
            {/* Bell/Notification Icon */}
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 0 0-5-5.92V4a1 1 0 0 0-2 0v1.08A6 6 0 0 0 6 11v5l-1.29 1.29A1 1 0 0 0 6 19h12a1 1 0 0 0 .71-1.71L18 16Z"/></svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-green-900">Real-Time Updates</h2>
          <p className="text-gray-700 text-base">Both parties receive instant notifications about orders, messages, and status changes.</p>
        </div>
        {/* Step 5 */}
        <div className="group flex flex-col items-center text-center p-8 bg-green-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 hover:border-green-300">
          <div className="mb-4 text-green-700">
            <span className="inline-block w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-2xl font-bold text-green-900 mb-2">5</span>
            {/* Lock/Security Icon */}
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17 8V7a5 5 0 0 0-10 0v1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2ZM7 7a5 5 0 0 1 10 0v1H7V7Zm10 12H7v-8h10v8Z"/></svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-green-900">Secure Transactions</h2>
          <p className="text-gray-700 text-base">Payments and order details are managed securely through the platform.</p>
        </div>
        {/* Step 6 */}
        <div className="group flex flex-col items-center text-center p-8 bg-green-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 hover:border-green-300">
          <div className="mb-4 text-green-700">
            <span className="inline-block w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-2xl font-bold text-green-900 mb-2">6</span>
            {/* Star/Feedback Icon */}
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-green-900">Delivery & Feedback</h2>
          <p className="text-gray-700 text-base">Farmers fulfill orders, and customers can rate their experience to help others.</p>
        </div>
      </div>
    </div>
  </div>
  <Footer />
  </>
);

export default HowItWorksPage;