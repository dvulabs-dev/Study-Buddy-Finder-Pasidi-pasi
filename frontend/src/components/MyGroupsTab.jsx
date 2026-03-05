import { EnvelopeIcon, UserGroupIcon, BuildingLibraryIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import StaticTimePickerLandscape from "./StaticTimePickerLandscape";

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
  showEditModal,
  setShowEditModal,
  editFormData,
  setEditFormData,
  mgUpdate,
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [openTimePicker, setOpenTimePicker] = useState({ type: null });
  const [newTimeSlot, setNewTimeSlot] = useState({ day: "", startTime: "", endTime: "" });

  // Reset local edit states when modal opens/closes
  useEffect(() => {
    if (!showEditModal) {
      setImagePreview(null);
      setEditImageFile(null);
      setNewTimeSlot({ day: "", startTime: "", endTime: "" });
    }
  }, [showEditModal]);
  
  // Helper function to convert 24-hour time to 12-hour format with AM/PM
  const formatTime = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${String(hours12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  // Generate floor options based on building
  const getFloorOptions = (building) => {
    if (building === "Main Building") {
      return [3, 4, 5, 6];
    } else if (building === "New Building") {
      return Array.from({ length: 12 }, (_, i) => i + 3); // Floors 3 to 14
    }
    return [];
  };

  // Generate lab options based on building and floor
  const getLabOptions = (building, floor) => {
    if (!building || !floor) return [];
    
    const prefix = building === "Main Building" ? "A" : "F";
    
    return Array.from({ length: 6 }, (_, i) => `${prefix}${floor}0${i + 1}`);
  };

  // Handle building change
  const handleBuildingChange = (value) => {
    setEditFormData((prev) => ({
      ...prev,
      hallAllocation: {
        building: value,
        floor: "",
        lab: "",
      },
    }));
  };

  // Handle floor change
  const handleFloorChange = (value) => {
    setEditFormData((prev) => ({
      ...prev,
      hallAllocation: {
        ...prev.hallAllocation,
        floor: value,
        lab: "",
      },
    }));
  };

  // Handle lab change
  const handleLabChange = (value) => {
    setEditFormData((prev) => ({
      ...prev,
      hallAllocation: {
        ...prev.hallAllocation,
        lab: value,
      },
    }));
  };

  // Handle image file upload for edit modal
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle image URL input for edit modal
  const handleEditImageUrlChange = (e) => {
    const url = e.target.value;
    setEditImageFile(null); // clear any selected file
    setEditFormData((prev) => ({ ...prev, image: url }));
    setImagePreview(url || null);
  };

  const backendUrl = 'http://localhost:5000';

  // Build the preview src: prefer local preview, then existing backend image
  const editImageSrc = imagePreview
    ? imagePreview
    : editFormData?.image
      ? (editFormData.image.startsWith('http') ? editFormData.image : `${backendUrl}${editFormData.image}`)
      : null;

  // Handle form submit: validate, build FormData, call mgUpdate
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editFormData?.name?.trim()) { alert('Group name is required'); return; }
    if (!editFormData?.subject?.trim()) { alert('Subject is required'); return; }
    if (
      !editFormData?.hallAllocation?.building ||
      !editFormData?.hallAllocation?.floor ||
      !editFormData?.hallAllocation?.lab
    ) {
      alert('Please complete hall allocation (building, floor, and lab)');
      return;
    }
    if (!editFormData?.meetingTimes || editFormData.meetingTimes.length === 0) {
      alert('Please add at least one meeting time');
      return;
    }

    const formData = new FormData();
    formData.append('name', editFormData.name.trim());
    formData.append('description', editFormData.description || '');
    formData.append('subject', editFormData.subject.trim());
    formData.append('maxMembers', String(editFormData.maxMembers));
    formData.append('meetingTimes', JSON.stringify(editFormData.meetingTimes));
    formData.append('hallAllocation', JSON.stringify({
      building: editFormData.hallAllocation.building,
      floor: Number(editFormData.hallAllocation.floor),
      lab: editFormData.hallAllocation.lab,
    }));
    if (editImageFile) {
      formData.append('image', editImageFile);
    }

    mgUpdate(formData);
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
              src={group.image.startsWith('/') ? `${backendUrl}${group.image}` : group.image}
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
          <span className="inline-block px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full mb-3">
            {group.subject}
          </span>

          <h4 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
            {group.name}
          </h4>

          {group.description ? (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{group.description}</p>
          ) : (
            <p className="text-sm text-gray-400 italic mb-3">No description provided</p>
          )}

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

          {group.hallAllocation && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <BuildingLibraryIcon className="w-3.5 h-3.5" />
                Hall Allocation
              </div>
              <div className="text-xs text-gray-600">
                <span className="inline-block px-2.5 py-1 bg-purple-50 border border-purple-100 rounded-full">
                  {group.hallAllocation.building} • Floor {group.hallAllocation.floor} • {group.hallAllocation.lab}
                </span>
              </div>
            </div>
          )}

          {!isCreator && group.creator?.name && (
            <p className="text-xs text-gray-500 mt-3">
              Created by <span className="font-medium text-gray-700">{group.creator.name}</span>
            </p>
          )}

          <div className="border-t border-gray-100 pt-4 mt-4">
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

      {/* Edit Modal */}
      {showEditModal && editFormData && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-group-title"
        >
          <div className="min-h-full flex items-start sm:items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                <h3 id="edit-group-title" className="text-xl font-bold text-gray-900">Edit Study Group</h3>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={Boolean(mgActionLoading)}
                  className="text-2xl text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <form id="edit-group-form" onSubmit={handleEditSubmit} className="p-6 overflow-y-auto flex-1 min-h-0">
                {/* ── Basic Info ── */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-indigo-700 uppercase tracking-wide mb-3 pb-1 border-b border-indigo-100">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5 text-sm font-semibold text-gray-700">Group Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData((p) => ({ ...p, name: e.target.value }))}
                        placeholder="e.g., Advanced Calculus Study Group"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5 text-sm font-semibold text-gray-700">Subject <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={editFormData.subject}
                        onChange={(e) => setEditFormData((p) => ({ ...p, subject: e.target.value }))}
                        placeholder="e.g., Mathematics, Physics"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5 text-sm font-semibold text-gray-700">Max Members</label>
                      <input
                        type="number"
                        value={editFormData.maxMembers}
                        onChange={(e) => setEditFormData((p) => ({ ...p, maxMembers: e.target.value }))}
                        min="2"
                        max="50"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-gray-500">Between 2 and 50 members</p>
                    </div>
                    <div>
                      <label className="block mb-1.5 text-sm font-semibold text-gray-700">Description</label>
                      <textarea
                        value={editFormData.description}
                        onChange={(e) => setEditFormData((p) => ({ ...p, description: e.target.value }))}
                        rows="3"
                        placeholder="Brief description of your study group…"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Hall Allocation ── */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-indigo-700 uppercase tracking-wide mb-3 pb-1 border-b border-indigo-100">
                    Hall Allocation <span className="text-red-500">*</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Building */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Building</label>
                      <select
                        value={editFormData.hallAllocation?.building || ""}
                        onChange={(e) => handleBuildingChange(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select Building</option>
                        <option value="Main Building">Main Building</option>
                        <option value="New Building">New Building</option>
                      </select>
                    </div>

                    {/* Floor */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Floor</label>
                      <select
                        value={editFormData.hallAllocation?.building ? String(editFormData.hallAllocation?.floor ?? "") : ""}
                        onChange={(e) => handleFloorChange(e.target.value)}
                        disabled={!editFormData.hallAllocation?.building}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">Select Floor</option>
                        {getFloorOptions(editFormData.hallAllocation?.building).map((floor) => (
                          <option key={floor} value={String(floor)}>Floor {floor}</option>
                        ))}
                      </select>
                    </div>

                    {/* Lab */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Lab</label>
                      <select
                        value={editFormData.hallAllocation?.floor ? (editFormData.hallAllocation?.lab || "") : ""}
                        onChange={(e) => handleLabChange(e.target.value)}
                        disabled={!editFormData.hallAllocation?.building || !editFormData.hallAllocation?.floor}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">Select Lab</option>
                        {getLabOptions(editFormData.hallAllocation?.building, editFormData.hallAllocation?.floor).map((lab) => (
                          <option key={lab} value={lab}>{lab}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {editFormData.hallAllocation?.building && editFormData.hallAllocation?.floor && editFormData.hallAllocation?.lab && (
                    <p className="mt-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                      Current: {editFormData.hallAllocation.building} — Floor {editFormData.hallAllocation.floor} — Lab {editFormData.hallAllocation.lab}
                    </p>
                  )}
                </div>

                {/* ── Group Image ── */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-indigo-700 uppercase tracking-wide mb-3 pb-1 border-b border-indigo-100">Group Image (Optional)</h4>

                  {editImageSrc && (
                    <div className="mb-3">
                      <img
                        src={editImageSrc}
                        alt="Group preview"
                        className="w-full h-40 object-cover rounded-xl border-2 border-gray-200"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Upload File</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Or Image URL</label>
                      <input
                        type="url"
                        value={editFormData.image?.startsWith('/') ? '' : (editFormData.image || "")}
                        onChange={handleEditImageUrlChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">Upload a new file or enter a URL to replace the current image. Leave both empty to keep the existing image.</p>
                </div>

                {/* ── Meeting Schedule ── */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-indigo-700 uppercase tracking-wide mb-3 pb-1 border-b border-indigo-100">Meeting Schedule <span className="text-red-500">*</span></h4>

                  {/* Existing slots */}
                  <div className="space-y-2 mb-3">
                    {editFormData.meetingTimes && editFormData.meetingTimes.length > 0 ? (
                      editFormData.meetingTimes.map((slot, idx) => (
                        <div key={idx} className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between gap-2">
                          <div className="text-sm text-gray-700">
                            <span className="font-semibold text-indigo-700">{slot.day}</span>
                            <span className="ml-2 text-gray-600">{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditFormData((p) => ({
                              ...p,
                              meetingTimes: p.meetingTimes.filter((_, i) => i !== idx)
                            }))}
                            className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-gray-500 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                        No meeting times added yet — use the form below to add slots
                      </div>
                    )}
                  </div>

                  {/* Add new slot */}
                  <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Add a time slot</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Day</label>
                        <select
                          value={newTimeSlot.day}
                          onChange={(e) => setNewTimeSlot((prev) => ({ ...prev, day: e.target.value }))}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="">Select day</option>
                          {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((day) => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Start Time</label>
                        <button
                          type="button"
                          onClick={() => setOpenTimePicker({ type: 'start' })}
                          className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-indigo-400 text-left bg-white"
                        >
                          {newTimeSlot.startTime || "Select Start Time"}
                        </button>
                        {openTimePicker.type === 'start' && (
                          <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-lg shadow-2xl relative max-w-[600px] w-full">
                              <button type="button" onClick={() => setOpenTimePicker({ type: null })} className="absolute top-2 right-2 z-10 text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md">×</button>
                              <StaticTimePickerLandscape value={newTimeSlot.startTime || "09:00"} onChange={(t) => { setNewTimeSlot((p) => ({ ...p, startTime: t })); setOpenTimePicker({ type: null }); }} label="Select Start Time" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">End Time</label>
                        <button
                          type="button"
                          onClick={() => setOpenTimePicker({ type: 'end' })}
                          className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-indigo-400 text-left bg-white"
                        >
                          {newTimeSlot.endTime || "Select End Time"}
                        </button>
                        {openTimePicker.type === 'end' && (
                          <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-lg shadow-2xl relative max-w-[600px] w-full">
                              <button type="button" onClick={() => setOpenTimePicker({ type: null })} className="absolute top-2 right-2 z-10 text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md">×</button>
                              <StaticTimePickerLandscape value={newTimeSlot.endTime || "11:00"} onChange={(t) => { setNewTimeSlot((p) => ({ ...p, endTime: t })); setOpenTimePicker({ type: null }); }} label="Select End Time" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (newTimeSlot.day && newTimeSlot.startTime && newTimeSlot.endTime) {
                          setEditFormData((p) => ({
                            ...p,
                            meetingTimes: [...(p.meetingTimes || []), { day: newTimeSlot.day, startTime: newTimeSlot.startTime, endTime: newTimeSlot.endTime }]
                          }));
                          setNewTimeSlot({ day: "", startTime: "", endTime: "" });
                        }
                      }}
                      disabled={!newTimeSlot.day || !newTimeSlot.startTime || !newTimeSlot.endTime}
                      className="w-full px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      + Add Time Slot
                    </button>
                  </div>
                </div>

                {mgError && (
                  <div className="mt-2 p-3 text-sm text-red-700 border border-red-200 rounded-xl bg-red-50">
                    {mgError}
                  </div>
                )}
              </form>

              {/* ── Sticky footer actions ── */}
              <div className="px-6 py-4 border-t border-gray-200 shrink-0 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={Boolean(mgActionLoading)}
                  className="flex-1 px-4 py-2.5 text-gray-700 transition border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-group-form"
                  disabled={Boolean(mgActionLoading)}
                  className="flex-1 px-4 py-2.5 text-white transition bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {mgActionLoading ? "Updating…" : "Update Group"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

                  {selectedGroup.hallAllocation && (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl">
                      <div className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
                        <BuildingLibraryIcon className="w-4 h-4" />
                        Hall Allocation
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-purple-700">Building</span>
                          <span className="font-bold text-purple-900">{selectedGroup.hallAllocation.building}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-purple-700">Floor</span>
                          <span className="font-semibold text-purple-900">Floor {selectedGroup.hallAllocation.floor}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-purple-700">Lab</span>
                          <span className="px-3 py-1 bg-purple-600 text-white rounded-lg font-bold text-sm">
                            {selectedGroup.hallAllocation.lab}
                          </span>
                        </div>
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
