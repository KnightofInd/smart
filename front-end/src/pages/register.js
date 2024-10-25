import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const ADD_STUDENT = gql`
  mutation AddStudent(
    $name: String!,
    $email: String!,
    $phone_number: String,
    $standard: String!,
    $college_name: String!,
    $date_of_birth: date,
    $address: String,
    $parent_name: String,
    $enrollment_year: Int,
    $major_subject: String
  ) {
    insert_students_one(object: {
      name: $name,
      email: $email,
      phone_number: $phone_number,
      standard: $standard,
      college_name: $college_name,
      date_of_birth: $date_of_birth,
      address: $address,
      parent_name: $parent_name,
      enrollment_year: $enrollment_year,
      major_subject: $major_subject
    }) {
      student_id
      name
      email
    }
  }
`;

const ADD_TEACHER = gql`
  mutation AddTeacher(
    $name: String!,
    $email: String!,
    $phone_number: String,
    $college_name: String!,
    $classes: String!,
    $date_of_birth: date,
    $address: String,
    $subjects_taught: String,
    $years_of_experience: Int,
    $qualification: String
  ) {
    insert_teachers_one(object: {
      name: $name,
      email: $email,
      phone_number: $phone_number,
      college_name: $college_name,
      classes: $classes,
      date_of_birth: $date_of_birth,
      address: $address,
      subjects_taught: $subjects_taught,
      years_of_experience: $years_of_experience,
      qualification: $qualification
    }) {
      teacher_id
      name
      email
    }
  }
`;

const RegisterPage = () => {
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    college_name: '',
    date_of_birth: '',
    address: '',
    // Student specific fields
    standard: '',
    parent_name: '',
    enrollment_year: '',
    major_subject: '',
    // Teacher specific fields
    classes: '',
    subjects_taught: '',
    years_of_experience: '',
    qualification: ''
  });

  const [addStudent] = useMutation(ADD_STUDENT);
  const [addTeacher] = useMutation(ADD_TEACHER);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (userType === 'student') {
        const { data } = await addStudent({
          variables: {
            name: formData.name,
            email: formData.email,
            phone_number: formData.phone_number,
            standard: formData.standard,
            college_name: formData.college_name,
            date_of_birth: formData.date_of_birth,
            address: formData.address,
            parent_name: formData.parent_name,
            enrollment_year: parseInt(formData.enrollment_year),
            major_subject: formData.major_subject
          }
        });
        setSuccess('Student registered successfully!');
      } else {
        const { data } = await addTeacher({
          variables: {
            name: formData.name,
            email: formData.email,
            phone_number: formData.phone_number,
            college_name: formData.college_name,
            classes: formData.classes,
            date_of_birth: formData.date_of_birth,
            address: formData.address,
            subjects_taught: formData.subjects_taught,
            years_of_experience: parseInt(formData.years_of_experience),
            qualification: formData.qualification
          }
        });
        setSuccess('Teacher registered successfully!');
      }
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        college_name: '',
        date_of_birth: '',
        address: '',
        standard: '',
        parent_name: '',
        enrollment_year: '',
        major_subject: '',
        classes: '',
        subjects_taught: '',
        years_of_experience: '',
        qualification: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Register</h2>
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => setUserType('student')}
              className={`px-4 py-2 rounded ${
                userType === 'student'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setUserType('teacher')}
              className={`px-4 py-2 rounded ${
                userType === 'teacher'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Teacher
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Fields */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                College Name
              </label>
              <input
                type="text"
                name="college_name"
                value={formData.college_name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Student Specific Fields */}
          {userType === 'student' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Standard
                </label>
                <input
                  type="text"
                  name="standard"
                  value={formData.standard}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Parent Name
                </label>
                <input
                  type="text"
                  name="parent_name"
                  value={formData.parent_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enrollment Year
                </label>
                <input
                  type="number"
                  name="enrollment_year"
                  value={formData.enrollment_year}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Major Subject
                </label>
                <input
                  type="text"
                  name="major_subject"
                  value={formData.major_subject}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Teacher Specific Fields */}
          {userType === 'teacher' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Classes
                </label>
                <input
                  type="text"
                  name="classes"
                  value={formData.classes}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subjects Taught
                </label>
                <input
                  type="text"
                  name="subjects_taught"
                  value={formData.subjects_taught}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;