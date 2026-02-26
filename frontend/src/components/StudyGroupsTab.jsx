import { UserGroupIcon } from "@heroicons/react/24/outline";
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
}) => (
  <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Study Groups</h2>
      <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700">+ Create New Group</button>
    </div>

    <div className="flex gap-3 mb-6">
      {[["all", "All Groups"], ["subject", "By Subject"], ["advanced", "Advanced"]].map(([k, l]) => (
        <button key={k} onClick={() => { setSgSearchType(k); if (k === "all") sgLoadAll(); }}
          className={`px-4 py-2 rounded-lg font-medium transition text-sm ${sgSearchType === k ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>{l}</button>
      ))}
    </div>

    {sgSearchType === "subject" && (
      <form onSubmit={sgSearchBySubject} className="flex gap-2 mb-6">
        <input type="text" placeholder="Enter subject..." value={sgSubject} onChange={(e) => setSgSubject(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        <button type="submit" disabled={sgLoading} className="px-6 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400">{sgLoading ? "Searching..." : "Search"}</button>
      </form>
    )}

    {sgSearchType === "advanced" && (
      <form onSubmit={sgAdvancedSearch} className="mb-6 space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Subject (optional)</label>
          <input type="text" placeholder="Enter Subject" value={sgSubject} onChange={(e) => setSgSubject(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Meeting Time</label>
          <div className="grid grid-cols-2 gap-3">
            {["weekdays", "weekend", "morning", "evening"].map((f) => (
              <label key={f} className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={sgMeetingTime[f]} onChange={() => setSgMeetingTime((p) => ({ ...p, [f]: !p[f] }))} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <span className="text-sm text-gray-700 capitalize">{f}</span>
              </label>
            ))}
          </div>
        </div>
        <button type="submit" disabled={sgLoading} className="w-full px-6 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400">{sgLoading ? "Searching..." : "Search with Filters"}</button>
      </form>
    )}

    {sgError && <div className="p-3 mb-4 text-red-700 border border-red-200 rounded-lg bg-red-50">{sgError}</div>}

    {sgLoading ? <div className="py-8 text-center text-gray-500">Loading groups...</div> : sgGroups.length > 0 ? (
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{sgGroups.length} group{sgGroups.length !== 1 ? "s" : ""} found</h3>
        <div className="space-y-4">
          {sgGroups.map((g) => {
            const uid = user?._id || user?.id;
            const isMember = g.members?.some((m) => (m._id || m).toString() === uid);
            return (
              <div key={g._id} className="p-4 transition border border-gray-200 rounded-lg hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{g.name}</h4>
                    {g.description && <p className="mt-1 text-sm text-gray-600">{g.description}</p>}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                      <span className="px-2 py-1 text-purple-700 bg-purple-100 rounded">📚 {g.subject}</span>
                      <span>👥 {g.members?.length || 0}/{g.maxMembers} members</span>
                      {g.creator?.name && <span className="text-xs">Created by {g.creator.name}</span>}
                    </div>
                    {g.meetingTime && <div className="flex gap-2 mt-2 text-xs text-gray-500">{g.meetingTime.weekdays && <span>📅 Weekdays</span>}{g.meetingTime.weekend && <span>📅 Weekend</span>}{g.meetingTime.morning && <span>🌅 Morning</span>}{g.meetingTime.evening && <span>🌆 Evening</span>}</div>}
                  </div>
                  {isMember ? (
                    <span className="px-4 py-2 ml-4 text-sm font-medium text-green-700 bg-green-100 rounded-lg">✓ Joined</span>
                  ) : (
                    <button onClick={() => handleJoinGroup(g._id)} disabled={joinLoading === g._id} className="px-4 py-2 ml-4 text-sm text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400">{joinLoading === g._id ? "Joining..." : "Join Group"}</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ) : (
      <div className="py-8 text-center text-gray-500">No study groups found. <button onClick={() => setShowCreateModal(true)} className="font-medium text-indigo-600 hover:text-indigo-700">Create a new group</button>.</div>
    )}

    <CreateGroupModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={() => { sgLoadAll(); fetchDashboardData(); }} />
  </div>
);

export default StudyGroupsTab;
