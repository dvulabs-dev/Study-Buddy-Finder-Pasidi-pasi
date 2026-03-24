import React from 'react'
import {
  Users as UsersIcon,
  Search as SearchIcon,
  BookOpen as BookOpenIcon,
  GraduationCap as GraduationCapIcon,
  User as UserIcon,
  ChevronRight as ChevronRightIcon,
  AlertCircle as AlertCircleIcon,
  Bell as BellIcon,
  Check as CheckIcon,
  X as XIcon,
  SquarePen as PenSquareIcon,
  MapPin as MapPinIcon,
  Loader2 as Loader2Icon,
} from 'lucide-react'

const API_BASE = "http://localhost:5000";

const getGroupImage = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  return `${API_BASE}${img}`;
};


export const DashboardTab = ({
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
  myFriendsList,
  renderFriendButton,
}) => {
  if (dashLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2Icon className="w-10 h-10 mb-4 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium">
          Loading your learning dashboard...
        </p>
      </div>
    )
  }
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
  const hasSharedGroupSuggestions = suggestedBuddies?.some((b) => b.sharedGroups && b.sharedGroups.length > 0)
  return (
    <div className="space-y-8">
      {dashError && (
        <div className="flex items-center p-4 space-x-3 text-red-700 border border-red-200 bg-red-50 rounded-xl">
          <AlertCircleIcon className="flex-shrink-0 w-5 h-5" />
          <p className="text-sm font-medium">{dashError}</p>
        </div>
      )}

      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/30 to-violet-50/50 border border-indigo-100 rounded-3xl p-8 lg:p-10 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-indigo-700 bg-indigo-100/80 rounded-full">
            {currentDate}
          </div>
          <h1 className="mb-3 text-3xl font-bold text-gray-900 lg:text-4xl tracking-tight">
            {greeting}, {user?.name?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="mb-8 text-lg text-gray-600 leading-relaxed">
            Ready for another productive day? You have{' '}
            <span className="font-semibold text-indigo-600">
              {myGroupsList.length} active groups
            </span>{' '}
            and{' '}
            <span className="font-semibold text-indigo-600">
              {pendingRequests.length} pending requests
            </span>
            .
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('studygroups')}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white transition-colors bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm"
            >
              <UsersIcon className="w-4 h-4" />
              Browse Groups
            </button>
            <button
              onClick={() => setActiveTab('findbuddies')}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-indigo-700 transition-colors bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 shadow-sm"
            >
              <SearchIcon className="w-4 h-4" />
              Find Buddies
            </button>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200/40 to-violet-200/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 right-40 w-48 h-48 bg-gradient-to-br from-sky-200/40 to-indigo-200/40 rounded-full blur-3xl -mb-20 pointer-events-none" />
      </div>

      {/* 2. Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: 'Total Groups',
            value: studyGroups.length,
            icon: UsersIcon,
            color: 'indigo',
          },
          {
            label: 'My Groups',
            value: myGroupsList.length,
            icon: BookOpenIcon,
            color: 'violet',
          },
          {
            label: 'My Subjects',
            value: user?.subjects?.length || 0,
            icon: GraduationCapIcon,
            color: 'sky',
          },
          {
            label: 'Buddies Found',
            value: suggestedBuddies.length,
            icon: UserIcon,
            color: 'emerald',
          },
        ].map((stat, i) => {
          const colorStyles = {
            indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
            violet: 'bg-violet-50 text-violet-600 border-violet-100',
            sky: 'bg-sky-50 text-sky-600 border-sky-100',
            emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
          }
          return (
            <div
              key={i}
              className="p-5 bg-white border border-gray-200/80 rounded-2xl shadow-sm"
            >
              <div
                className={`p-2.5 rounded-xl w-fit mb-4 border ${colorStyles[stat.color]}`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          )
        })}
      </div>

      {/* 3. Two-column row: Profile Card + Suggested Buddies */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 w-full">
        {/* Profile Card */}
        <div className="w-full">
          <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
          <div className="h-20 bg-gradient-to-r from-indigo-500 to-violet-600 relative">
            <button
              onClick={openProfileEdit}
              className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-colors"
              aria-label="Edit Profile"
            >
              <PenSquareIcon className="w-3 h-3" />
            </button>
          </div>
          <div className="px-4 pb-4 flex-1 flex flex-col items-center text-center -mt-10 relative z-10">
            <div className="w-20 h-20 bg-white rounded-full p-1 mb-3 shadow-sm">
              <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 border border-indigo-200/50 overflow-hidden">
                {user?.profileImage ? (
                  <img src={`${API_BASE}${user.profileImage}`} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  getInitials(user?.name)
                )}
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-0.5">
              {user?.name || 'Student'}
            </h3>
            <p className="text-xs font-medium text-indigo-600 mb-1">
              {user?.degree || 'Degree Program'}
            </p>
            <div className="flex items-center text-[10px] text-gray-500 mb-4">
              <MapPinIcon className="w-3 h-3 mr-0.5" />
              {user?.university || 'University'}
            </div>

            <div className="w-full grid grid-cols-3 gap-1 pt-4 border-t border-gray-100 mt-auto">
              <div className="text-center">
                <p className="text-base font-bold text-gray-900">
                  {myGroupsList.length}
                </p>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                  Groups
                </p>
              </div>
              <div className="text-center border-x border-gray-100">
                <p className="text-lg font-bold text-gray-900">
                  {myFriendsList?.length || 0}
                </p>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                  Friends
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {suggestedBuddies.length}
                </p>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                  Buddies
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Suggested Buddies */}
        <div className="w-full">
          <div className="rounded-2xl shadow-sm overflow-hidden flex flex-col h-full" style={{ backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="p-4 relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Suggested Buddies
                </h3>
                <p className="text-xs text-white/80">
                  {hasSharedGroupSuggestions
                    ? 'Classmates from your study groups'
                    : 'People who share your interests'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('findbuddies')}
                className="text-xs font-medium text-white hover:text-white/80"
              >
                Find more
              </button>
            </div>

            {suggestedBuddies.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2 shadow-sm">
                  <UserIcon className="w-5 h-5 text-white/70" />
                </div>
                <p className="text-xs font-medium text-white mb-0.5">
                  No suggestions yet
                </p>
                <p className="text-[10px] text-white/70">
                  Join or create study groups to discover new buddies.
                </p>
              </div>
            ) : (
              <div className="space-y-2 flex-1">
                {suggestedBuddies.slice(0, 4).map((buddy) => (
                  <div
                    key={buddy._id}
                    className="flex items-center justify-between p-2 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm hover:border-white/40 hover:bg-white/15 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0 overflow-hidden">
                        {buddy.profileImage ? (
                          <img src={`${API_BASE}${buddy.profileImage}`} alt={buddy.name} className="w-full h-full object-cover" />
                        ) : (
                          getInitials(buddy.name)
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {buddy.name}
                        </p>
                        {buddy.sharedGroups && buddy.sharedGroups.length > 0 ? (
                          <p className="text-[9px] text-white/70 truncate">
                            Shared groups: {buddy.sharedGroups.slice(0, 2).map((g) => g.name).join(', ')}
                            {buddy.sharedGroups.length > 2 && ' +' + (buddy.sharedGroups.length - 2)}
                          </p>
                        ) : (
                          <p className="text-[9px] text-white/70 truncate">
                            {buddy.degree || buddy.subjects?.slice(0, 2).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      {renderFriendButton
                        ? renderFriendButton(buddy._id)
                        : (
                          <button
                            onClick={() => setActiveTab('findbuddies')}
                            className="px-2 py-1 text-[10px] font-medium text-indigo-700 bg-white/90 rounded-md hover:bg-white transition-colors"
                          >
                            Connect
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. My Study Groups */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <BookOpenIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                My Study Groups
              </h3>
              <p className="text-sm text-gray-500">
                {myGroupsList.length} active groups
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {myGroupsList.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                You haven't joined any groups yet
              </p>
              <button
                onClick={() => setActiveTab('studygroups')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Browse study groups
              </button>
            </div>
          ) : (
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {myGroupsList.slice(0, 4).map((group) => {
                const memberCount = group.members?.length || 0
                const maxMembers = group.maxMembers || 10
                const fillPercentage = (memberCount / maxMembers) * 100
                const isFull = memberCount >= maxMembers
                return (
                  <div
                    key={group._id}
                    className="flex-shrink-0 w-64 bg-white border border-gray-200/80 rounded-xl overflow-hidden flex flex-col hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setActiveTab('studygroups')}
                  >
                    <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500" />
                    <div className="h-24 bg-gradient-to-br from-indigo-50 to-violet-50 relative flex items-center justify-center border-b border-gray-100 overflow-hidden">
                      {group.image ? (
                        <img src={getGroupImage(group.image)} alt={group.name} className="w-full h-full object-cover" />
                      ) : (
                        <UsersIcon className="w-8 h-8 text-indigo-200" />
                      )}
                      <span
                        className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full ${isFull ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}
                      >
                        {isFull ? 'Full' : 'Active'}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-indigo-700 bg-indigo-50 rounded-md mb-2 w-fit">
                        {group.subject}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                        {group.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-4 line-clamp-1">
                        {group.description || 'No description provided.'}
                      </p>
                      <div className="mt-auto">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                          <span className="font-medium">Members</span>
                          <span>
                            {memberCount} / {maxMembers}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                          <div
                            className={`h-full rounded-full transition-all ${isFull ? 'bg-red-500' : 'bg-indigo-500'}`}
                            style={{
                              width: `${Math.min(fillPercentage, 100)}%`,
                            }}
                          />
                        </div>
                        <button className="w-full py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
              {myGroupsList.length > 4 && (
                <div className="flex-shrink-0 w-64 flex items-center justify-center">
                  <button
                    onClick={() => setActiveTab('studygroups')}
                    className="flex flex-col items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                      <ChevronRightIcon className="w-6 h-6" />
                    </div>
                    View all {myGroupsList.length}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 5. Active Study Groups */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-50 rounded-lg">
              <SearchIcon className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Browse Study Groups
              </h3>
              <p className="text-sm text-gray-500">
                {studyGroups.length} groups available
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {studyGroups.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm font-medium text-gray-900">
                No study groups available yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studyGroups.slice(0, 4).map((group) => {
                const uid = user?._id || user?.id
                const isMember = group.members?.some(
                  (m) => (m._id || m).toString() === uid,
                )
                const memberCount = group.members?.length || 0
                const capacity = group.maxMembers || 10
                const isFull = memberCount >= capacity
                return (
                  <div
                    key={group._id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                      {/* Group Image Mini Thumbnail */}
                      <div className="w-12 h-12 rounded-lg bg-indigo-50 flex-shrink-0 overflow-hidden border border-gray-100">
                        {group.image ? (
                          <img src={getGroupImage(group.image)} alt={group.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <UsersIcon className="w-5 h-5 text-indigo-200" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-[10px] font-semibold text-violet-700 bg-violet-50 rounded-md">
                          {group.subject}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full ${isMember ? 'bg-indigo-100 text-indigo-700' : isFull ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}
                        >
                          {isMember ? 'Joined' : isFull ? 'Full' : 'Open'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 truncate mb-1">
                        {group.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <UsersIcon className="w-3.5 h-3.5" />
                        <span>
                          {memberCount} / {capacity} members
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('studygroups')}
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
          {studyGroups.length > 4 && (
            <button
              onClick={() => setActiveTab('studygroups')}
              className="w-full mt-4 py-3 text-sm font-medium text-indigo-600 bg-indigo-50/50 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              View all {studyGroups.length} groups
            </button>
          )}
        </div>
      </div>

      {/* 6. Notifications */}
      {(pendingRequests.length > 0 || groupInvitesList.length > 0) && (
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <BellIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Notifications
                  <span className="px-2 py-0.5 text-xs font-bold text-white bg-amber-500 rounded-full">
                    {pendingRequests.length + groupInvitesList.length}
                  </span>
                </h3>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('findbuddies')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View all
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingRequests.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">
                  Friend Requests
                </h4>
                <div className="space-y-3">
                  {pendingRequests.slice(0, 3).map((req) => (
                    <div
                      key={req._id}
                      className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50/50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0 overflow-hidden">
                          {req.from?.profileImage ? (
                            <img src={`${API_BASE}${req.from.profileImage}`} alt={req.from?.name} className="w-full h-full object-cover" />
                          ) : (
                            getInitials(req.from?.name)
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {req.from?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {req.from?.subjects?.slice(0, 2).join(', ') ||
                              req.from?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 ml-3 flex-shrink-0">
                        <button
                          onClick={() => handleAcceptFriend(req._id)}
                          disabled={friendActionLoading === req._id}
                          className="p-1.5 text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 disabled:opacity-50 transition-colors"
                          aria-label="Accept"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRejectFriend(req._id)}
                          disabled={friendActionLoading === req._id}
                          className="p-1.5 text-red-700 bg-red-100 rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors"
                          aria-label="Reject"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {groupInvitesList.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">
                  Group Invites
                </h4>
                <div className="space-y-3">
                  {groupInvitesList.slice(0, 3).map((inv) => (
                    <div
                      key={inv._id}
                      className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50/50"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {inv.group?.name || 'Unknown Group'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          Invited by {inv.from?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 ml-3 flex-shrink-0">
                        <button
                          onClick={() => handleAcceptGroupInvite(inv._id)}
                          disabled={friendActionLoading === inv._id}
                          className="p-1.5 text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 disabled:opacity-50 transition-colors"
                          aria-label="Accept"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRejectGroupInvite(inv._id)}
                          disabled={friendActionLoading === inv._id}
                          className="p-1.5 text-red-700 bg-red-100 rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors"
                          aria-label="Reject"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardTab;