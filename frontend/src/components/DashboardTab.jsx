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
  myFriendsList,
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
                className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/25"
              >
                <UserGroupIcon className="w-5 h-5" />
                Browse Groups
              </button>
              <button 
                onClick={() => setActiveTab("findbuddies")}
                className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all border bg-sky-500/20 backdrop-blur-sm rounded-xl hover:bg-sky-500/40 border-sky-300/40"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                Find Buddies
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards with Icons - Blue Theme */}
      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        {[
          { label: "Total Groups", value: studyGroups.length, icon: UserGroupIcon, iconBg: "bg-blue-100", iconColor: "text-blue-600", image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
          { label: "My Groups", value: myGroupsList.length, icon: BookOpenIcon, iconBg: "bg-sky-100", iconColor: "text-sky-600", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
          { label: "My Subjects", value: user?.subjects?.length || 0, icon: AcademicCapIcon, iconBg: "bg-indigo-100", iconColor: "text-indigo-600", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
          { label: "Buddies Found", value: suggestedBuddies.length, icon: UserIcon, iconBg: "bg-cyan-100", iconColor: "text-cyan-600", image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        ].map((s, i) => (
          <div key={i} className="relative p-5 overflow-hidden transition-all bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 shadow-sm group rounded-2xl hover:shadow-md hover:border-blue-200">
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

      {/* Top Row: Profile + Suggested Buddies */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        {/* Profile Section - Enhanced with Blurry Background */}
        <div className="relative overflow-hidden border border-blue-200 shadow-lg rounded-2xl">
          {/* Blurry Light Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2029&q=80" 
              alt="" 
              className="w-full h-full object-cover blur-xl opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-50/70 to-sky-100/60" />
          </div>
          
          {/* Edit Button - Positioned over cover */}
          <button 
            type="button"
            onClick={openProfileEdit} 
            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-sky-500 rounded-full shadow-md hover:from-blue-700 hover:to-sky-600 transition-all hover:shadow-lg cursor-pointer"
          >
            Edit profile
          </button>
          
          {/* Cover Image - Blue gradient overlay */}
          <div className="relative h-32 z-10">
            <img 
              src="https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-blue-600/40 to-sky-400/30" />
          </div>
          
          {/* Profile Content */}
          <div className="relative px-6 pb-6 z-10">
            {/* Avatar - Overlapping banner */}
            <div className="flex justify-center -mt-14 relative z-10">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-sky-500 p-1 shadow-xl ring-4 ring-white/50">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-50 to-white flex items-center justify-center text-3xl font-bold text-blue-600 overflow-hidden">
                    {getInitials(user?.name || "User")}
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-gradient-to-br from-sky-400 to-blue-500 border-2 border-white rounded-full shadow-md"></div>
              </div>
            </div>
            
            {/* User Info - Centered */}
            <div className="text-center mt-4">
              <h3 className="text-xl font-bold text-slate-800">{user?.name || "Student"}</h3>
              <p className="text-sm text-blue-600/80 mt-1 font-medium">Degree Programme - {user?.degree || "SE"}</p>
              
              {/* Location/University */}
              <div className="flex items-center justify-center gap-1 mt-2 text-sm text-slate-600">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{user?.university || "University of Technology"}</span>
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="flex items-center justify-around mt-6 pt-4 border-t border-blue-200/50">
              <div className="text-center px-4 py-2 rounded-xl bg-white/40 backdrop-blur-sm">
                <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">{myGroupsList.length}</p>
                <p className="text-xs text-slate-500 font-medium">groups</p>
              </div>
              <div className="text-center px-4 py-2 rounded-xl bg-white/40 backdrop-blur-sm">
                <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">{myFriendsList?.length || 0}</p>
                <p className="text-xs text-slate-500 font-medium">friends</p>
              </div>
              <div className="text-center px-4 py-2 rounded-xl bg-white/40 backdrop-blur-sm">
                <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">{suggestedBuddies.length}</p>
                <p className="text-xs text-slate-500 font-medium">buddies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Buddies Section - Enhanced Blue Theme */}
        <div className="relative p-6 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 border border-blue-700 shadow-lg rounded-2xl">
          {/* Background Image with light blur */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
              alt="" 
              className="w-full h-full object-cover blur-[2px] opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/50 to-blue-800/40" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Suggested Buddies</h3>
              <button onClick={() => setActiveTab("findbuddies")} className="text-xs font-medium text-sky-300 hover:text-sky-200">
                Find more
              </button>
            </div>
            <p className="text-xs text-blue-200/80 mb-4">People from your groups you can add as friends</p>
            {(() => {
              // Get members from user's groups who are not already friends
              const uid = user?._id || user?.id;
              const friendIds = myFriendsList?.map(f => f._id) || [];
              const groupMembers = myGroupsList.flatMap(g => 
                (g.members || []).filter(m => {
                  const memberId = m._id || m;
                  return memberId !== uid && !friendIds.includes(memberId);
                })
              );
              // Remove duplicates and limit to 5
              const uniqueMembers = groupMembers.filter((m, index, self) => 
                index === self.findIndex(t => (t._id || t) === (m._id || m))
              ).slice(0, 5);
              
              if (uniqueMembers.length === 0 && suggestedBuddies.length === 0) {
                return (
                  <div className="py-6 text-center">
                    <UserIcon className="w-10 h-10 mx-auto mb-2 text-blue-300/50" />
                    <p className="text-sm text-blue-200/70">
                      {myGroupsList.length > 0 ? "No new buddies to suggest." : "Join groups to find buddies."}
                    </p>
                  </div>
                );
              }
              
              // Show group members first, then suggested buddies
              const displayBuddies = uniqueMembers.length > 0 
                ? uniqueMembers 
                : suggestedBuddies.slice(0, 5);
              
              return (
                <div className="space-y-3">
                  {displayBuddies.map((b, i) => (
                    <div key={b._id || i} className="flex items-center p-3 transition-all rounded-xl hover:bg-white/20 bg-white/10 backdrop-blur-sm border border-white/20">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-sm bg-gradient-to-br from-sky-400 to-blue-600`}>
                        {getInitials(b.name || "U")}
                      </div>
                      <div className="flex-1 min-w-0 ml-3">
                        <p className="text-sm font-medium text-white truncate">{b.name || "Unknown"}</p>
                        <p className="text-xs text-blue-200/70 truncate">
                          {b.degree ? `${b.degree}` : b.subjects?.slice(0, 2).join(", ") || "Study buddy"}
                        </p>
                      </div>
                      <button 
                        onClick={() => { setActiveTab("findbuddies"); }}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-900 bg-sky-300 rounded-full hover:bg-sky-200 transition-colors shadow-sm"
                      >
                        Add Friend
                      </button>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* My Study Groups Section - Full Width */}
          {/* My Groups preview with Enhanced Images - Blue Theme */}
          <div className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 shadow-sm rounded-2xl">
            {/* Header with background image - Dark Blue to Light Blue */}
            <div className="relative h-24 bg-gradient-to-r from-slate-900 via-blue-800 to-sky-600">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt=""
                className="absolute inset-0 object-cover w-full h-full opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-blue-800/85 to-sky-600/80" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="flex items-center text-xl font-bold text-white">
                  <BookOpenIcon className="w-6 h-6 mr-2" />
                  My Study Groups
                </h3>
                <p className="text-sm text-sky-200">{myGroupsList.length} active groups • {myGroupsList.reduce((acc, g) => acc + (g.members?.length || 0), 0)} total members</p>
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
                  <button onClick={() => setActiveTab("studygroups")} className="mt-3 text-sm font-medium text-blue-600 hover:underline">
                    Browse study groups
                  </button>
                </div>
              ) : (
                <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {myGroupsList.slice(0, 4).map((g) => {
                    const memberCount = g.members?.length || 0;
                    const maxMembers = g.maxMembers || 10;
                    const fillPercentage = maxMembers > 0 ? (memberCount / maxMembers) * 5 : 0;
                    const fullStars = Math.floor(fillPercentage);
                    const hasHalfStar = fillPercentage % 1 >= 0.5;
                    const backendUrl = 'http://localhost:5000';
                    
                    return (
                      <div 
                        key={g._id} 
                        onClick={() => setActiveTab("mygroups")}
                        className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-gray-100"
                      >
                        {/* Blue Top Bar */}
                        <div className="h-2 bg-gradient-to-r from-blue-600 to-sky-400" />
                        
                        {/* Image Section */}
                        <div className="relative">
                          {g.image ? (
                            <img
                              src={`${backendUrl}${g.image}`}
                              alt={g.name}
                              className="w-full h-36 object-cover"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop';
                              }}
                            />
                          ) : (
                            <div className="w-full h-36 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                              <UserGroupIcon className="w-14 h-14 text-indigo-300" />
                            </div>
                          )}
                          
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                              <svg className="w-5 h-5 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span className={`absolute top-3 right-3 px-3 py-1.5 text-xs font-bold text-white rounded-full shadow-md ${
                            memberCount >= maxMembers ? 'bg-red-500' : 'bg-green-500'
                          }`}>
                            {memberCount >= maxMembers ? 'Full' : 'Active'}
                          </span>
                        </div>

                        {/* Card Content */}
                        <div className="p-4">
                          {/* Subject Tag */}
                          <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full mb-2">
                            {g.subject}
                          </span>

                          {/* Group Name */}
                          <h4 className="text-base font-bold text-gray-900 leading-tight mb-1 line-clamp-1">
                            {g.name}
                          </h4>

                          {/* Description */}
                          {g.description ? (
                            <p className="text-sm text-gray-500 mb-2 line-clamp-1">{g.description}</p>
                          ) : (
                            <p className="text-sm text-gray-400 italic mb-2">No description</p>
                          )}

                          {/* Members & Rating Row */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1">
                              <UserGroupIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{memberCount}/{maxMembers}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < fullStars
                                      ? 'text-sky-400'
                                      : i === fullStars && hasHalfStar
                                      ? 'text-sky-400'
                                      : 'text-gray-200'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="border-t border-gray-100 pt-3">
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTab("mygroups");
                                }}
                                className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                              >
                                Details
                              </button>
                              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {myGroupsList.length > 4 && (
                    <div className="flex-shrink-0 w-64 flex items-center justify-center">
                      <button 
                        onClick={() => setActiveTab("mygroups")}
                        className="flex items-center justify-center px-6 py-3 text-sm font-medium text-blue-600 transition-colors border border-blue-200 rounded-xl hover:bg-blue-50"
                      >
                        View all {myGroupsList.length}
                        <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* All groups preview with Enhanced Images - Blue Theme */}
          <div className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 shadow-sm rounded-2xl mt-8">
            {/* Header with background image - Light Blue to Dark Blue */}
            <div className="relative h-24 bg-gradient-to-r from-sky-500 via-blue-600 to-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80"
                alt=""
                className="absolute inset-0 object-cover w-full h-full opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/85 via-blue-600/85 to-slate-800/90" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="flex items-center text-xl font-bold text-white">
                  <UserGroupIcon className="w-6 h-6 mr-2" />
                  Active Study Groups
                </h3>
                <p className="text-sm text-sky-100">{studyGroups.length} groups available • Join a group that matches your interests</p>
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
                        <div className="relative h-24">
                          <img 
                            src={`https://source.unsplash.com/featured/300x150/?${encodeURIComponent(g.subject?.toLowerCase() || 'study')},classroom`}
                            alt=""
                            className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 group-hover/card:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40" />
                          <div className="absolute bottom-2 left-3 right-3">
                            <h4 className="text-sm font-bold text-white truncate">{g.name}</h4>
                          </div>
                        </div>
                        
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2 py-1 text-xs font-medium text-sky-700 bg-sky-50 rounded-full">
                              {g.subject}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              isMember 
                                ? 'text-blue-700 bg-blue-50' 
                                : memberCount >= capacity 
                                  ? 'text-red-700 bg-red-50' 
                                  : 'text-green-700 bg-green-50'
                            }`}>
                              {isMember ? 'Joined' : memberCount >= capacity ? 'Full' : 'Open'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <UserGroupIcon className="w-3.5 h-3.5" />
                              <span>{memberCount}/{capacity}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="flex items-center w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-500 ${
                                    fillPercentage <= 50 ? 'bg-green-500' : 
                                    fillPercentage <= 80 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                                />
                              </div>
                            </div>
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
                  className="flex items-center justify-center w-full py-3 mt-4 text-sm font-medium text-blue-600 transition-colors border border-blue-200 rounded-xl hover:bg-blue-50"
                >
                  View all {studyGroups.length} groups
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          </div>

      {/* Pending Friend Requests & Group Invites - Blue Theme */}
      {(pendingRequests.length > 0 || groupInvitesList.length > 0) && (
        <div className="relative p-6 overflow-hidden bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 shadow-sm rounded-2xl mt-8">
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
                <BellIcon className="w-5 h-5 text-blue-500" />
                Notifications
                <span className="flex items-center justify-center w-6 h-6 text-xs text-white bg-blue-600 rounded-full">
                  {pendingRequests.length + groupInvitesList.length}
                </span>
              </h3>
              <button onClick={() => setActiveTab("friends")} className="text-xs font-medium text-blue-600 hover:text-blue-800">
                View all
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {pendingRequests.length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-700">Friend Requests</p>
                  <div className="space-y-2">
                    {pendingRequests.slice(0, 3).map((r) => (
                      <div key={r._id} className="flex items-center justify-between p-3 border border-blue-200 bg-blue-50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center text-xs font-bold text-white rounded-lg w-9 h-9 bg-blue-500">
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
                  </div>
                </div>
              )}

              {groupInvitesList.length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-700">Group Invites</p>
                  <div className="space-y-2">
                    {groupInvitesList.slice(0, 3).map((inv) => (
                      <div key={inv._id} className="flex items-center justify-between p-3 border border-sky-200 bg-sky-50 rounded-xl">
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardTab;