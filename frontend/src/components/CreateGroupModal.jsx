import { useState } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { createStudyGroup } from "../services/studyGroupService";
import {
  XMarkIcon,
  PhotoIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  InformationCircleIcon,
  CalendarIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

const INITIAL_FORM_DATA = {
  name: "",
  description: "",
  subject: "",
  maxMembers: 10,
  meetingTimes: [
    {
      startTime: "10:00",
      endTime: "12:00",
      day: "Monday",
    },
  ],
};

const CreateGroupModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [meetingTimeSlots, setMeetingTimeSlots] = useState(
    INITIAL_FORM_DATA.meetingTimes
  );
  const [imageData, setImageData] = useState({ file: null, preview: null });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [activeTimeSlot, setActiveTimeSlot] = useState(null); // For highlighting active time picker

  // Don't render if modal is closed
  if (!isOpen) {
    return null;
  }

  const validate = (data) => {
    const nextErrors = {};

    if (!data.name.trim()) {
      nextErrors.name = "Please provide a group name";
    }

    if (!data.subject.trim()) {
      nextErrors.subject = "Please provide a subject";
    }

    const max = Number(data.maxMembers);
    if (!Number.isFinite(max) || max < 2 || max > 50) {
      nextErrors.maxMembers = "Maximum members must be between 2 and 50";
    }

    if (!meetingTimeSlots || meetingTimeSlots.length === 0) {
      nextErrors.meetingTimes = "Please add at least one meeting time";
    } else {
      // Validate each time slot
      for (const slot of meetingTimeSlots) {
        if (!slot.startTime || !slot.endTime || !slot.day) {
          nextErrors.meetingTimes = "Each meeting time must have day, start time, and end time";
          break;
        }

        const [startHour, startMin] = slot.startTime.split(":").map(Number);
        const [endHour, endMin] = slot.endTime.split(":").map(Number);
        const startTotalMin = startHour * 60 + startMin;
        const endTotalMin = endHour * 60 + endMin;

        if (startTotalMin >= endTotalMin) {
          nextErrors.meetingTimes = "Start time must be before end time";
          break;
        }

        if (endTotalMin - startTotalMin < 30) {
          nextErrors.meetingTimes = "Meeting must be at least 30 minutes long";
          break;
        }
      }
    }

    return nextErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxMembers" ? (value === "" ? "" : Number(value)) : value,
    }));

    setFormError("");
    setErrors((prev) => {
      if (!prev?.[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageData({ file, preview: e.target.result });
        setErrors(prev => ({ ...prev, image: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageData({ file: null, preview: null });
    setErrors(prev => ({ ...prev, image: null }));
  };

  const handleTimeSlotChange = (index, field, value) => {
    const updated = [...meetingTimeSlots];
    updated[index][field] = value;
    setMeetingTimeSlots(updated);

    setFormError("");
    setErrors((prev) => {
      if (!prev?.meetingTimes) return prev;
      const next = { ...prev };
      delete next.meetingTimes;
      return next;
    });
  };

  const handleAddTimeSlot = () => {
    setMeetingTimeSlots([
      ...meetingTimeSlots,
      {
        startTime: "10:00",
        endTime: "12:00",
        day: "Monday",
      },
    ]);
  };

  const handleRemoveTimeSlot = (index) => {
    if (meetingTimeSlots.length > 1) {
      setMeetingTimeSlots(
        meetingTimeSlots.filter((_, i) => i !== index)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate(formData);
    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      // Create FormData for file upload
      const formDataWithFile = new FormData();
      formDataWithFile.append('name', formData.name);
      formDataWithFile.append('description', formData.description);
      formDataWithFile.append('subject', formData.subject);
      formDataWithFile.append('maxMembers', formData.maxMembers.toString());
      formDataWithFile.append('meetingTimes', JSON.stringify(meetingTimeSlots));
      
      if (imageData.file) {
        formDataWithFile.append('image', imageData.file);
      }

      await createStudyGroup(formDataWithFile);
      
      setFormData(INITIAL_FORM_DATA);
      setMeetingTimeSlots(INITIAL_FORM_DATA.meetingTimes);
      setImageData({ file: null, preview: null });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating study group:", error);
      let errorMessage = "Failed to create study group. Please try again.";

      if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.message && typeof error.message === "string") {
        errorMessage = error.message;
      } else if (
        error?.response?.data?.message &&
        typeof error.response.data.message === "string"
      ) {
        errorMessage = error.response.data.message;
      }

      setFormError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA);
    setMeetingTimeSlots(INITIAL_FORM_DATA.meetingTimes);
    setImageData({ file: null, preview: null });
    setErrors({});
    setFormError("");
    onClose();
  };

  const inputBase =
    "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200";

  const days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  // Helper function to format time for display
  const formatTimeForDisplay = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Helper function to get time of day icon
  const getTimeOfDayIcon = (time) => {
    if (!time) return <ClockIcon className="w-3 h-3" />;
    const hour = parseInt(time.split(":")[0]);
    if (hour < 12) return <SunIcon className="w-3 h-3 text-yellow-500" />;
    if (hour < 17) return <SunIcon className="w-3 h-3 text-orange-500" />;
    return <MoonIcon className="w-3 h-3 text-indigo-500" />;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto flex items-start sm:items-center justify-center transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-group-title"
      onClick={(e) => e.target === e.currentTarget && !loading && handleClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-100 animate-in fade-in slide-in-from-bottom-4">
        {/* Header with gradient and image */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
              alt=""
              className="object-cover w-full h-full"
            />
          </div>
          <div className="relative px-6 py-4 flex justify-between items-center">
            <div>
              <h3
                id="create-group-title"
                className="text-xl font-bold text-white flex items-center gap-2"
              >
                <UserGroupIcon className="w-6 h-6" />
                Create New Study Group
              </h3>
              <p className="text-sm text-indigo-100 mt-1">
                Start your learning journey by creating a study group
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="text-white/80 hover:text-white bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          {/* Two-column layout for better space utilization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN - Basic Info */}
            <div className="space-y-6">
              {/* Group Image */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <span className="flex items-center gap-2">
                    <PhotoIcon className="w-4 h-4 text-gray-500" />
                    Group Image <span className="text-gray-400 text-xs">(Optional)</span>
                  </span>
                </label>
                
                {imageData.preview ? (
                  <div className="space-y-3">
                    <div className="relative group">
                      <img
                        src={imageData.preview}
                        alt="Group preview"
                        className="w-full h-40 object-cover rounded-lg border border-gray-300 shadow-sm"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          disabled={loading}
                          className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transform hover:scale-110 transition-all duration-200 disabled:opacity-50"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => document.getElementById('create-group-image-upload').click()}
                      disabled={loading}
                      className="w-full text-sm bg-indigo-100 text-indigo-700 py-2 rounded-lg hover:bg-indigo-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => !loading && document.getElementById('create-group-image-upload').click()}
                    className="relative cursor-pointer group"
                  >
                    <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg bg-white hover:bg-gray-50 transition-all duration-200 group-hover:border-indigo-400 group-hover:bg-indigo-50">
                      <div className="flex flex-col items-center justify-center p-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-indigo-200 transition-all duration-200">
                          <PhotoIcon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <p className="text-xs text-gray-600 text-center">
                          <span className="font-semibold text-indigo-600">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                  className="hidden"
                  id="create-group-image-upload"
                />
                
                {errors?.image && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <XMarkIcon className="w-3 h-3" />
                    {errors.image}
                  </p>
                )}
              </div>

              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <UserGroupIcon className="w-4 h-4 text-gray-500" />
                    Group Name <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g., Advanced Calculus Study Group"
                  aria-invalid={Boolean(errors?.name)}
                  aria-describedby={errors?.name ? "group-name-error" : undefined}
                  className={`${inputBase} ${
                    errors?.name ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                  }`}
                />
                {errors?.name && (
                  <p id="group-name-error" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <XMarkIcon className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <AcademicCapIcon className="w-4 h-4 text-gray-500" />
                    Subject <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g., Mathematics, Physics, Computer Science"
                  aria-invalid={Boolean(errors?.subject)}
                  aria-describedby={errors?.subject ? "subject-error" : undefined}
                  className={`${inputBase} ${
                    errors?.subject ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                  }`}
                />
                {errors?.subject && (
                  <p id="subject-error" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <XMarkIcon className="w-3 h-3" />
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Max Members */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Members
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="maxMembers"
                    value={formData.maxMembers}
                    onChange={handleChange}
                    disabled={loading}
                    min="2"
                    max="50"
                    aria-invalid={Boolean(errors?.maxMembers)}
                    aria-describedby={
                      errors?.maxMembers
                        ? "max-members-error"
                        : "max-members-hint"
                    }
                    className={`${inputBase} pl-10 ${
                      errors?.maxMembers ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                    }`}
                  />
                  <UserGroupIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>
                {errors?.maxMembers ? (
                  <p id="max-members-error" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <XMarkIcon className="w-3 h-3" />
                    {errors.maxMembers}
                  </p>
                ) : (
                  <p id="max-members-hint" className="text-xs text-gray-400 mt-1">
                    Between 2 and 50 members
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN - Description & Meeting Times */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Brief description of your study group's focus, goals, and expectations..."
                  rows="5"
                  className={`${inputBase} resize-none border-gray-300`}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {formData.description.length}/500
                </p>
              </div>

              {/* Meeting Times Section */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-indigo-900">Meeting Schedule</h4>
                    <p className="text-xs text-indigo-700 mt-1">
                      Set up regular meeting times for your study group
                    </p>
                  </div>
                </div>
              </div>

              {/* Meeting Time Slots - Enhanced Clock Design */}
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {meetingTimeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`bg-white p-4 rounded-xl border-2 transition-all duration-200 shadow-sm ${
                      activeTimeSlot === index 
                        ? "border-indigo-400 shadow-lg shadow-indigo-100" 
                        : "border-gray-200 hover:border-indigo-200"
                    }`}
                    onClick={() => setActiveTimeSlot(index)}
                  >
                    {/* Time Slot Header */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${
                          activeTimeSlot === index
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          <ClockIcon className="w-3 h-3" />
                          Slot #{index + 1}
                        </span>
                        {/* Quick time preview */}
                        {slot.startTime && slot.endTime && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            {getTimeOfDayIcon(slot.startTime)}
                            {formatTimeForDisplay(slot.startTime)} - {formatTimeForDisplay(slot.endTime)}
                          </span>
                        )}
                      </div>
                      {meetingTimeSlots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTimeSlot(index)}
                          disabled={loading}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-all duration-200 disabled:opacity-50"
                          title="Remove time slot"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Day Selection with visual improvement */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-500 mb-2">
                        Day of Week
                      </label>
                      <div className="relative">
                        <select
                          value={slot.day}
                          onChange={(e) =>
                            handleTimeSlotChange(index, "day", e.target.value)
                          }
                          disabled={loading}
                          className={`${inputBase} appearance-none border-gray-300 pr-10 ${
                            activeTimeSlot === index ? "border-indigo-300 bg-indigo-50/30" : ""
                          }`}
                        >
                          {days.map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Enhanced Time Pickers with visual feedback */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="time-picker-container">
                        <label className="block text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                          <SunIcon className="w-3 h-3 text-yellow-500" />
                          Start Time
                        </label>
                        <div className={`time-picker-wrapper ${activeTimeSlot === index ? "active" : ""}`}>
                          <TimePicker
                            value={slot.startTime}
                            onChange={(value) =>
                              handleTimeSlotChange(index, "startTime", value)
                            }
                            format="hh:mm a"
                            className="w-full custom-time-picker"
                            clockClassName="custom-clock"
                            disableClock={false}
                            clearIcon={null}
                          />
                        </div>
                      </div>

                      <div className="time-picker-container">
                        <label className="block text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                          <MoonIcon className="w-3 h-3 text-indigo-500" />
                          End Time
                        </label>
                        <div className={`time-picker-wrapper ${activeTimeSlot === index ? "active" : ""}`}>
                          <TimePicker
                            value={slot.endTime}
                            onChange={(value) =>
                              handleTimeSlotChange(index, "endTime", value)
                            }
                            format="hh:mm a"
                            className="w-full custom-time-picker"
                            clockClassName="custom-clock"
                            disableClock={false}
                            clearIcon={null}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Duration indicator with progress bar */}
                    {slot.startTime && slot.endTime && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500 flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            Duration
                          </span>
                          <span className="font-medium text-indigo-600">
                            {(() => {
                              const [startHour, startMin] = slot.startTime.split(":").map(Number);
                              const [endHour, endMin] = slot.endTime.split(":").map(Number);
                              const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
                              const hours = Math.floor(duration / 60);
                              const minutes = duration % 60;
                              return `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm' : ''}`;
                            })()}
                          </span>
                        </div>
                        {/* Duration progress bar */}
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
                            style={{ 
                              width: `${Math.min(((() => {
                                const [startHour, startMin] = slot.startTime.split(":").map(Number);
                                const [endHour, endMin] = slot.endTime.split(":").map(Number);
                                const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
                                return (duration / 180) * 100; // 3 hours max for progress bar
                              })()), 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Time Slot Button */}
              <button
                type="button"
                onClick={handleAddTimeSlot}
                disabled={loading}
                className="w-full text-sm bg-indigo-50 text-indigo-700 py-3 rounded-xl hover:bg-indigo-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 border-2 border-dashed border-indigo-200 hover:border-indigo-300"
              >
                <PlusIcon className="w-4 h-4" />
                Add Another Time Slot
              </button>

              {errors?.meetingTimes && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <XMarkIcon className="w-3 h-3" />
                  {errors.meetingTimes}
                </p>
              )}
            </div>
          </div>

          {/* Form Error */}
          {formError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
              <InformationCircleIcon className="w-5 h-5 flex-shrink-0" />
              {formError}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4" />
                  Create Group
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Custom styles for enhanced TimePicker */}
      <style jsx>{`
        .custom-clock {
          border-radius: 0.75rem !important;
          border: none !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
          padding: 0.75rem !important;
          background: white !important;
        }
        
        .react-time-picker {
          width: 100% !important;
        }
        
        .time-picker-wrapper {
          transition: all 0.2s ease;
        }
        
        .time-picker-wrapper.active .react-time-picker__wrapper {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2) !important;
          background-color: #f5f3ff !important;
        }
        
        .react-time-picker__wrapper {
          border: 1px solid #e5e7eb !important;
          border-radius: 0.75rem !important;
          padding: 0.5rem 0.75rem !important;
          background-color: white !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }
        
        .react-time-picker__wrapper:hover {
          border-color: #818cf8 !important;
          box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.1) !important;
        }
        
        .react-time-picker__wrapper:focus-within {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2) !important;
        }
        
        .react-time-picker__inputGroup {
          font-size: 0.875rem !important;
          color: #1f2937 !important;
        }
        
        .react-time-picker__inputGroup__input {
          color: #1f2937 !important;
          font-weight: 500 !important;
        }
        
        .react-time-picker__inputGroup__leadingZero {
          color: #9ca3af !important;
        }
        
        .react-time-picker__clock {
          border-radius: 0.75rem !important;
          border: none !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
        }
        
        .react-clock__face {
          border: 1px solid #e5e7eb !important;
        }
        
        .react-clock__hour-hand__body,
        .react-clock__minute-hand__body,
        .react-clock__second-hand__body {
          background-color: #4f46e5 !important;
        }
        
        .react-clock__mark__number {
          color: #4b5563 !important;
          font-size: 0.75rem !important;
        }
        
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #818cf8;
        }
      `}</style>
    </div>
  );
};

export default CreateGroupModal;