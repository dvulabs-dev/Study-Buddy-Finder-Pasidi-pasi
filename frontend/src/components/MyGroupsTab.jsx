import { EnvelopeIcon } from "@heroicons/react/24/outline";

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
  mgUpdate,
  openInviteModal,
  showEditModal,
  setShowEditModal,
  editFormData,
  setEditFormData,
  showDetailsModal,
  setShowDetailsModal,
  selectedGroup,
}) => {
  if (mgLoading) return <div className="py-12 text-center text-gray-500">Loading your groups...</div>;

  const GroupCard = ({ group, isCreator }) => (
    <div className="p-4 transition border border-gray-200 rounded-lg hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900">{group.name}</h4>
          {group.description && <p className="mt-1 text-sm text-gray-600">{group.description}</p>}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
            <span className="px-2 py-1 text-purple-700 bg-purple-100 rounded">📚 {group.subject}</span>
            <span>👥 {group.members?.length || 0}/{group.maxMembers} members</span>
            {!isCreator && group.creator?.name && <span className="text-xs">Created by {group.creator.name}</span>}
            {isCreator && <span className={`px-2 py-1 rounded text-xs ${group.isActive !== false ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{group.isActive !== false ? "✓ Active" : "✗ Inactive"}</span>}
          </div>
          {group.meetingTime && <div className="flex gap-2 mt-2 text-xs text-gray-500">{group.meetingTime.weekdays && <span>📅 Weekdays</span>}{group.meetingTime.weekend && <span>📅 Weekend</span>}{group.meetingTime.morning && <span>🌅 Morning</span>}{group.meetingTime.evening && <span>🌆 Evening</span>}</div>}
        </div>
        <div className="flex flex-wrap gap-2 ml-4">
          <button onClick={() => mgViewDetails(group._id)} disabled={mgActionLoading === group._id} className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400">View</button>
          <button onClick={() => openInviteModal(group._id)} className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-teal-600 rounded hover:bg-teal-700">
            <EnvelopeIcon className="w-3.5 h-3.5" />Invite
          </button>
          {isCreator && <>
            <button onClick={() => mgOpenEdit(group)} disabled={mgActionLoading === group._id} className="px-3 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:bg-gray-400">Edit</button>
            <button onClick={() => mgDelete(group._id, group.name)} disabled={mgActionLoading === group._id} className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:bg-gray-400">{mgActionLoading === group._id ? "..." : "Delete"}</button>
          </>}
          {!isCreator && <button onClick={() => mgLeave(group._id, group.name)} disabled={mgActionLoading === group._id} className="px-3 py-1 text-sm text-white bg-orange-600 rounded hover:bg-orange-700 disabled:bg-gray-400">{mgActionLoading === group._id ? "..." : "Leave"}</button>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">My Study Groups</h2>
      {mgError && <div className="p-3 mb-4 text-red-700 border border-red-200 rounded-lg bg-red-50">{mgError}</div>}

      <div className="mb-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-900">Groups I Created ({mgCreated.length})</h3>
        {mgCreated.length > 0 ? <div className="space-y-4">{mgCreated.map((g) => <GroupCard key={g._id} group={g} isCreator />)}</div> : <div className="py-8 text-center text-gray-500">You haven&apos;t created any groups yet.</div>}
      </div>

      <div>
        <h3 className="mb-4 text-xl font-semibold text-gray-900">Groups I Joined ({mgJoined.length})</h3>
        {mgJoined.length > 0 ? <div className="space-y-4">{mgJoined.map((g) => <GroupCard key={g._id} group={g} isCreator={false} />)}</div> : <div className="py-8 text-center text-gray-500">You haven&apos;t joined any groups yet.</div>}
      </div>

      {/* Edit Modal */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-bold text-gray-900">Edit Study Group</h3><button onClick={() => setShowEditModal(false)} className="text-2xl text-gray-500 hover:text-gray-700">&times;</button></div>
            <form onSubmit={mgUpdate} className="space-y-4">
              <div><label className="block mb-2 text-sm font-medium text-gray-700">Group Name *</label><input type="text" value={editFormData.name} onChange={(e) => setEditFormData((p) => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" /></div>
              <div><label className="block mb-2 text-sm font-medium text-gray-700">Subject *</label><input type="text" value={editFormData.subject} onChange={(e) => setEditFormData((p) => ({ ...p, subject: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" /></div>
              <div><label className="block mb-2 text-sm font-medium text-gray-700">Description</label><textarea value={editFormData.description} onChange={(e) => setEditFormData((p) => ({ ...p, description: e.target.value }))} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" /></div>
              <div><label className="block mb-2 text-sm font-medium text-gray-700">Max Members</label><input type="number" value={editFormData.maxMembers} onChange={(e) => setEditFormData((p) => ({ ...p, maxMembers: e.target.value }))} min="2" max="50" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" /></div>
              <div><label className="block mb-2 text-sm font-medium text-gray-700">Meeting Time *</label>
                <div className="grid grid-cols-2 gap-3">
                  {["weekdays", "weekend", "morning", "evening"].map((f) => (
                    <label key={f} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" checked={editFormData.meetingTime[f]} onChange={() => setEditFormData((p) => ({ ...p, meetingTime: { ...p.meetingTime, [f]: !p.meetingTime[f] } }))} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                      <span className="text-sm text-gray-700 capitalize">{f}</span>
                    </label>
                  ))}
                </div>
              </div>
              <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={editFormData.isActive} onChange={(e) => setEditFormData((p) => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" /><span className="text-sm text-gray-700">Group is Active</span></label>
              {mgError && <div className="p-3 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">{mgError}</div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 text-gray-700 transition border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={mgActionLoading} className="flex-1 px-4 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400">{mgActionLoading ? "Updating..." : "Update Group"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-bold text-gray-900">Group Details</h3><button onClick={() => setShowDetailsModal(false)} className="text-2xl text-gray-500 hover:text-gray-700">&times;</button></div>
            <div className="space-y-4">
              <div><h4 className="text-2xl font-bold text-gray-900">{selectedGroup.name}</h4>{selectedGroup.description && <p className="mt-2 text-gray-600">{selectedGroup.description}</p>}</div>
              <div><span className="text-sm font-medium text-gray-700">Subject:</span><div className="mt-1"><span className="px-3 py-1 text-purple-700 bg-purple-100 rounded">📚 {selectedGroup.subject}</span></div></div>
              <div><span className="text-sm font-medium text-gray-700">Members:</span><p className="mt-1 text-gray-600">{selectedGroup.members?.length || 0}/{selectedGroup.maxMembers}</p></div>
              {selectedGroup.creator && <div><span className="text-sm font-medium text-gray-700">Created by:</span><p className="mt-1 text-gray-600">{selectedGroup.creator.name} ({selectedGroup.creator.email})</p></div>}
              {selectedGroup.meetingTime && <div><span className="text-sm font-medium text-gray-700">Meeting Times:</span><div className="flex flex-wrap gap-2 mt-1">{selectedGroup.meetingTime.weekdays && <span className="px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded">📅 Weekdays</span>}{selectedGroup.meetingTime.weekend && <span className="px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded">📅 Weekend</span>}{selectedGroup.meetingTime.morning && <span className="px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded">🌅 Morning</span>}{selectedGroup.meetingTime.evening && <span className="px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded">🌆 Evening</span>}</div></div>}
              {selectedGroup.members?.length > 0 && <div><span className="text-sm font-medium text-gray-700">Member List:</span><div className="mt-2 space-y-2">{selectedGroup.members.map((m, i) => (
                <div key={m._id || i} className="flex items-center justify-between p-2 rounded bg-gray-50"><div><p className="text-sm font-medium text-gray-900">{m.name}</p><p className="text-xs text-gray-500">{m.email}</p></div>{m._id === selectedGroup.creator?._id && <span className="px-2 py-1 text-xs text-indigo-700 bg-indigo-100 rounded">Creator</span>}</div>
              ))}</div></div>}
              <div><span className="text-sm font-medium text-gray-700">Status:</span><p className={`mt-1 ${selectedGroup.isActive !== false ? "text-green-600" : "text-gray-500"}`}>{selectedGroup.isActive !== false ? "✓ Active" : "✗ Inactive"}</p></div>
            </div>
            <button onClick={() => setShowDetailsModal(false)} className="w-full px-4 py-2 mt-6 text-white bg-gray-600 rounded-lg hover:bg-gray-700">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGroupsTab;
