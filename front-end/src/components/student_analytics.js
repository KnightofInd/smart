import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

// Import the JSON data directly
const studentData = {
  "students": [
    {
      "id": 1,
      "name": "Alice",
      "math": 85,
      "science": 92,
      "english": 88,
      "history": 78,
      "geography": 90
    },
    {
      "id": 2,
      "name": "Bob",
      "math": 75,
      "science": 85,
      "english": 92,
      "history": 88,
      "geography": 85
    },
    {
      "id": 3,
      "name": "Charlie",
      "math": 90,
      "science": 88,
      "english": 85,
      "history": 92,
      "geography": 88
    },
    {
      "id": 4,
      "name": "David",
      "math": 82,
      "science": 78,
      "english": 90,
      "history": 85,
      "geography": 92
    },
    {
      "id": 5,
      "name": "Eve",
      "math": 95,
      "science": 94,
      "english": 89,
      "history": 91,
      "geography": 87
    },
    {
      "id": 6,
      "name": "Frank",
      "math": 70,
      "science": 75,
      "english": 80,
      "history": 72,
      "geography": 78
    },
    {
      "id": 7,
      "name": "Grace",
      "math": 88,
      "science": 87,
      "english": 91,
      "history": 84,
      "geography": 89
    },
    {
      "id": 8,
      "name": "Henry",
      "math": 83,
      "science": 81,
      "english": 84,
      "history": 86,
      "geography": 82
    },
    {
      "id": 9,
      "name": "Ivy",
      "math": 91,
      "science": 90,
      "english": 88,
      "history": 89,
      "geography": 93
    },
    {
      "id": 10,
      "name": "Jack",
      "math": 79,
      "science": 82,
      "english": 86,
      "history": 81,
      "geography": 84
    }
  ]
};

const StudentAnalytics = () => {
  const subjects = ['math', 'science', 'english', 'history', 'geography'];
  
  const subjectAverages = subjects.map(subject => ({
    subject: subject.charAt(0).toUpperCase() + subject.slice(1),
    average: parseFloat((studentData.students.reduce((sum, student) => sum + student[subject], 0) / studentData.students.length).toFixed(2))
  }));

  const topPerformers = studentData.students
    .map(student => ({
      name: student.name,
      average: parseFloat((subjects.reduce((sum, subject) => sum + student[subject], 0) / subjects.length).toFixed(2))
    }))
    .filter(student => student.average > 85)
    .sort((a, b) => b.average - a.average);

  const subjectWiseData = studentData.students.map(student => ({
    name: student.name,
    ...subjects.reduce((acc, subject) => ({
      ...acc,
      [subject]: student[subject]
    }), {})
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Averages */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Subject Averages</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAverages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="average" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Performance Comparison */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Performance Comparison</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={subjectWiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                {subjects.map((subject, index) => (
                  <Line 
                    key={subject}
                    type="monotone"
                    dataKey={subject}
                    stroke={`hsl(${index * 360 / subjects.length}, 70%, 50%)`}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Quick Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Class Average</p>
              <p className="text-xl font-bold text-indigo-600">
                {(subjectAverages.reduce((sum, subj) => sum + subj.average, 0) / subjects.length).toFixed(2)}%
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Top Score</p>
              <p className="text-xl font-bold text-emerald-600">
                {Math.max(...studentData.students.flatMap(student => subjects.map(subj => student[subj])))}%
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-xl font-bold text-amber-600">{studentData.students.length}</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Top Performers</p>
              <p className="text-xl font-bold text-violet-600">{topPerformers.length}</p>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Top Performers (Avg > 85)</h3>
          <div className="space-y-2">
            {topPerformers.map((student, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white rounded-md">
                <span className="font-medium text-gray-700">{student.name}</span>
                <span className="text-indigo-600 font-semibold">{student.average}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;