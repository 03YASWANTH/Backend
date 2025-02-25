import { useState } from "react";
import { Upload, Trash2 } from "lucide-react";

function Features() {
  const [batch, setBatch] = useState("");
  const [year, setYear] = useState("");

  const BASE_URL = "http://localhost:3000/api/v1/admin";

  // Promote students based on the selected year
  const promoteBatch = () => {
    if (!year) {
      alert("Please select a year first");
      return;
    }

    fetch(`${BASE_URL}/students/promote/${year}`, { method: "PUT" })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
      })
      .catch(() => alert("Promotion failed!"));
  };

  // Delete students by year and delete batch-related data
  const deleteBatch = () => {
    if (!year) {
      alert("Please select a year first");
      return;
    }

    fetch(`${BASE_URL}/students/year/${year}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Batch deleted successfully!");
      })
      .catch(() => alert("Delete failed!"));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Manage Students</h2>
      <div className="flex gap-4 mb-4">
        <select
          className="border p-2 rounded-md"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        >
          <option value="">Select Batch</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
        </select>

        <select
          className="border p-2 rounded-md"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Select Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        {/* Promote Button */}
        <div className="flex items-center gap-1 bg-blue-500 rounded-md text-white p-2 cursor-pointer" onClick={promoteBatch}>
          <Upload size={24} />
          <button className="bg-blue-500 text-white px-3 rounded-md">Promote</button>
        </div>

        {/* Delete Button */}
        <div className="flex items-center gap-1 bg-red-500 rounded-md text-white p-2 cursor-pointer" onClick={deleteBatch}>
          <Trash2 size={24} />
          <button className="bg-red-500 text-white px-3 rounded-md">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default Features;
