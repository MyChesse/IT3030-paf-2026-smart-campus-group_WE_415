import React, { useState } from "react";

const AdminDashboard: React.FC = () => {
  const [facilityType, setFacilityType] = useState("Lecture Hall");
  const [facilityName, setFacilityName] = useState("");
  const [facilities, setFacilities] = useState([
    { type: "Lecture Hall", name: "Hall A" },
    { type: "Lab", name: "Computer Lab 1" },
    { type: "Meeting Room", name: "Room 101" },
    { type: "Equipment", name: "Projector" },
  ]);

  const handleAddFacility = () => {
    if (facilityName.trim() !== "") {
      setFacilities([...facilities, { type: facilityType, name: facilityName }]);
      setFacilityName("");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-8">
        Admin Dashboard
      </h1>

      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Add Facility</h2>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Facility Type</label>
          <select
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={facilityType}
            onChange={(e) => setFacilityType(e.target.value)}
          >
            <option value="Lecture Hall">Lecture Hall</option>
            <option value="Lab">Lab</option>
            <option value="Meeting Room">Meeting Room</option>
            <option value="Equipment">Equipment</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Facility Name</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
          />
        </div>
        <button
          className="px-4 py-2 bg-cyan-400 text-black font-semibold rounded-lg shadow-md hover:bg-cyan-500 transition"
          onClick={handleAddFacility}
        >
          Add Facility
        </button>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Existing Facilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-cyan-400 transition"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {facility.name}
              </h3>
              <p className="text-gray-300">Type: {facility.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;