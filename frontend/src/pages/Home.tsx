import React from 'react';
import { Calendar, Users, Clock, Award } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="pl-72 pr-8 py-10"> {/* pl-72 to account for fixed sidebar */}
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to Smart Campus</h1>
        <p className="text-xl text-gray-600 mb-12">Efficient facility and asset booking system</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition-all">
            <Calendar className="w-12 h-12 text-blue-600 mb-6" />
            <h3 className="text-2xl font-semibold">Easy Booking</h3>
            <p className="text-gray-600 mt-3">Book rooms, labs, and equipment with real-time availability.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition-all">
            <Users className="w-12 h-12 text-green-600 mb-6" />
            <h3 className="text-2xl font-semibold">Conflict Free</h3>
            <p className="text-gray-600 mt-3">Smart system prevents overlapping bookings automatically.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition-all">
            <Clock className="w-12 h-12 text-purple-600 mb-6" />
            <h3 className="text-2xl font-semibold">Quick Approval</h3>
            <p className="text-gray-600 mt-3">Admin approval system with clear workflow.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition-all">
            <Award className="w-12 h-12 text-amber-600 mb-6" />
            <h3 className="text-2xl font-semibold">Audit Ready</h3>
            <p className="text-gray-600 mt-3">Complete history and status tracking for every booking.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;