import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BellIcon,
  UserCircleIcon,
  AcademicCapIcon,
  CogIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon
} from "@heroicons/react/24/outline";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full bg-black bg-opacity-50 backdrop-blur-md text-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-cyan-400 cursor-pointer" onClick={() => navigate("/")}>Smart Campus</div>
        <ul className="flex space-x-6">
          <li className="hover:text-cyan-400 cursor-pointer" onClick={() => navigate("/")}>Home</li>
          <li className="hover:text-cyan-400 cursor-pointer" onClick={() => navigate("/facilities")}>Facilities</li>
          <li className="hover:text-cyan-400 cursor-pointer" onClick={() => navigate("/bookings")}>Bookings</li>
          <li className="hover:text-cyan-400 cursor-pointer" onClick={() => navigate("/tickets")}>Tickets</li>
          <li className="hover:text-cyan-400 cursor-pointer" onClick={() => navigate("/admin")}>Admin</li>
        </ul>
        <div className="flex items-center space-x-4">
          <BellIcon className="h-6 w-6 text-white hover:text-cyan-400 cursor-pointer" />
          <UserCircleIcon className="h-8 w-8 text-white hover:text-cyan-400 cursor-pointer" />
        </div>
      </div>
    </nav>
  );
};

const Hero: React.FC = () => {
  const navigate = useNavigate(); // Add navigation hook

  return (
    <section className="h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white flex flex-col justify-center items-center">
      <h1 className="text-5xl md:text-7xl font-extrabold text-center text-cyan-400 mb-4">
        Smart Campus Management System
      </h1>
      <p className="text-lg md:text-2xl text-center text-gray-300 mb-8">
        Manage facilities, bookings, and maintenance effortlessly.
      </p>
      <div className="flex space-x-4">
        <button className="px-6 py-3 bg-cyan-400 text-black font-semibold rounded-lg shadow-md hover:bg-cyan-500 transition">
          Create Booking
        </button>
        <button
          className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition"
          onClick={() => navigate("/facilities")} // Navigate to Facilities page
        >
          View Facilities
        </button>
      </div>
    </section>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-6 rounded-lg shadow-lg hover:shadow-cyan-400 hover:scale-105 transition transform">
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-12 w-12 text-cyan-400">{icon}</div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

const Modules: React.FC = () => {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-cyan-400 mb-12">
          System Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<AcademicCapIcon className="h-full w-full" />}
            title="Facilities & Assets Catalogue"
            description="Manage lecture halls, labs, rooms, and equipment. View capacity, location, and availability."
          />
          <FeatureCard
            icon={<ClipboardDocumentListIcon className="h-full w-full" />}
            title="Booking Management"
            description="Request and manage bookings with status workflows: Pending, Approved, Rejected, Cancelled."
          />
          <FeatureCard
            icon={<CogIcon className="h-full w-full" />}
            title="Maintenance & Incident Tickets"
            description="Report issues with resources. Track ticket workflows: Open → In Progress → Resolved → Closed."
          />
          <FeatureCard
            icon={<ChatBubbleLeftRightIcon className="h-full w-full" />}
            title="Notifications"
            description="Receive real-time updates for bookings and tickets."
          />
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-400 py-6 text-center">
      <p>&copy; 2026 Smart Campus. All rights reserved.</p>
    </footer>
  );
};

const Home: React.FC = () => {
  return (
    <div className="bg-black text-white w-full min-h-screen"> {/* Added w-full and min-h-screen for full width and height */}
      <Navbar />
      <Hero />
      <Modules />
      <Footer />
    </div>
  );
};

export default Home;