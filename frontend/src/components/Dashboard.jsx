import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { 
  UserIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  BookOpenIcon,
  CalendarIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  StarIcon,
  ChevronRightIcon,
  PencilSquareIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const quickActions = [
    {
      title: "Find Study Buddy",
      description: "Connect with students in your courses",
      icon: MagnifyingGlassIcon,
      gradient: "from-blue-500 to-blue-600",
      lightBg: "bg-blue-50",
      iconColor: "text-blue-600",
      path: "/find-buddies",
      action: "Search now"
    },
    {
      title: "Study Groups",
      description: "Browse and join study groups",
      icon: UserGroupIcon,
      gradient: "from-purple-500 to-purple-600",
      lightBg: "bg-purple-50",
      iconColor: "text-purple-600",
      path: "/study-groups",
      action: "View groups"
    },
    {
      title: "My Groups",
      description: "Manage your created groups",
      icon: BookOpenIcon,
      gradient: "from-green-500 to-green-600",
      lightBg: "bg-green-50",
      iconColor: "text-green-600",
      path: "/my-groups",
      action: "Manage"
    },
    {
      title: "Messages",
      description: "Chat with study buddies",
      icon: ChatBubbleLeftRightIcon,
      gradient: "from-pink-500 to-pink-600",
      lightBg: "bg-pink-50",
      iconColor: "text-pink-600",
      path: "/messages",
      action: "Open chats"
    }
  ];

  const studyResources = [
    {
      title: "Study Tips",
      description: "Effective learning techniques",
      icon: AcademicCapIcon,
      color: "indigo"
    },
    {
      title: "Resource Library",
      description: "Shared notes and materials",
      icon: DocumentTextIcon,
      color: "amber"
    },
    {
      title: "Schedule Planner",
      description: "Organize study sessions",
      icon: CalendarIcon,
      color: "emerald"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and brand */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg shadow-md">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Study Buddy Finder
              </h1>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* Date/Time Display */}
              <div className="hidden md:block text-right mr-2">
                <p className="text-sm font-medium text-gray-900">{formatTime(currentTime)}</p>
                <p className="text-xs text-gray-500">{formatDate(currentTime)}</p>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors relative"
                >
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      <div className="p-4 hover:bg-gray-50 transition-colors">
                        <p className="text-sm text-gray-800">Welcome to Study Buddy Finder!</p>
                        <p className="text-xs text-gray-500 mt-1">Just now</p>
                      </div>
                      <div className="p-4 hover:bg-gray-50 transition-colors">
                        <p className="text-sm text-gray-800">Complete your profile to get better matches</p>
                        <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
                      </div>
                    </div>
                    <button className="w-full p-3 text-center text-sm text-indigo-600 hover:bg-indigo-50 font-medium">
                      View all notifications
                    </button>
                  </div>
                )}
              </div>

              {/* Admin button */}
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <ShieldCheckIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Admin</span>
                </button>
              )}

              {/* Profile menu */}
              <div className="relative group">
                <button className="flex items-center space-x-3 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </button>

                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <button
                      onClick={() => navigate('/profile')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                    >
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {greeting}, {user?.name?.split(' ')[0]}! 👋
                </h2>
                <p className="text-indigo-100 text-lg">
                  {formatDate(currentTime)}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => navigate('/find-buddies')}
                  className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-lg flex items-center space-x-2"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  <span>Find Study Partners</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <UserGroupIcon className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">3</span>
            </div>
            <p className="text-sm text-gray-600">Study Groups</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <UserIcon className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">5</span>
            </div>
            <p className="text-sm text-gray-600">Study Buddies</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">2</span>
            </div>
            <p className="text-sm text-gray-600">Upcoming Sessions</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-amber-50 rounded-lg">
                <ClockIcon className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">7</span>
            </div>
            <p className="text-sm text-gray-600">Study Hours</p>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions Grid */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 text-left"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 ${action.lightBg} rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                        <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                      </div>
                      <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                    <span className={`text-sm font-medium bg-gradient-to-r ${action.gradient} bg-clip-text text-transparent`}>
                      {action.action} →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Study Resources */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Resources</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {studyResources.map((resource, index) => (
                  <button
                    key={index}
                    className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 text-center group"
                  >
                    <div className={`p-3 bg-${resource.color}-50 rounded-xl w-12 h-12 mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <resource.icon className={`h-6 w-6 text-${resource.color}-600`} />
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{resource.title}</h4>
                    <p className="text-xs text-gray-500">{resource.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <UserGroupIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">You joined a new study group</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <UserIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">New study buddy request from Sarah</p>
                    <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <CalendarIcon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">Study session scheduled for tomorrow</p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                  </div>
                </div>
              </div>
              <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
                View all activity
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Right Column - Profile & Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
                <button
                  onClick={() => navigate('/profile')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <PencilSquareIcon className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Degree Program</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.degree || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Year of Study</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.year || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Subjects</p>
                  {user?.subjects?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No subjects selected</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate('/profile/edit')}
                className="w-full mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                Complete Profile
              </button>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">Calculus Study Group</p>
                    <span className="text-xs text-indigo-600 font-medium">3:00 PM</span>
                  </div>
                  <p className="text-xs text-gray-600">with 4 members</p>
                </div>
                <div className="p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">Physics Review</p>
                    <span className="text-xs text-gray-500">Tomorrow</span>
                  </div>
                  <p className="text-xs text-gray-600">with 2 members</p>
                </div>
              </div>
              <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
                View full schedule
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>

            {/* Quick Tip */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <AcademicCapIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Study Tip</h4>
                  <p className="text-sm text-indigo-100">
                    Break your study sessions into 25-minute focused intervals with 5-minute breaks.
                  </p>
                </div>
              </div>
            </div>

            {/* Study Streak */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Study Streak</h3>
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-2xl font-bold text-gray-900">7</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Days in a row</p>
                <p className="text-xs text-gray-500">Best: 14 days</p>
              </div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;