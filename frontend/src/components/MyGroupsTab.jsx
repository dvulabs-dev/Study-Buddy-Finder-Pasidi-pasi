import { EnvelopeIcon, UserGroupIcon, BuildingLibraryIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

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
  const [imagePreview, setImagePreview] = useState(null);
  
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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image URL input for edit modal
  const handleEditImageUrlChange = (e) => {
    const url = e.target.value;
    setEditFormData((prev) => ({
      ...prev,
      image: url,
    }));
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
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

    return (
      <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm transition hover:shadow-md hover:border-indigo-200">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h4 className="text-lg font-bold text-gray-900 leading-snug break-words">{group.name}</h4>
            {group.description ? (
              <p className="mt-1 text-sm text-gray-600">{group.description}</p>
            ) : (
              <p className="mt-1 text-sm text-gray-400">No description provided.</p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-gray-600">
              <span className="px-2.5 py-1 text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full font-medium">
                {group.subject}
              </span>
              <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full">
                {memberCount}/{group.maxMembers} members
              </span>
              {!isCreator && group.creator?.name && (
                <span className="text-xs text-gray-500">Created by {group.creator.name}</span>
              )}

            </div>

          </div>

          {!isCreator && (
            <span className="shrink-0 px-3 py-1.5 text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full">
              Joined
            </span>
          )}
        </div>

        {group.meetingTimes && group.meetingTimes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs font-semibold text-gray-700 mb-2">Meeting Schedule</div>
            <div className="space-y-1">
              {group.meetingTimes.map((slot, idx) => (
                <div key={idx} className="text-xs text-gray-600">
                  <span className="inline-block px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
                    {slot.day} {formatTime(slot.startTime)}-{formatTime(slot.endTime)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

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

        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div className="text-xs text-gray-500">
            {!group.meetingTimes || group.meetingTimes.length === 0 ? "No availability set" : ""}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => mgViewDetails(group._id)}
              disabled={mgActionLoading === group._id}
              className="px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mgActionLoading === group._id ? "Loading..." : "View"}
            </button>

            {isCreator ? (
              <>
                <button
                  type="button"
                  onClick={() => openInviteModal(group._id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700"
                >
                  <EnvelopeIcon className="w-4 h-4" />
                  Invite
                </button>
                <button
                  type="button"
                  onClick={() => mgOpenEdit(group)}
                  disabled={mgActionLoading === group._id}
                  className="px-3.5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => mgDelete(group._id, group.name)}
                  disabled={mgActionLoading === group._id}
                  className="px-3.5 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {mgActionLoading === group._id ? "..." : "Delete"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => mgLeave(group._id, group.name)}
                disabled={mgActionLoading === group._id}
                className="px-3.5 py-2 text-sm font-semibold text-white bg-orange-600 rounded-xl hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {mgActionLoading === group._id ? "..." : "Leave"}
              </button>
            )}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

              <form onSubmit={mgUpdate} className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Group Name *</label>
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData((p) => ({ ...p, name: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Subject *</label>
                      <input
                        type="text"
                        value={editFormData.subject}
                        onChange={(e) => setEditFormData((p) => ({ ...p, subject: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
                      <textarea
                        value={editFormData.description}
                        onChange={(e) => setEditFormData((p) => ({ ...p, description: e.target.value }))}
                        rows="4"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Max Members</label>
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

                    {/* Hall Allocation Section */}
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Hall Allocation <span className="text-red-500">*</span>
                      </label>
                      
                      <div className="space-y-3">
                        {/* Building Selection */}
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Building</label>
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

                        {/* Floor Selection */}
                        {editFormData.hallAllocation?.building && (
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Floor</label>
                            <select
                              value={editFormData.hallAllocation?.floor || ""}
                              onChange={(e) => handleFloorChange(e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                              <option value="">Select Floor</option>
                              {getFloorOptions(editFormData.hallAllocation.building).map((floor) => (
                                <option key={floor} value={floor}>
                                  Floor {floor}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Lab Selection */}
                        {editFormData.hallAllocation?.building && editFormData.hallAllocation?.floor && (
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Lab</label>
                            <select
                              value={editFormData.hallAllocation?.lab || ""}
                              onChange={(e) => handleLabChange(e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                              <option value="">Select Lab</option>
                              {getLabOptions(editFormData.hallAllocation.building, editFormData.hallAllocation.floor).map((lab) => (
                                <option key={lab} value={lab}>
                                  {lab}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Group Image */}
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Group Image (Optional)</label>
                      
                      {/* Image Preview */}
                      {(imagePreview || editFormData.image) && (
                        <div className="mb-3">
                          <img
                            src={imagePreview || editFormData.image}
                            alt="Group preview"
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                        </div>
                      )}
                      
                      {/* File Upload */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      
                      {/* Or URL Input */}
                      <div className="mt-2">
                        <label className="block text-xs text-gray-600 mb-1">Or enter image URL</label>
                        <input
                          type="url"
                          value={editFormData.image || ""}
                          onChange={handleEditImageUrlChange}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                      </div>
                      
                      <p className="mt-1 text-xs text-gray-500">
                        Upload a new image or provide a URL. Leave empty to keep current image.
                      </p>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Meeting Schedule</label>
                      
                      <div className="space-y-3 mb-3 max-h-64 overflow-y-auto">
                        {editFormData.meetingTimes && editFormData.meetingTimes.length > 0 ? (
                          editFormData.meetingTimes.map((slot, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between gap-2">
                              <div className="text-sm text-gray-700 flex-1">
                                <span className="font-semibold">{slot.day}</span> {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                              </div>
                              <button
                                type="button"
                                onClick={() => setEditFormData((p) => ({
                                  ...p,
                                  meetingTimes: p.meetingTimes.filter((_, i) => i !== idx)
                                }))}
                                className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                              >
                                Remove
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-xs text-gray-500 text-center bg-gray-50 border border-gray-200 rounded-lg">
                            No meeting times added yet
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-2">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">Day</label>
                          <select
                            id="daySelect"
                            defaultValue=""
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="">Select a day</option>
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">Start</label>
                            <input
                              type="time"
                              id="startTimeInput"
                              defaultValue=""
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-medium text-gray-700 hover:border-indigo-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">End</label>
                            <input
                              type="time"
                              id="endTimeInput"
                              defaultValue=""
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-medium text-gray-700 hover:border-indigo-400"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const day = document.getElementById("daySelect").value;
                            const startTime = document.getElementById("startTimeInput").value;
                            const endTime = document.getElementById("endTimeInput").value;
                            
                            if (day && startTime && endTime) {
                              setEditFormData((p) => ({
                                ...p,
                                meetingTimes: [...(p.meetingTimes || []), { day, startTime, endTime }]
                              }));
                              document.getElementById("daySelect").value = "";
                              document.getElementById("startTimeInput").value = "";
                              document.getElementById("endTimeInput").value = "";
                            }
                          }}
                          className="w-full px-3 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                        >
                          + Add Time Slot
                        </button>
                      </div>
                    </div>


                  </div>
                </div>

                {mgError && (
                  <div className="mt-4 p-3 text-sm text-red-700 border border-red-200 rounded-xl bg-red-50">
                    {mgError}
                  </div>
                )}

                <div className="flex gap-3 pt-6">
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
                    disabled={Boolean(mgActionLoading)}
                    className="flex-1 px-4 py-2.5 text-white transition bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {mgActionLoading ? "Updating..." : "Update Group"}
                  </button>
                </div>
              </form>
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
