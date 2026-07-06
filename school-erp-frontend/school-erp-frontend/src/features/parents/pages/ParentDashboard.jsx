// src/features/parent/pages/ParentDashboard.jsx
import React from "react";

export const ParentDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Parent Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Children</h3>
          <p className="text-3xl font-bold text-blue-600">2</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Average Grade</h3>
          <p className="text-3xl font-bold text-green-600">A-</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">School Events</h3>
          <p className="text-3xl font-bold text-orange-600">4</p>
        </div>
      </div>
    </div>
  );
};