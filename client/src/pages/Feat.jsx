import { useState, useEffect } from "react";
import { Upload, Trash2 } from "lucide-react";


function Features() {
  const [batch, setBatch] = useState("");
  const [year, setYear] = useState("");
  const [students, setStudents] = useState([]);

  
  useEffect(() => {
    if (batch && year) {
      fetch(`/api/students?batch=${batch}&year=${year}`)
        .then((res) => res.json())
        .then((data) => setStudents(data))
        .catch((err) => console.error("Error fetching students", err));
    }
  }, [batch, year]);

  // Promote student (increase year)
  const promoteStudent = (id, currentYear) => {
    fetch(`/api/students/${id}/promote`, { method: "PUT" })
      .then(() => {
        alert("Student promoted!");
        setStudents((prev) =>
          prev.map((s) => (s.id === id ? { ...s, year: currentYear + 1 } : s))
        );
      })
      .catch(() => alert("Promotion failed!"));
  };

  // Delete student
  const deleteStudent = (id) => {
    fetch(`/api/students/${id}`, { method: "DELETE" })
      .then(() => {
        alert("Student deleted!");
        setStudents((prev) => prev.filter((s) => s.id !== id));
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

        <div className="flex items-center gap-1 bg-blue-500 rounded-md text-white p-2 mr-2">
          <span>
            <Upload size={24} />
          </span>
          <button
            className="bg-blue-500 text-white px-3  rounded-md"
            onClick={() => promoteStudent(student.id, student.year)}
          >
            Promote
          </button>
        </div>
        <div className="flex items-center gap-1 bg-red-500 rounded-md text-white p-2 ml-2">
          <Trash2 size={24} />
          <button
            className="bg-red-500 text-white px-3 rounded-md"
            onClick={() => deleteStudent(student.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Features;