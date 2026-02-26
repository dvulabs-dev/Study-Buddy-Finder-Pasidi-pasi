import {
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({
  user,
  activeTab,
  setActiveTab,
  tabs,
  pendingRequests,
  groupInvitesList,
  myGroupsList,
  myFriendsList,
  getInitials,
  handleLogout,
}) => {
  const notificationCount = pendingRequests.length + groupInvitesList.length;

  return (
    <>
      {/* ─── Desktop Sidebar ─── */}
      <div className="fixed top-0 left-0 hidden h-full bg-white border-r border-gray-200 shadow-sm w-72 lg:block">
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center mb-8 space-x-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl">
              <AcademicCapIcon className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">StudyBuddy</h1>
              <p className="text-xs text-gray-400">Learn together</p>
            </div>
          </div>

          {/* User Card */}
          <div className="p-4 mb-6 border border-gray-100 bg-gray-50 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 text-sm font-bold text-white bg-indigo-600 rounded-xl">
                {getInitials(user?.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {user?.name || "Student"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.degree || "Student"}{" "}
                  {user?.year ? `• Year ${user.year}` : ""}
                </p>
                {user?.subjects?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.subjects.slice(0, 2).map((s, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 text-[10px] bg-indigo-100 text-indigo-700 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                    {user.subjects.length > 2 && (
                      <span className="text-[10px] text-gray-400">
                        +{user.subjects.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex-1 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm">{tab.name}</span>
                {tab.id === "friends" && notificationCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 ml-auto text-xs text-white bg-red-500 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom stats */}
          <div className="p-4 border border-gray-100 bg-gray-50 rounded-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">My Groups</p>
                <p className="text-xl font-bold text-gray-900">
                  {myGroupsList.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Friends</p>
                <p className="text-xl font-bold text-gray-900">
                  {myFriendsList.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mobile Bottom Nav ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg lg:hidden">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center px-2 py-1.5 relative ${
                activeTab === tab.id ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 font-medium">
                {tab.name}
              </span>
              {tab.id === "friends" && notificationCount > 0 && (
                <span className="absolute w-4 h-4 text-[9px] text-white bg-red-500 rounded-full -top-1 -right-1 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center px-2 py-1.5 text-gray-400"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
