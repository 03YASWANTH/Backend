import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const EXCLUDED_WORDS = ["in", "of", "and", "the", "for", "with", "to"];

const generateSubjectCode = (subject) => {
  const words = subject
    .split(" ")
    .filter((word) => !EXCLUDED_WORDS.includes(word.toLowerCase()))
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);

  return words || subject.substring(0, 3).toUpperCase();
};

const SupremePerformanceBarChart = ({ marksData, loading, error }) => {
  const [activeSubject, setActiveSubject] = useState(null);

  const processedData = useMemo(() => {
    if (!marksData?.marks?.length) return [];

    const maxMarks = Math.max(...marksData.marks.map((item) => item.marks));

    return marksData.marks.map((item, index) => ({
      subjectCode: generateSubjectCode(item.subject),
      fullSubject: item.subject,
      marks: item.marks,
      normalizedMarks: (item.marks / maxMarks) * 100,
      color: `hsl(${(index / marksData.marks.length) * 360}, 70%, 50%)`,
    }));
  }, [marksData]);

  if (loading)
    return (
      <div className="h-80 flex items-center justify-center text-white">
        Loading Performance...
      </div>
    );
  if (error)
    return (
      <div className="h-80 flex items-center justify-center text-white bg-red-500/20 p-4">
        {error}
      </div>
    );
  if (!processedData.length)
    return (
      <div className="h-80 flex items-center justify-center text-white">
        No Performance Data
      </div>
    );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-blue-900/90 p-4 rounded-lg shadow-2xl space-y-2">
          <h3 className="text-white font-bold text-lg">{data.fullSubject}</h3>
          <div className="flex justify-between items-center">
            <span className="text-yellow-400 font-semibold">Marks:</span>
            <span className="text-white font-bold ml-2">{data.marks}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-96 mt-20 relative">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          barSize={80}
          onMouseMove={(state) => {
            if (
              state.isTooltipActive &&
              state.activeTooltipIndex !== undefined
            ) {
              setActiveSubject(processedData[state.activeTooltipIndex]);
            }
          }}
          onMouseLeave={() => setActiveSubject(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="subjectCode"
            stroke="#fff"
            interval={0}
            textAnchor="end"
            height={60}
          />
          <YAxis stroke="#fff" domain={[0, 30]} />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              fill: "rgba(255,255,255,0.1)",
            }}
          />
          <Bar
            radius={[5, 5, 0, 0]}
            dataKey="marks"
            fill="#ffd700"
            activeBar={{ fill: "#ff6b6b" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SupremePerformanceBarChart;
