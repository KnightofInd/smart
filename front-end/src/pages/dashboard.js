import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { LogOut, BookOpen, Users, Calendar, Clock, Mail, Phone, Home, GraduationCap, Briefcase } from 'lucide-react';

// GraphQL Queries
const GET_STUDENT_DETAILS = gql`
  query GetStudentDetails($student_id: Int!) {
    students_by_pk(student_id: $student_id) {
      student_id
      name
      email
      phone_number
      standard
      college_name
      date_of_birth
      address
      parent_name
      enrollment_year
      major_subject
    }
  }
`;

const GET_TEACHER_DETAILS = gql`
  query GetTeacherDetails($teacher_id: Int!) {
    teachers_by_pk(teacher_id: $teacher_id) {
      teacher_id
      name
      email
      phone_number
      college_name
      classes
      date_of_birth
      address
      subjects_taught
      years_of_experience
      qualification
    }
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    const storedUserData = JSON.parse(localStorage.getItem('userData'));

    if (!storedUserType || !storedUserData) {
      navigate('/login');
      return;
    }

    setUserType(storedUserType);
    setUserData(storedUserData);
  }, [navigate]);

  const { loading, error, data } = useQuery(
    userType === 'student' ? GET_STUDENT_DETAILS : GET_TEACHER_DETAILS,
    {
      variables: 
        userType === 'student' 
          ? { student_id: userData?.student_id }
          : { teacher_id: userData?.teacher_id },
      skip: !userData
    }
  );

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">Error loading dashboard data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const userDetails = userType === 'student' 
    ? data?.students_by_pk 
    : data?.teachers_by_pk;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {userDetails?.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {userType === 'student' ? 'Student Dashboard' : 'Teacher Dashboard'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-indigo-600">
                    {userDetails?.name?.charAt(0)}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  {userDetails?.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {userType === 'student' ? userDetails?.standard : userDetails?.qualification}
                </p>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>{userDetails?.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-3" />
                  <span>{userDetails?.phone_number}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Home className="w-5 h-5 mr-3" />
                  <span>{userDetails?.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Cards */}
          <div className="md:col-span-2 space-y-8">
            {/* Academic Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {userType === 'student' ? 'Academic Information' : 'Professional Information'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 text-indigo-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Institution</p>
                      <p className="font-medium">{userDetails?.college_name}</p>
                    </div>
                  </div>
                  {userType === 'student' ? (
                    <>
                      <div className="flex items-center">
                        <GraduationCap className="w-5 h-5 text-indigo-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Major Subject</p>
                          <p className="font-medium">{userDetails?.major_subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-indigo-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Enrollment Year</p>
                          <p className="font-medium">{userDetails?.enrollment_year}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-indigo-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Classes</p>
                          <p className="font-medium">{userDetails?.classes}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-5 h-5 text-indigo-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Experience</p>
                          <p className="font-medium">{userDetails?.years_of_experience} years</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="space-y-4">
                  {userType === 'student' ? (
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-indigo-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Parent/Guardian</p>
                        <p className="font-medium">{userDetails?.parent_name}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 text-indigo-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Subjects Taught</p>
                        <p className="font-medium">{userDetails?.subjects_taught}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-indigo-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">
                        {new Date(userDetails?.date_of_birth).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { title: 'View Schedule', icon: Calendar },
                  { title: 'Messages', icon: Mail },
                  { title: userType === 'student' ? 'Assignments' : 'Grade Students', icon: BookOpen },
                ].map((action, index) => (
                  <button
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
                  >
                    <action.icon className="w-6 h-6 mx-auto text-indigo-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;