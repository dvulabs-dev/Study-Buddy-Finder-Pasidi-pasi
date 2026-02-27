import { EnvelopeIcon, UserGroupIcon, PencilSquareIcon, TrashIcon, ArrowRightOnRectangleIcon, EyeIcon, XMarkIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    blue: "bg-blue-50 text-blue-700 border border-blue-200",
    cyan: "bg-cyan-50 text-cyan-700 border border-cyan-200",
    gray: "bg-slate-100 text-slate-500 border border-slate-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

const ActionButton = ({ onClick, disabled, variant = "default", children, title }) => {
  const variants = {
    default: "bg-white border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900",
    primary: "bg-blue-600 text-white hover:bg-blue-700 border border-blue-600",
    cyan: "bg-cyan-600 text-white hover:bg-cyan-700 border border-cyan-600",
    blue: "bg-blue-600 text-white hover:bg-blue-700 border border-blue-600",
    danger: "bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600",
    warning: "bg-white border border-orange-200 text-orange-600 hover:bg-orange-600 hover:text-white hover:border-orange-600",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

const MeetingTimeBadges = ({ meetingTime }) => {
  if (!meetingTime) return null;
  const items = [
    { key: "weekdays", label: "Weekdays", icon: "📅" },
    { key: "weekend", label: "Weekend", icon: "📅" },
    { key: "morning", label: "Morning", icon: "🌅" },
    { key: "evening", label: "Evening", icon: "🌆" },
  ];
  const active = items.filter((i) => meetingTime[i.key]);
  if (!active.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {active.map((i) => (
        <span key={i.key} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-xs font-medium">
          {i.icon} {i.label}
        </span>
      ))}
    </div>
  );
};

const Modal = ({ title, onClose, children, footer }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col border border-slate-100">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      {footer && <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">{footer}</div>}
    </div>
  </div>
);

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
  if (mgLoading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading your groups…</p>
      </div>
    );

  const GroupCard = ({ group, isCreator }) => (
    <div className="group relative flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200">
      {/* Left accent bar */}
      <div className={`hidden sm:block absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${isCreator ? "bg-blue-600" : "bg-cyan-600"}`} />

      <div className="flex-1 min-w-0 sm:pl-2">
        <div className="flex items-start gap-2 flex-wrap">
          <h4 className="text-base font-semibold text-slate-900 leading-snug">{group.name}</h4>
          {isCreator && (
            <Badge variant={group.isActive !== false ? "blue" : "gray"}>
              {group.isActive !== false ? <CheckCircleIcon className="w-3 h-3" /> : <XCircleIcon className="w-3 h-3" />}
              {group.isActive !== false ? "Active" : "Inactive"}
            </Badge>
          )}
        </div>

        {group.description && (
          <p className="mt-1 text-sm text-slate-500 line-clamp-2">{group.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge variant="blue">📚 {group.subject}</Badge>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <UserGroupIcon className="w-3.5 h-3.5" />
            {group.members?.length || 0}/{group.maxMembers}
          </span>
          {!isCreator && group.creator?.name && (
            <span className="text-xs text-slate-400">by {group.creator.name}</span>
          )}
        </div>

        <MeetingTimeBadges meetingTime={group.meetingTime} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 shrink-0 mt-2 sm:mt-0">
        <ActionButton onClick={() => mgViewDetails(group._id)} disabled={mgActionLoading === group._id} variant="default">
          <EyeIcon className="w-4 h-4" /> View
        </ActionButton>
        <ActionButton onClick={() => openInviteModal(group._id)} variant="cyan">
          <EnvelopeIcon className="w-4 h-4" /> Invite
        </ActionButton>
        {isCreator && (
          <>
            <ActionButton onClick={() => mgOpenEdit(group)} disabled={mgActionLoading === group._id} variant="blue">
              <PencilSquareIcon className="w-4 h-4" /> Edit
            </ActionButton>
            <ActionButton onClick={() => mgDelete(group._id, group.name)} disabled={mgActionLoading === group._id} variant="danger">
              <TrashIcon className="w-4 h-4" />
              {mgActionLoading === group._id ? "…" : "Delete"}
            </ActionButton>
          </>
        )}
        {!isCreator && (
          <ActionButton onClick={() => mgLeave(group._id, group.name)} disabled={mgActionLoading === group._id} variant="warning">
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            {mgActionLoading === group._id ? "…" : "Leave"}
          </ActionButton>
        )}
      </div>
    </div>
  );

  const SectionHeader = ({ title, count }) => (
    <div className="flex items-center gap-2 mb-3">
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">{count}</span>
    </div>
  );

  const EmptyState = ({ message }) => (
    <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
      <UserGroupIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
      <h2 className="mb-4 sm:mb-6 text-xl font-bold text-slate-900 tracking-tight">My Study Groups</h2>

      {mgError && (
        <div className="flex items-start gap-2.5 p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
          <XCircleIcon className="w-4 h-4 mt-0.5 shrink-0" />
          {mgError}
        </div>
      )}

      <div className="mb-6">
        <SectionHeader title="Groups I Created" count={mgCreated.length} />
        {mgCreated.length > 0
          ? <div className="space-y-3">{mgCreated.map((g) => <GroupCard key={g._id} group={g} isCreator />)}</div>
          : <EmptyState message="You haven't created any groups yet." />}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="mt-2">
          <SectionHeader title="Groups I Joined" count={mgJoined.length} />
          {mgJoined.length > 0
            ? <div className="space-y-3">{mgJoined.map((g) => <GroupCard key={g._id} group={g} isCreator={false} />)}</div>
            : <EmptyState message="You haven't joined any groups yet." />}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editFormData && (
        <Modal
          title="Edit Study Group"
          onClose={() => setShowEditModal(false)}
          footer={
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button form="edit-group-form" type="submit" disabled={!!mgActionLoading} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">
                {mgActionLoading ? "Updating…" : "Update Group"}
              </button>
            </div>
          }
        >
          <form id="edit-group-form" onSubmit={mgUpdate} className="space-y-3">
            {[
              { label: "Group Name", key: "name", type: "text", required: true },
              { label: "Subject", key: "subject", type: "text", required: true },
            ].map(({ label, key, type, required }) => (
              <div key={key}>
                <label className="block mb-1 text-sm font-medium text-slate-700">{label}{required && " *"}</label>
                <input
                  type={type}
                  value={editFormData[key]}
                  onChange={(e) => setEditFormData((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            ))}

            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData((p) => ({ ...p, description: e.target.value }))}
                rows="2"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">Max Members</label>
              <input
                type="number"
                value={editFormData.maxMembers}
                onChange={(e) => setEditFormData((p) => ({ ...p, maxMembers: e.target.value }))}
                min="2"
                max="50"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-700">Meeting Times *</label>
              <div className="grid grid-cols-2 gap-2">
                {["weekdays", "weekend", "morning", "evening"].map((f) => (
                  <label key={f} className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${editFormData.meetingTime[f] ? "border-blue-300 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <input
                      type="checkbox"
                      checked={editFormData.meetingTime[f]}
                      onChange={() => setEditFormData((p) => ({ ...p, meetingTime: { ...p.meetingTime, [f]: !p.meetingTime[f] } }))}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 capitalize">{f}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className={`flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-colors ${editFormData.isActive ? "border-blue-300 bg-blue-50" : "border-slate-200"}`}>
              <input
                type="checkbox"
                checked={editFormData.isActive}
                onChange={(e) => setEditFormData((p) => ({ ...p, isActive: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">Group is Active</span>
              {editFormData.isActive && <CheckCircleSolid className="w-4 h-4 text-blue-500 ml-auto" />}
            </label>

            {mgError && (
              <div className="flex items-start gap-2 p-2.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                <XCircleIcon className="w-4 h-4 mt-0.5 shrink-0" />
                {mgError}
              </div>
            )}
          </form>
        </Modal>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedGroup && (
        <Modal
          title="Group Details"
          onClose={() => setShowDetailsModal(false)}
          footer={
            <button onClick={() => setShowDetailsModal(false)} className="w-full px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              Close
            </button>
          }
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold text-slate-900">{selectedGroup.name}</h4>
              {selectedGroup.description && <p className="mt-1 text-sm text-slate-500">{selectedGroup.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Subject</p>
                <Badge variant="blue">📚 {selectedGroup.subject}</Badge>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Members</p>
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                  <UserGroupIcon className="w-4 h-4 text-slate-400" />
                  {selectedGroup.members?.length || 0}/{selectedGroup.maxMembers}
                </p>
              </div>
            </div>

            {selectedGroup.creator && (
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Created by</p>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">
                    {selectedGroup.creator.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{selectedGroup.creator.name}</p>
                    <p className="text-xs text-slate-400">{selectedGroup.creator.email}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedGroup.meetingTime && (
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Meeting Times</p>
                <MeetingTimeBadges meetingTime={selectedGroup.meetingTime} />
              </div>
            )}

            {selectedGroup.members?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Members</p>
                <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                  {selectedGroup.members.map((m, i) => (
                    <div key={m._id || i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                          {m.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{m.name}</p>
                          <p className="text-xs text-slate-400">{m.email}</p>
                        </div>
                      </div>
                      {m._id === selectedGroup.creator?._id && (
                        <Badge variant="blue">Creator</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Status</p>
              <div className="ml-auto">
                {selectedGroup.isActive !== false
                  ? <Badge variant="blue"><CheckCircleIcon className="w-3 h-3" /> Active</Badge>
                  : <Badge variant="gray"><XCircleIcon className="w-3 h-3" /> Inactive</Badge>}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyGroupsTab;