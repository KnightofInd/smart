import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

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
    $major_subject: String,
    $firebase_uid: String!
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
      major_subject: $major_subject,
      firebase_uid: $firebase_uid
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
    $qualification: String,
    $firebase_uid: String!
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
      qualification: $qualification,
      firebase_uid: $firebase_uid
    }) {
      teacher_id
      name
      email
    }
  }
`;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const firebase_uid = userCredential.user.uid;

      // Add user to database based on type
      if (userType === 'student') {
        await addStudent({
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
            major_subject: formData.major_subject,
            firebase_uid
          }
        });
        setSuccess('Student registered successfully! Please login.');
      } else {
        await addTeacher({
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
            qualification: formData.qualification,
            firebase_uid
          }
        });
        setSuccess('Teacher registered successfully! Please login.');
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
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

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Create Your Account</h2>
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => setUserType('student')}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                userType === 'student'
                  ? 'bg-indigo-600 text-white scale-105 shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setUserType('teacher')}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                userType === 'teacher'
                  ? 'bg-indigo-600 text-white scale-105 shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Teacher
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
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
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Login here
              </button>
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;