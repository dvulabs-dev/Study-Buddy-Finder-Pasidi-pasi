import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  LightBulbIcon,
  BellIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const DashboardTab = ({
  user,
  dashLoading,
  dashError,
  greeting,
  myGroupsList,
  studyGroups,
  suggestedBuddies,
  pendingRequests,
  groupInvitesList,
  friendActionLoading,
  setActiveTab,
  setFriendsTab,
  openProfileEdit,
  handleAcceptFriend,
  handleRejectFriend,
  handleAcceptGroupInvite,
  handleRejectGroupInvite,
  getInitials,
  groupColors,
  buddyColors,
}) => {
  if (dashLoading) {
    return (
      <div className="py-12 text-center text-gray-500">
        <div className="w-10 h-10 mx-auto mb-3 border-4 border-indigo-200 rounded-full border-t-indigo-600 animate-spin" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      {dashError && (
        <div className="flex items-center p-4 mb-6 space-x-3 text-red-700 border border-red-200 bg-red-50 rounded-xl">
          <ExclamationCircleIcon className="flex-shrink-0 w-5 h-5" />
          <p className="text-sm">{dashError}</p>
        </div>
      )}

      {/* Welcome Section with Dynamic Image Based on Time */}
      <div className="relative overflow-hidden rounded-3xl h-[280px] lg:h-[320px] group">
        {/* Background Image - Changes based on time of day */}
        <img 
          src={
            new Date().getHours() < 12 
              ? "https://images.unsplash.com/photo-1498243691581-b145c3f54a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              : new Date().getHours() < 18
                ? "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                : "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          }
          alt="Students studying together"
          className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-800/90 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center p-8 lg:p-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 text-xs font-semibold text-white border rounded-full bg-white/20 backdrop-blur-sm border-white/30">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 className="mb-3 text-3xl font-bold text-white lg:text-4xl">
              {greeting}, {user?.name?.split(" ")[0] || "Student"}!
            </h1>
            <p className="mb-6 text-lg text-white/90">
              Ready for another productive day? You have {myGroupsList.length} active groups and {pendingRequests.length} pending requests.
            </p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setActiveTab("studygroups")}
                className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all bg-indigo-600 rounded-xl hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/25"
              >
                <UserGroupIcon className="w-5 h-5" />
                Browse Groups
              </button>
              <button 
                onClick={() => setActiveTab("findbuddies")}
                className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all border bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 border-white/30"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                Find Buddies
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards with Icons */}
      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        {[
          { label: "Total Groups", value: studyGroups.length, icon: UserGroupIcon, iconBg: "bg-blue-100", iconColor: "text-blue-600", image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
          { label: "My Groups", value: myGroupsList.length, icon: BookOpenIcon, iconBg: "bg-green-100", iconColor: "text-green-600", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
          { label: "My Subjects", value: user?.subjects?.length || 0, icon: AcademicCapIcon, iconBg: "bg-purple-100", iconColor: "text-purple-600", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
          { label: "Buddies Found", value: suggestedBuddies.length, icon: UserIcon, iconBg: "bg-orange-100", iconColor: "text-orange-600", image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        ].map((s, i) => (
          <div key={i} className="relative p-5 overflow-hidden transition-all bg-white border border-gray-200 shadow-sm group rounded-2xl hover:shadow-md">
            <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10">
              <img src={s.image} alt="" className="object-cover w-full h-full" />
            </div>
            <div className="relative z-10">
              <div className={`p-2.5 ${s.iconBg} rounded-xl w-fit mb-3`}>
                <s.icon className={`w-5 h-5 ${s.iconColor}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* My Groups preview with Enhanced Images */}
          <div className="relative overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
            {/* Header with background image */}
            <div className="relative h-24 bg-gradient-to-r from-indigo-600 to-purple-600">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt=""
                className="absolute inset-0 object-cover w-full h-full opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="flex items-center text-xl font-bold text-white">
                  <BookOpenIcon className="w-6 h-6 mr-2" />
                  My Study Groups
                </h3>
                <p className="text-sm text-indigo-100">{myGroupsList.length} active groups • {myGroupsList.reduce((acc, g) => acc + (g.members?.length || 0), 0)} total members</p>
              </div>
            </div>
            
            <div className="p-6">
              {myGroupsList.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
                      alt=""
                      className="object-cover w-full h-full rounded-full opacity-20"
                    />
                    <UserGroupIcon className="absolute inset-0 w-12 h-12 m-auto text-gray-400" />
                  </div>
                  <p className="text-gray-500">You haven&apos;t joined any groups yet.</p>
                  <button onClick={() => setActiveTab("studygroups")} className="mt-3 text-sm font-medium text-indigo-600 hover:underline">
                    Browse study groups
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myGroupsList.slice(0, 4).map((g, i) => (
                    <div 
                      key={g._id} 
                      onClick={() => setActiveTab("mygroups")} 
                      className="flex items-center p-4 transition-all cursor-pointer group/item bg-gray-50 rounded-xl hover:bg-gray-100"
                    >
                      {/* Group Avatar with Subject-based image */}
                      <div className="relative overflow-hidden rounded-xl w-14 h-14">
                        <img 
                          src={`https://source.unsplash.com/featured/100x100/?${encodeURIComponent(g.subject?.toLowerCase() || 'study')},education`}
                          alt=""
                          className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 group-hover/item:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                          {g.name?.charAt(0)?.toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0 ml-4">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 truncate">{g.name}</p>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            g.members?.length >= g.maxMembers ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {g.members?.length >= g.maxMembers ? 'Full' : 'Active'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{g.subject}</p>
                        <div className="flex items-center mt-1 space-x-3 text-xs text-gray-400">
                          <span className="flex items-center space-x-1">
                            <UserGroupIcon className="w-3.5 h-3.5" />
                            <span>{g.members?.length || 0}/{g.maxMembers || 10} members</span>
                          </span>
                          {g.nextMeeting && (
                            <span className="flex items-center space-x-1">
                              <span>•</span>
                              <span>Next: {g.nextMeeting}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <ChevronRightIcon className="w-5 h-5 text-gray-400 transition-transform group-hover/item:translate-x-1" />
                    </div>
                  ))}
                  
                  {myGroupsList.length > 4 && (
                    <button 
                      onClick={() => setActiveTab("mygroups")}
                      className="flex items-center justify-center w-full py-3 mt-2 text-sm font-medium text-indigo-600 transition-colors border border-indigo-200 rounded-xl hover:bg-indigo-50"
                    >
                      View all {myGroupsList.length} groups
                      <ChevronRightIcon className="w-4 h-4 ml-1" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* All groups preview with Enhanced Images */}
          <div className="relative overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
            {/* Header with background image */}
            <div className="relative h-24 bg-gradient-to-r from-emerald-600 to-teal-600">
              <img 
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80"
                alt=""
                className="absolute inset-0 object-cover w-full h-full opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-teal-600/90" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="flex items-center text-xl font-bold text-white">
                  <UserGroupIcon className="w-6 h-6 mr-2" />
                  Active Study Groups
                </h3>
                <p className="text-sm text-emerald-100">{studyGroups.length} groups available • Join a group that matches your interests</p>
              </div>
            </div>
            
            <div className="p-6">
              {studyGroups.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                      alt=""
                      className="object-cover w-full h-full rounded-full opacity-20"
                    />
                    <UserGroupIcon className="absolute inset-0 w-12 h-12 m-auto text-gray-400" />
                  </div>
                  <p className="text-gray-500">No study groups yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {studyGroups.slice(0, 4).map((g, i) => {
                    const uid = user?._id || user?.id;
                    const isMember = g.members?.some((m) => (m._id || m).toString() === uid);
                    const memberCount = g.members?.length || 0;
                    const capacity = g.maxMembers || 10;
                    const fillPercentage = (memberCount / capacity) * 100;
                    
                    return (
                      <div 
                        key={g._id} 
                        className="relative overflow-hidden transition-all border border-gray-100 group/card rounded-xl hover:border-indigo-200 hover:shadow-md"
                      >
                        {/* Card header with subject-based image */}
                        <div className="relative h-24">
                          <img 
                            src={`https://source.unsplash.com/featured/300x150/?${encodeURIComponent(g.subject?.toLowerCase() || 'study')},classroom`}
                            alt=""
                            className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 group-hover/card:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                          
                          {/* Subject badge */}
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-1 text-xs font-medium text-white bg-black/50 backdrop-blur-sm rounded-full">
                              {g.subject}
                            </span>
                          </div>
                          
                          {/* Group initial */}
                          <div className="absolute bottom-2 left-3">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-white/20 backdrop-blur-sm rounded-lg">
                                {g.name?.charAt(0)?.toUpperCase()}
                              </div>
                              <span className="font-semibold text-white">{g.name}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Card content */}
                        <div className="p-4">
                          {g.description && (
                            <p className="mb-3 text-xs text-gray-600 line-clamp-2">{g.description}</p>
                          )}
                          
                          {/* Members progress bar */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1 text-xs">
                              <span className="text-gray-500">Members</span>
                              <span className="font-medium text-gray-700">{memberCount}/{capacity}</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-300 ${
                                  fillPercentage >= 100 ? 'bg-red-500' : 'bg-indigo-500'
                                }`}
                                style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                              />
                            </div>
                          </div>
                          
                          {/* Creator and action */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <UserIcon className="w-3 h-3" />
                              <span className="truncate max-w-[100px]">{g.creator?.name || "Unknown"}</span>
                            </div>
                            
                            {isMember ? (
                              <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                Joined
                              </span>
                            ) : (
                              <button 
                                onClick={() => {/* Handle join group */}}
                                className="px-3 py-1 text-xs font-medium text-indigo-600 transition-colors border border-indigo-200 rounded-full hover:bg-indigo-50"
                              >
                                Join Group
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {studyGroups.length > 4 && (
                <button 
                  onClick={() => setActiveTab("studygroups")}
                  className="flex items-center justify-center w-full py-3 mt-4 text-sm font-medium text-indigo-600 transition-colors border border-indigo-200 rounded-xl hover:bg-indigo-50"
                >
                  View all {studyGroups.length} groups
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Profile with Avatar Image */}
          <div className="relative p-6 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <img 
                src="https://images.unsplash.com/photo-1531482615715-2afd1c5f33cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                alt="" 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">My Profile</h3>
                <button onClick={openProfileEdit} className="flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 transition-all border border-indigo-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-700">
                  <PencilSquareIcon className="w-4 h-4 mr-1" />Edit
                </button>
              </div>
              
              {/* Profile Avatar */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
                    {getInitials(user?.name || "User")}
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name || "Student"}</p>
                  <p className="text-sm text-gray-500">{user?.email || "student@university.edu"}</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  ["Degree", user?.degree || "Computer Science"],
                  ["Year", user?.year || "3rd Year"],
                  ["University", user?.university || "University of Technology"]
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm">
                    <span className="text-gray-500">{l}</span>
                    <span className="ml-4 font-medium text-gray-900 truncate">{v}</span>
                  </div>
                ))}
                
                {user?.subjects?.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm text-gray-500">Subjects</p>
                    <div className="flex flex-wrap gap-1.5">
                      {user.subjects.map((s, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {user?.availableTime && (
                  <div>
                    <p className="mb-2 text-sm text-gray-500">Availability</p>
                    <div className="flex flex-wrap gap-1.5">
                      {user.availableTime.weekdays && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full text-emerald-700 bg-emerald-50">
                          Weekdays
                        </span>
                      )}
                      {user.availableTime.weekend && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full text-emerald-700 bg-emerald-50">
                          Weekend
                        </span>
                      )}
                      {user.availableTime.morning && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full text-emerald-700 bg-emerald-50">
                          Morning
                        </span>
                      )}
                      {user.availableTime.evening && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full text-emerald-700 bg-emerald-50">
                          Evening
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pending Friend Requests & Group Invites */}
          {(pendingRequests.length > 0 || groupInvitesList.length > 0) && (
            <div className="relative p-6 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <img 
                  src="https://images.unsplash.com/photo-1557200134-90327ee9aafa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                  alt="" 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <BellIcon className="w-5 h-5 text-red-500" />
                    Notifications
                    <span className="flex items-center justify-center w-6 h-6 text-xs text-white bg-red-500 rounded-full">
                      {pendingRequests.length + groupInvitesList.length}
                    </span>
                  </h3>
                  <button onClick={() => setActiveTab("friends")} className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
                    View all
                  </button>
                </div>

                {pendingRequests.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">Friend Requests</p>
                    <div className="space-y-2">
                      {pendingRequests.slice(0, 3).map((r) => (
                        <div key={r._id} className="flex items-center justify-between p-3 border border-amber-200 bg-amber-50 rounded-xl">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center text-xs font-bold text-white rounded-lg w-9 h-9 bg-amber-500">
                              {getInitials(r.from?.name)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{r.from?.name}</p>
                              <p className="text-xs text-gray-500">
                                {r.from?.subjects?.slice(0, 2).join(", ") || r.from?.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => handleAcceptFriend(r._id)} 
                              disabled={friendActionLoading === r._id}
                              className="p-1.5 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleRejectFriend(r._id)} 
                              disabled={friendActionLoading === r._id}
                              className="p-1.5 text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {pendingRequests.length > 3 && (
                        <button 
                          onClick={() => setActiveTab("friends")} 
                          className="w-full py-1.5 text-xs font-medium text-indigo-600 hover:underline"
                        >
                          +{pendingRequests.length - 3} more requests
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {groupInvitesList.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">Group Invites</p>
                    <div className="space-y-2">
                      {groupInvitesList.slice(0, 3).map((inv) => (
                        <div key={inv._id} className="flex items-center justify-between p-3 border border-teal-200 bg-teal-50 rounded-xl">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{inv.group?.name || "Unknown Group"}</p>
                            <p className="text-xs text-gray-500">From {inv.from?.name}</p>
                          </div>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => handleAcceptGroupInvite(inv._id)} 
                              disabled={friendActionLoading === inv._id}
                              className="p-1.5 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleRejectGroupInvite(inv._id)} 
                              disabled={friendActionLoading === inv._id}
                              className="p-1.5 text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {groupInvitesList.length > 3 && (
                        <button 
                          onClick={() => { setActiveTab("friends"); setFriendsTab("groupinvites"); }} 
                          className="w-full py-1.5 text-xs font-medium text-indigo-600 hover:underline"
                        >
                          +{groupInvitesList.length - 3} more invites
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Buddies with Image */}
          <div className="relative p-6 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="absolute bottom-0 right-0 w-48 h-48 opacity-5">
              <img 
                src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80" 
                alt="" 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Suggested Buddies</h3>
                <button onClick={() => setActiveTab("findbuddies")} className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
                  Find more
                </button>
              </div>
              {suggestedBuddies.length === 0 ? (
                <div className="py-6 text-center">
                  <UserIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">
                    {user?.subjects?.length > 0 ? "No buddies found." : "Add subjects to find buddies."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {suggestedBuddies.map((b, i) => (
                    <div key={b._id} className="flex items-center p-3 transition-all rounded-xl hover:bg-gray-50">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-white font-bold text-sm ${buddyColors[i % buddyColors.length]}`}>
                        {getInitials(b.name)}
                      </div>
                      <div className="flex-1 min-w-0 ml-3">
                        <p className="text-sm font-medium text-gray-900 truncate">{b.name}</p>
                        <p className="text-xs text-gray-400 truncate">
                          {b.subjects?.join(", ") || "No subjects"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tip with Background Image */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
            <div className="absolute inset-0 opacity-10">
              <img 
                src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80" 
                alt="" 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="relative z-10 p-6">
              <div className="flex items-center mb-3 space-x-2">
                <LightBulbIcon className="w-5 h-5 text-white" />
                <h4 className="font-bold text-white">Pro Tip</h4>
              </div>
              <p className="text-sm text-indigo-100">
                Break your study sessions into 25-minute focused intervals with 5-minute breaks. 
                The Pomodoro technique can improve retention by up to 40%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardTab;