import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { LogOut, BookOpen, Users, Calendar, Clock, Mail, Phone, Home, GraduationCap, Briefcase, Bell , Settings } from 'lucide-react';
import DocumentUploadSection from '../components/documentuploadsection';
import StudentAnalytics from '../components/student_analytics';
import EducationalChatbot from './chatbot';


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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="bg-red-500/10 backdrop-blur-sm p-6 rounded-xl border border-red-500/20">
          <p className="text-red-400">Error loading dashboard data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const userDetails = userType === 'student' ? data?.students_by_pk : data?.teachers_by_pk;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{userDetails?.name}</span>
              </h1>
              <p className="mt-1 text-gray-400">
                {userType === 'student' ? 'Student Dashboard' : 'Teacher Dashboard'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-b from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform">
                  <span className="text-4xl font-bold text-white">
                    {userDetails?.name?.charAt(0)}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white">
                  {userDetails?.name}
                </h2>
                <p className="text-gray-400">
                  {userType === 'student' ? userDetails?.standard : userDetails?.qualification}
                </p>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center text-gray-300 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <Mail className="w-5 h-5 mr-3 text-blue-400" />
                  <span>{userDetails?.email}</span>
                </div>
                <div className="flex items-center text-gray-300 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <Phone className="w-5 h-5 mr-3 text-purple-400" />
                  <span>{userDetails?.phone_number}</span>
                </div>
                <div className="flex items-center text-gray-300 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <Home className="w-5 h-5 mr-3 text-blue-400" />
                  <span>{userDetails?.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Cards */}
          <div className="md:col-span-2 space-y-8">
            {/* Academic Information */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-6">
                {userType === 'student' ? 'Academic Information' : 'Professional Information'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <BookOpen className="w-5 h-5 text-blue-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-400">Institution</p>
                      <p className="font-medium text-white">{userDetails?.college_name}</p>
                    </div>
                  </div>
                  {userType === 'student' ? (
                    <>
                      <div className="flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <GraduationCap className="w-5 h-5 text-purple-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">Major Subject</p>
                          <p className="font-medium text-white">{userDetails?.major_subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <Calendar className="w-5 h-5 text-blue-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">Enrollment Year</p>
                          <p className="font-medium text-white">{userDetails?.enrollment_year}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <Users className="w-5 h-5 text-purple-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">Classes</p>
                          <p className="font-medium text-white">{userDetails?.classes}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <Briefcase className="w-5 h-5 text-blue-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">Experience</p>
                          <p className="font-medium text-white">{userDetails?.years_of_experience} years</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="space-y-4">
                  {userType === 'student' ? (
                    <div className="flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <Users className="w-5 h-5 text-blue-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-400">Parent/Guardian</p>
                        <p className="font-medium text-white">{userDetails?.parent_name}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <BookOpen className="w-5 h-5 text-purple-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-400">Subjects Taught</p>
                        <p className="font-medium text-white">{userDetails?.subjects_taught}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <Clock className="w-5 h-5 text-blue-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-400">Date of Birth</p>
                      <p className="font-medium text-white">
                        {new Date(userDetails?.date_of_birth).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Upload Section - Only show for students */}
            {userType === 'student' && (
              <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-xl border border-white/10">
                <DocumentUploadSection studentId={userData?.student_id} />
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { title: 'View Schedule', icon: Calendar, color: 'from-blue-500 to-blue-600' },
                  { title: 'Messages', icon: Mail, color: 'from-purple-500 to-purple-600' },
                  { title: userType === 'student' ? 'Assignments' : 'Grade Students', icon: BookOpen, color: 'from-blue-500 to-purple-500' },
                ].map((action, index) => (
                  <button
                    key={index}
                    className="p-6 bg-gradient-to-r backdrop-blur-sm rounded-xl hover:scale-105 transition-all transform border border-white/10 group"
                    style={{
                      background: `linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))`
                    }}
                  >
                    <div className={`w-12 h-12 mx-auto bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                      {action.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Analytics Section */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-xl border border-white/10">
              <StudentAnalytics />
            </div>

            {/* Chatbot Section */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-xl border border-white/10">
              <EducationalChatbot />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;