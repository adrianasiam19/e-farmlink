import { LuCircleHelp } from "react-icons/lu";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      <div className="fixed bottom-10 left-10 z-10">
        <button className="items-center justify-center font-bold flex bg-green-900 text-white px-4 py-2 rounded-full gap-2 hover:scale-105 transition duration-300">
          <LuCircleHelp className="text-2xl" />
          Help
        </button>
      </div>
      <div>
        <Hero />
      </div>
      <Footer />
    </div>
  );
}
