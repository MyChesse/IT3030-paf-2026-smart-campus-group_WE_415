import React from "react";

const facilitiesData = [
  {
    category: "Lecture Halls",
    items: [
      { name: "Hall A", available: true },
      { name: "Hall B", available: false },
      { name: "Hall C", available: true },
    ],
  },
  {
    category: "Labs",
    items: [
      { name: "Computer Lab 1", available: true },
      { name: "Physics Lab", available: false },
      { name: "Chemistry Lab", available: true },
    ],
  },
  {
    category: "Meeting Rooms",
    items: [
      { name: "Room 101", available: true },
      { name: "Room 102", available: false },
      { name: "Room 103", available: true },
    ],
  },
  {
    category: "Equipment",
    items: [
      { name: "Projectors", available: true },
      { name: "Cameras", available: false },
      { name: "Microphones", available: true },
      { name: "Speakers", available: true },
    ],
  },
];

const Facilities: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-8">
        Available Facilities
      </h1>
      {facilitiesData.map((facility, index) => (
        <div key={index} className="mb-12">
          <h2 className="text-3xl font-bold text-cyan-400 mb-6">
            {facility.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facility.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-cyan-400 transition"
              >
                <h3 className="text-2xl font-bold text-white mb-4">
                  {item.name}
                </h3>
                <p
                  className={`text-lg font-semibold mb-4 ${
                    item.available ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {item.available ? "Available" : "Not Available"}
                </p>
                {item.available && (
                  <button className="px-4 py-2 bg-cyan-400 text-black font-semibold rounded-lg shadow-md hover:bg-cyan-500 transition">
                    Book Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Facilities;