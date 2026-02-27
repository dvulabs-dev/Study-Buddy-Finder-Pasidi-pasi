import { useState, useMemo, useCallback } from "react";
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  AcademicCapIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
  ClockIcon,
  CalendarIcon,
  SparklesIcon,
  BookOpenIcon,
  FireIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import CreateGroupModal from "./CreateGroupModal";

const StudyGroupsTab = ({
  user,
  sgSearchType,
  setSgSearchType,
  sgSubject,
  setSgSubject,
  sgMeetingTime,
  setSgMeetingTime,
  sgGroups,
  sgLoading,
  sgError,
  showCreateModal,
  setShowCreateModal,
  joinLoading,
  sgLoadAll,
  sgSearchBySubject,
  sgAdvancedSearch,
  handleJoinGroup,
  fetchDashboardData,
}) => {
  const userId = user?._id || user?.id;

  // Stats calculation
  const stats = useMemo(() => {
    const total = sgGroups.length;
    const joined = sgGroups.filter((group) =>
      group.members?.some((member) => (member._id || member).toString() === userId)
    ).length;
    const available = sgGroups.filter(
      (group) => (group.members?.length || 0) < group.maxMembers
    ).length;
    const popular = sgGroups.filter((group) => 
      (group.members?.length || 0) >= Math.floor(group.maxMembers * 0.8)
    ).length;

    return { total, joined, available, popular };
  }, [sgGroups, userId]);

  // Get gradient based on group status
  const getGroupGradient = (isMember, isFull, memberCount, maxMembers) => {
    if (isMember) return "from-green-50 to-emerald-50 border-green-200";
    if (isFull) return "from-gray-50 to-slate-50 border-gray-200";
    const percentage = (memberCount / maxMembers) * 100;
    if (percentage >= 75) return "from-orange-50 to-amber-50 border-orange-200";
    if (percentage >= 50) return "from-blue-50 to-cyan-50 border-blue-200";
    return "from-sky-50 to-blue-50 border-sky-200";
  };

  // Get accent color based on subject
  const getSubjectColor = (subject) => {
    const colors = {
      mathematics: "from-blue-600 to-cyan-600",
      physics: "from-blue-500 to-indigo-500",
      chemistry: "from-cyan-600 to-blue-600",
      biology: "from-sky-600 to-blue-600",
      literature: "from-slate-600 to-blue-600",
      history: "from-blue-700 to-indigo-700",
      computer: "from-indigo-500 to-blue-500",
      engineering: "from-slate-600 to-gray-600",
    };
    const subjectLower = subject?.toLowerCase() || "";
    for (const [key, value] of Object.entries(colors)) {
      if (subjectLower.includes(key)) return value;
    }
    return "from-blue-600 to-cyan-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header with Gradient */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-blue-600 shadow-2xl">
          {/* Blurry Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay blur-[2px] scale-105"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
          />
          <div className="absolute inset-0 bg-blue-900/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:50px_50px]" />
          <div className="relative px-8 py-12 sm:px-12 sm:py-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl">
                    <UserGroupIcon className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-white">Study Groups</h1>
                </div>
                <p className="text-xl text-white/90 max-w-2xl">
                  Join vibrant learning communities, collaborate with peers, and master subjects together
                </p>
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="group relative inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <PlusIcon className="relative w-6 h-6 mr-3 text-white transition-colors duration-300" />
                <span className="relative text-lg font-semibold text-white transition-colors duration-300">
                  Create New Group
                </span>
              </button>
            </div>

            {/* Animated Stats Cards */}
            {!sgLoading && sgGroups.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
                {[
                  { label: "Total Groups", value: stats.total, icon: UserGroupIcon, color: "from-blue-500/80 to-cyan-500/80" },
                  { label: "Joined", value: stats.joined, icon: CheckCircleIcon, color: "from-cyan-500/80 to-blue-500/80" },
                  { label: "Available Spots", value: stats.available, icon: FireIcon, color: "from-sky-500/80 to-blue-400/80" },
                  { label: "Popular Groups", value: stats.popular, icon: StarIcon, color: "from-blue-600/80 to-cyan-600/80" },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={idx}
                      className="relative group cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-md" />
                      <div className={`relative p-4 bg-gradient-to-br ${stat.color} rounded-2xl backdrop-blur-md border border-white/10 transform group-hover:scale-105 transition-all duration-300 shadow-lg`}>
                        <div className="flex items-center justify-between mb-2">
                          <Icon className="w-6 h-6 text-white" />
                          <span className="text-3xl font-bold text-white">{stat.value}</span>
                        </div>
                        <p className="text-sm font-medium text-white/90">{stat.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Search Section with Glassmorphism */}
        <div className="mb-8 backdrop-blur-lg bg-white/70 rounded-3xl shadow-xl border border-white/20 p-6">
          {/* Search Type Tabs - Colorful Pills */}
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { value: "all", label: "All Groups", icon: UserGroupIcon, color: "from-blue-600 to-blue-800" },
              { value: "subject", label: "By Subject", icon: BookOpenIcon, color: "from-cyan-600 to-blue-600" },
              { value: "advanced", label: "Advanced Search", icon: FunnelIcon, color: "from-sky-600 to-blue-600" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = sgSearchType === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => {
                    setSgSearchType(tab.value);
                    if (tab.value === "all") sgLoadAll();
                  }}
                  className={`relative group overflow-hidden rounded-2xl transition-all duration-300 ${
                    isActive ? "shadow-lg scale-105" : "hover:scale-102"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  } transition-opacity duration-300`} />
                  <div className={`relative px-6 py-3 flex items-center space-x-2 ${
                    isActive ? "text-white" : "text-gray-700 group-hover:text-white"
                  }`}>
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Subject Search - Colorful Input */}
          {sgSearchType === "subject" && (
            <form onSubmit={sgSearchBySubject} className="relative">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300" />
                <div className="relative flex">
                  <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                    <input
                      type="text"
                      placeholder="Search any subject: Mathematics, Physics, Literature..."
                      value={sgSubject}
                      onChange={(e) => setSgSubject(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border-0 rounded-l-2xl focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
                      disabled={sgLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sgLoading || !sgSubject.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-r-2xl hover:from-blue-700 hover:to-blue-900 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {sgLoading ? "Searching..." : "Search"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Advanced Search - Colorful Form */}
          {sgSearchType === "advanced" && (
            <form onSubmit={sgAdvancedSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Subject</label>
                  <input
                    type="text"
                    placeholder="Any subject..."
                    value={sgSubject}
                    onChange={(e) => setSgSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Meeting Time</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "weekdays", label: "Weekdays", icon: CalendarIcon, color: "from-blue-500 to-cyan-500" },
                      { id: "weekend", label: "Weekend", icon: SparklesIcon, color: "from-cyan-500 to-blue-500" },
                      { id: "morning", label: "Morning", icon: ClockIcon, color: "from-yellow-500 to-orange-500" },
                      { id: "evening", label: "Evening", icon: ClockIcon, color: "from-blue-500 to-cyan-500" },
                    ].map((time) => {
                      const Icon = time.icon;
                      const isSelected = sgMeetingTime[time.id];
                      return (
                        <label
                          key={time.id}
                          className={`relative cursor-pointer group`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => setSgMeetingTime(prev => ({ ...prev, [time.id]: !prev[time.id] }))}
                            className="sr-only"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-r ${time.color} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                          <div className={`relative p-3 border-2 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 ${
                            isSelected 
                              ? `border-transparent bg-gradient-to-r ${time.color} text-white` 
                              : "border-gray-200 bg-white text-gray-700 group-hover:border-gray-300"
                          }`}>
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{time.label}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={sgLoading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-800 text-white font-semibold rounded-xl hover:from-blue-700 hover:via-cyan-700 hover:to-blue-900 disabled:from-gray-400 disabled:to-gray-400 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {sgLoading ? "Applying Filters..." : "Apply Filters"}
              </button>
            </form>
          )}
        </div>

        {/* Error State */}
        {sgError && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl shadow-xl">
            <div className="flex items-center text-white">
              <XCircleIcon className="w-8 h-8 mr-4" />
              <p className="text-lg font-semibold">{sgError}</p>
            </div>
          </div>
        )}

        {/* Loading State with Colorful Skeleton */}
        {sgLoading && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <div className="inline-block relative">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpenIcon className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
              </div>
              <p className="mt-4 text-xl font-medium text-gray-600">Loading amazing study groups...</p>
            </div>
            
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 animate-pulse">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-2xl" />
                      <div className="h-8 w-48 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg" />
                      <div className="h-4 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg" />
                    </div>
                  </div>
                  <div className="w-32 h-12 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Groups Grid - Colorful Cards */}
        {!sgLoading && sgGroups.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Discover {sgGroups.length} Study Group{sgGroups.length !== 1 ? "s" : ""}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  {stats.available} spots available
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sgGroups.map((group) => {
                const isMember = group.members?.some(
                  (member) => (member._id || member).toString() === userId
                );
                const memberCount = group.members?.length || 0;
                const maxMembers = group.maxMembers || 0;
                const isFull = memberCount >= maxMembers;
                const availableSpots = maxMembers - memberCount;
                const percentage = (memberCount / maxMembers) * 100;
                const subjectGradient = getSubjectColor(group.subject);
                const groupGradient = getGroupGradient(isMember, isFull, memberCount, maxMembers);

                return (
                  <div
                    key={group._id}
                    className={`group relative bg-gradient-to-br ${groupGradient} rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden`}
                  >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/20 to-transparent rounded-tr-full" />
                    
                    <div className="relative p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 bg-gradient-to-r ${subjectGradient} rounded-2xl shadow-lg`}>
                            <AcademicCapIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{group.name}</h3>
                            <div className="flex items-center mt-1">
                              <span className={`px-3 py-1 bg-gradient-to-r ${subjectGradient} text-white text-xs font-semibold rounded-full`}>
                                {group.subject}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {isMember && (
                          <div className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold flex items-center">
                            <CheckCircleSolid className="w-4 h-4 mr-1" />
                            Joined
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {group.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {group.description}
                        </p>
                      )}

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">Members</span>
                          <span className="font-bold text-gray-900">
                            {memberCount}/{maxMembers}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${
                              isFull ? 'from-red-500 to-red-600' : 
                              percentage >= 75 ? 'from-orange-500 to-red-500' :
                              'from-blue-500 to-cyan-500'
                            } rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Meeting Times */}
                      {group.meetingTime && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {group.meetingTime.weekdays && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center">
                              <CalendarIcon className="w-3 h-3 mr-1" />
                              Weekdays
                            </span>
                          )}
                          {group.meetingTime.weekend && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center">
                              <SparklesIcon className="w-3 h-3 mr-1" />
                              Weekend
                            </span>
                          )}
                          {group.meetingTime.morning && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center">
                              <ClockIcon className="w-3 h-3 mr-1" />
                              Morning
                            </span>
                          )}
                          {group.meetingTime.evening && (
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium flex items-center">
                              <ClockIcon className="w-3 h-3 mr-1" />
                              Evening
                            </span>
                          )}
                        </div>
                      )}

                      {/* Creator and Action */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {group.creator?.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            by {group.creator?.name || 'Unknown'}
                          </span>
                        </div>

                        {!isMember ? (
                          <button
                            onClick={() => handleJoinGroup(group._id)}
                            disabled={joinLoading === group._id || isFull}
                            className={`relative group/btn px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:-translate-y-1 ${
                              isFull
                                ? 'bg-gray-400 cursor-not-allowed'
                                : `bg-gradient-to-r ${subjectGradient} hover:shadow-xl`
                            }`}
                          >
                            {joinLoading === group._id ? (
                              <div className="flex items-center">
                                <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                                Joining...
                              </div>
                            ) : isFull ? (
                              <div className="flex items-center">
                                <XCircleIcon className="w-4 h-4 mr-2" />
                                Full
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <PlusIcon className="w-4 h-4 mr-2 group-hover/btn:rotate-90 transition-transform duration-300" />
                                Join Now
                              </div>
                            )}
                          </button>
                        ) : (
                          <div className="px-6 py-3 bg-green-100 text-green-700 rounded-xl font-semibold flex items-center">
                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                            Joined
                          </div>
                        )}
                      </div>

                      {/* Available spots badge */}
                      {!isFull && !isMember && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full animate-pulse">
                            {availableSpots} {availableSpots === 1 ? 'spot' : 'spots'} left!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Colorful Empty State */}
        {!sgLoading && sgGroups.length === 0 && !sgError && (
          <div className="relative bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-100 rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-grid-blue-500/10 bg-[length:50px_50px]" />
            <div className="relative">
              <div className="inline-block p-6 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-3xl shadow-2xl mb-6 animate-bounce">
                <UserGroupIcon className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                No Study Groups Found
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Be the first to create a study group and start collaborating with fellow learners!
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white text-lg font-semibold rounded-2xl hover:from-blue-700 hover:via-cyan-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <PlusIcon className="w-6 h-6 mr-2" />
                Create Your First Group
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          sgLoadAll();
          fetchDashboardData();
        }}
      />
    </div>
  );
};

export default StudyGroupsTab;