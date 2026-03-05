import { EnvelopeIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const MyGroupsTab = ({
  mgLoading,
  mgError,
  mgCreated,
  mgJoined,
  mgActionLoading,
  mgViewDetails,
  mgOpenEdit,
  mgDelete,
  mgLeave,
  openInviteModal,
  showDetailsModal,
  setShowDetailsModal,
  selectedGroup,
}) => {
  // Helper function to convert 24-hour time to 12-hour format with AM/PM
  const formatTime = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${String(hours12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  if (mgLoading) {
    return (
      <div className="py-12 text-center text-gray-500">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
          <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
          Loading your groups...
        </div>
      </div>
    );
  }

  const GroupCard = ({ group, isCreator }) => {
    const memberCount = group.members?.length || 0;
    const backendUrl = 'http://localhost:5000';

    // Generate star rating based on member fill percentage
    const fillPercentage = group.maxMembers > 0 ? (memberCount / group.maxMembers) * 5 : 0;
    const fullStars = Math.floor(fillPercentage);
    const hasHalfStar = fillPercentage % 1 >= 0.5;

    return (
      <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Yellow Top Bar */}
        <div className="h-2 bg-amber-400" />
        
        {/* Image Section */}
        <div className="relative">
          {group.image ? (
            <img
              src={`${backendUrl}${group.image}`}
              alt={group.name}
              className="w-full h-44 object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop';
              }}
            />
          ) : (
            <div className="w-full h-44 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <UserGroupIcon className="w-16 h-16 text-indigo-300" />
            </div>
          )}
          
          {/* Play Button Overlay */}
          <button
            type="button"
            onClick={() => mgViewDetails(group._id)}
            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
          >
            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>

          {/* Status Badge */}
          {!isCreator && (
            <span className="absolute top-3 right-3 px-3 py-1.5 text-xs font-bold text-white bg-green-500 rounded-full shadow-md">
              Joined
            </span>
          )}
          {isCreator && (
            <span className="absolute top-3 right-3 px-3 py-1.5 text-xs font-bold text-white bg-amber-500 rounded-full shadow-md">
              Creator
            </span>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5">
          {/* Subject Tag */}
          <span className="inline-block px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full mb-3">
            {group.subject}
          </span>

          {/* Group Name */}
          <h4 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
            {group.name}
          </h4>

          {/* Description */}
          {group.description ? (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{group.description}</p>
          ) : (
            <p className="text-sm text-gray-400 italic mb-3">No description provided</p>
          )}

          {/* Meeting Times */}
          {group.meetingTimes && group.meetingTimes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {group.meetingTimes.slice(0, 2).map((slot, idx) => (
                <span key={idx} className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  {slot.day} {formatTime(slot.startTime)}
                </span>
              ))}
              {group.meetingTimes.length > 2 && (
                <span className="text-xs text-gray-500 px-2 py-1">+{group.meetingTimes.length - 2} more</span>
              )}
            </div>
          )}

          {/* Members & Rating Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <UserGroupIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{memberCount}/{group.maxMembers}</span>
            </div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < fullStars
                      ? 'text-amber-400'
                      : i === fullStars && hasHalfStar
                      ? 'text-amber-400'
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

          {/* Creator Info */}
          {!isCreator && group.creator?.name && (
            <p className="text-xs text-gray-500 mb-4">Created by <span className="font-medium text-gray-700">{group.creator.name}</span></p>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100 pt-4">
            {/* Action Buttons Row */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => mgViewDetails(group._id)}
                disabled={mgActionLoading === group._id}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mgActionLoading === group._id ? "Loading..." : "Details"}
              </button>

              {isCreator ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openInviteModal(group._id)}
                    className="p-2.5 text-teal-600 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors"
                    title="Invite"
                  >
                    <EnvelopeIcon className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => mgOpenEdit(group)}
                    disabled={mgActionLoading === group._id}
                    className="px-4 py-2.5 text-sm font-semibold text-white bg-amber-500 rounded-xl hover:bg-amber-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => mgDelete(group._id, group.name)}
                    disabled={mgActionLoading === group._id}
                    className="px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {mgActionLoading === group._id ? "..." : "Delete"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => mgLeave(group._id, group.name)}
                  disabled={mgActionLoading === group._id}
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {mgActionLoading === group._id ? "..." : "Leave"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 rounded-xl">
          <UserGroupIcon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Study Groups</h2>
          <p className="text-sm text-gray-500">Manage your created groups and the groups you joined.</p>
        </div>
      </div>

      {mgError && (
        <div className="p-3 mb-4 text-red-700 border border-red-200 rounded-xl bg-red-50 shadow-sm">
          {mgError}
        </div>
      )}

      <div className="mb-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Groups I Created</h3>
          <span className="text-sm text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1 w-fit">
            {mgCreated.length} total
          </span>
        </div>

        {mgCreated.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mgCreated.map((g) => (
              <GroupCard key={g._id} group={g} isCreator />
            ))}
          </div>
        ) : (
          <div className="py-12">
            <div className="max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-2xl text-center shadow-sm">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <UserGroupIcon className="w-7 h-7 text-indigo-600" />
              </div>
              <h4 className="mt-4 text-lg font-semibold text-gray-900">No created groups yet</h4>
              <p className="mt-1 text-sm text-gray-500">Create a group from the Study Groups tab to get started.</p>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Groups I Joined</h3>
          <span className="text-sm text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1 w-fit">
            {mgJoined.length} total
          </span>
        </div>

        {mgJoined.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mgJoined.map((g) => (
              <GroupCard key={g._id} group={g} isCreator={false} />
            ))}
          </div>
        ) : (
          <div className="py-12">
            <div className="max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-2xl text-center shadow-sm">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <UserGroupIcon className="w-7 h-7 text-indigo-600" />
              </div>
              <h4 className="mt-4 text-lg font-semibold text-gray-900">No joined groups yet</h4>
              <p className="mt-1 text-sm text-gray-500">Browse groups and join one that fits your schedule.</p>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedGroup && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="group-details-title"
        >
          <div className="min-h-full flex items-start sm:items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                <h3 id="group-details-title" className="text-xl font-bold text-gray-900">Group Details</h3>
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="text-2xl text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{selectedGroup.name}</h4>
                    {selectedGroup.description && <p className="mt-2 text-gray-600">{selectedGroup.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                      <div className="text-sm font-semibold text-gray-700">Subject</div>
                      <div className="mt-2">
                        <span className="px-3 py-1 text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full">
                          {selectedGroup.subject}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                      <div className="text-sm font-semibold text-gray-700">Members</div>
                      <p className="mt-2 text-gray-700">
                        {selectedGroup.members?.length || 0}/{selectedGroup.maxMembers}
                      </p>
                    </div>
                  </div>

                  {selectedGroup.creator && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                      <div className="text-sm font-semibold text-gray-700">Created by</div>
                      <p className="mt-2 text-gray-700">
                        {selectedGroup.creator.name} ({selectedGroup.creator.email})
                      </p>
                    </div>
                  )}

                  {selectedGroup.meetingTimes && selectedGroup.meetingTimes.length > 0 && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                      <div className="text-sm font-semibold text-gray-700 mb-3">Meeting Schedule</div>
                      <div className="space-y-2">
                        {selectedGroup.meetingTimes.map((slot, idx) => (
                          <div key={idx} className="text-sm text-gray-700 p-2 bg-white border border-gray-100 rounded-lg">
                            <span className="font-semibold">{slot.day}</span> {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedGroup.members?.length > 0 && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                      <div className="text-sm font-semibold text-gray-700">Member List</div>
                      <div className="mt-3 space-y-2">
                        {selectedGroup.members.map((m, i) => (
                          <div
                            key={m._id || i}
                            className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 break-words">{m.name}</p>
                              <p className="text-xs text-gray-500 break-words">{m.email}</p>
                            </div>
                            {m._id === selectedGroup.creator?._id && (
                              <span className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full">
                                Creator
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}


                </div>

                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full px-4 py-2.5 mt-6 text-white bg-gray-700 rounded-xl hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGroupsTab;
