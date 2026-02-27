import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { 
  getAllStudyGroups,
  getStudyGroupById,
  updateStudyGroup,
  deleteStudyGroup,
  leaveStudyGroup,
} from "../services/studyGroupService";

// Icons (you can use any icon library or SVG components)
const Icons = {
  Back: () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Delete: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Leave: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  View: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Members: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Subject: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Active: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Inactive: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Close: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Sort: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>
  ),
};

const MyGroups = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myCreatedGroups, setMyCreatedGroups] = useState([]);
  const [myJoinedGroups, setMyJoinedGroups] = useState([]);
  const [filteredCreatedGroups, setFilteredCreatedGroups] = useState([]);
  const [filteredJoinedGroups, setFilteredJoinedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterSubject, setFilterSubject] = useState('all');
  const [availableSubjects, setAvailableSubjects] = useState([]);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadMyGroups();
  }, []);

  useEffect(() => {
    filterAndSortGroups();
  }, [myCreatedGroups, myJoinedGroups, searchTerm, sortBy, filterSubject]);

  const loadMyGroups = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllStudyGroups();
      const allGroups = data.studyGroups || [];

      // Extract unique subjects for filter
      const subjects = [...new Set(allGroups.map(g => g.subject).filter(Boolean))];
      setAvailableSubjects(subjects);

      const userId = user._id || user.id;

      // Filter groups created by me
      const created = allGroups.filter(
        (group) => group.creator?._id === userId || group.creator?.id === userId
      );

      // Filter groups I joined (but didn't create)
      const joined = allGroups.filter(
        (group) => 
          group.members?.some((member) => (member._id === userId || member.id === userId)) &&
          group.creator?._id !== userId && group.creator?.id !== userId
      );

      setMyCreatedGroups(created);
      setMyJoinedGroups(joined);
    } catch (error) {
      setError(error.message || "Failed to load study groups");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortGroups = () => {
    // Filter created groups
    let filteredCreated = [...myCreatedGroups];
    let filteredJoined = [...myJoinedGroups];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredCreated = filteredCreated.filter(group => 
        group.name.toLowerCase().includes(term) ||
        group.description?.toLowerCase().includes(term) ||
        group.subject.toLowerCase().includes(term)
      );
      filteredJoined = filteredJoined.filter(group => 
        group.name.toLowerCase().includes(term) ||
        group.description?.toLowerCase().includes(term) ||
        group.subject.toLowerCase().includes(term)
      );
    }

    // Apply subject filter
    if (filterSubject !== 'all') {
      filteredCreated = filteredCreated.filter(group => group.subject === filterSubject);
      filteredJoined = filteredJoined.filter(group => group.subject === filterSubject);
    }

    // Apply sorting
    const sortGroups = (groups) => {
      return groups.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'members':
            return (b.members?.length || 0) - (a.members?.length || 0);
          case 'subject':
            return a.subject.localeCompare(b.subject);
          default:
            return 0;
        }
      });
    };

    setFilteredCreatedGroups(sortGroups(filteredCreated));
    setFilteredJoinedGroups(sortGroups(filteredJoined));
  };

  const handleViewDetails = async (groupId) => {
    setActionLoading(groupId);
    try {
      const data = await getStudyGroupById(groupId);
      setSelectedGroup(data.studyGroup || data);
      setShowDetailsModal(true);
    } catch (error) {
      setError(error.message || "Failed to load group details");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenEdit = (group) => {
    setSelectedGroup(group);
    setEditFormData({
      name: group.name,
      description: group.description || '',
      subject: group.subject,
      maxMembers: group.maxMembers,
      meetingTime: { ...group.meetingTime },
      isActive: group.isActive ?? true,
    });
    setShowEditModal(true);
  };

  const handleUpdateGroup = async (e) => {
    e.preventDefault();

    if (!editFormData.name.trim() || !editFormData.subject.trim()) {
      setError('Name and subject are required');
      return;
    }

    const { weekdays, weekend, morning, evening } = editFormData.meetingTime;
    if (!weekdays && !weekend && !morning && !evening) {
      setError('Please select at least one meeting time');
      return;
    }

    setActionLoading(selectedGroup._id);
    setError('');

    try {
      await updateStudyGroup(selectedGroup._id, editFormData);
      setSuccessMessage('Group updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowEditModal(false);
      await loadMyGroups();
    } catch (error) {
      setError(error.message || 'Failed to update group. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!showDeleteConfirm) return;

    setActionLoading(showDeleteConfirm._id);
    setError('');

    try {
      await deleteStudyGroup(showDeleteConfirm._id);
      setSuccessMessage(`Group "${showDeleteConfirm.name}" deleted successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteConfirm(null);
      await loadMyGroups();
    } catch (error) {
      setError(error.message || 'Failed to delete group. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeaveGroup = async () => {
    if (!showLeaveConfirm) return;

    setActionLoading(showLeaveConfirm._id);
    setError('');

    try {
      await leaveStudyGroup(showLeaveConfirm._id);
      setSuccessMessage(`You have left "${showLeaveConfirm.name}" successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowLeaveConfirm(null);
      await loadMyGroups();
    } catch (error) {
      setError(error.message || 'Failed to leave group. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditCheckbox = (field) => {
    setEditFormData((prev) => ({
      ...prev,
      meetingTime: {
        ...prev.meetingTime,
        [field]: !prev.meetingTime[field],
      },
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterSubject('all');
    setSortBy('name');
  };

  const GroupCard = ({ group, type }) => {
    const isCreator = type === 'created';
    const memberCount = group.members?.length || 0;
    const progress = (memberCount / group.maxMembers) * 100;

    return (
      <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
        {/* Status Indicator */}
        <div className={`absolute top-0 left-0 w-1 h-full ${group.isActive !== false ? 'bg-green-500' : 'bg-gray-400'}`} />
        
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {group.name}
              </h3>
              {group.creator?.name && !isCreator && (
                <p className="text-sm text-gray-500 mt-1">
                  Created by {group.creator.name}
                </p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              group.isActive !== false 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {group.isActive !== false ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Description */}
          {group.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {group.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              <Icons.Subject />
              <span className="ml-1">{group.subject}</span>
            </span>
            
            {/* Meeting Times */}
            {group.meetingTime && (
              <>
                {group.meetingTime.weekdays && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    📅 Weekdays
                  </span>
                )}
                {group.meetingTime.weekend && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    📅 Weekend
                  </span>
                )}
                {group.meetingTime.morning && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    🌅 Morning
                  </span>
                )}
                {group.meetingTime.evening && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                    🌆 Evening
                  </span>
                )}
              </>
            )}
          </div>

          {/* Members Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="text-gray-600 flex items-center">
                <Icons.Members />
                <span className="ml-1">Members</span>
              </span>
              <span className="font-medium text-gray-900">
                {memberCount}/{group.maxMembers}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  memberCount === group.maxMembers ? 'bg-red-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => handleViewDetails(group._id)}
              disabled={actionLoading === group._id}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-all duration-200"
            >
              <Icons.View />
              <span className="ml-1">View</span>
            </button>
            
            {isCreator ? (
              <>
                <button
                  onClick={() => handleOpenEdit(group)}
                  disabled={actionLoading === group._id}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all duration-200"
                >
                  <Icons.Edit />
                  <span className="ml-1">Edit</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(group)}
                  disabled={actionLoading === group._id}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
                >
                  <Icons.Delete />
                  <span className="ml-1">Delete</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLeaveConfirm(group)}
                disabled={actionLoading === group._id}
                className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-all duration-200"
              >
                <Icons.Leave />
                <span className="ml-1">Leave</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-500">Loading your groups...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Study Groups</h1>
              <p className="text-gray-500 mt-1">Manage and track your study groups</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              <Icons.Back />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
              <Icons.Close />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center justify-between">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage('')} className="text-green-500 hover:text-green-700">
              <Icons.Close />
            </button>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search groups by name, description, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Icons.Search />
              </div>
            </div>

            {/* Subject Filter */}
            <div>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Subjects</option>
                {availableSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="members">Sort by Members</option>
                <option value="subject">Sort by Subject</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || filterSubject !== 'all' || sortBy !== 'name') && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                    Search: {searchTerm}
                  </span>
                )}
                {filterSubject !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                    Subject: {filterSubject}
                  </span>
                )}
                {sortBy !== 'name' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                    Sort: {sortBy === 'members' ? 'Most Members' : 'Subject'}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Groups I Created */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Groups I Created ({filteredCreatedGroups.length})
            </h2>
            <button
              onClick={() => navigate('/create-group')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200"
            >
              + Create New Group
            </button>
          </div>

          {filteredCreatedGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCreatedGroups.map((group) => (
                <GroupCard key={group._id} group={group} type="created" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.Subject />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No groups created yet</h3>
              <p className="text-gray-500 mb-4">Start by creating your first study group</p>
              <button
                onClick={() => navigate('/create-group')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200"
              >
                Create a Group
              </button>
            </div>
          )}
        </div>

        {/* Groups I Joined */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Groups I Joined ({filteredJoinedGroups.length})
          </h2>

          {filteredJoinedGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJoinedGroups.map((group) => (
                <GroupCard key={group._id} group={group} type="joined" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.Members />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No groups joined yet</h3>
              <p className="text-gray-500">Browse available groups and join one to start studying</p>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && editFormData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Edit Study Group</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icons.Close />
                </button>
              </div>

              <form onSubmit={handleUpdateGroup} className="p-6 space-y-6">
                {/* Group Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter group name"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={editFormData.subject}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Mathematics, Physics"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    placeholder="Describe your study group..."
                  />
                </div>

                {/* Max Members */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Members
                  </label>
                  <input
                    type="number"
                    name="maxMembers"
                    value={editFormData.maxMembers}
                    onChange={handleEditChange}
                    min="2"
                    max="50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Meeting Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Meeting Time <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={editFormData.meetingTime.weekdays}
                        onChange={() => handleEditCheckbox('weekdays')}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Weekdays</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={editFormData.meetingTime.weekend}
                        onChange={() => handleEditCheckbox('weekend')}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Weekend</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={editFormData.meetingTime.morning}
                        onChange={() => handleEditCheckbox('morning')}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Morning</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={editFormData.meetingTime.evening}
                        onChange={() => handleEditCheckbox('evening')}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Evening</span>
                    </label>
                  </div>
                </div>

                {/* Active Status */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={editFormData.isActive}
                      onChange={(e) =>
                        setEditFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                      }
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Group is Active</span>
                  </label>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all duration-200"
                  >
                    {actionLoading ? 'Updating...' : 'Update Group'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Group Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icons.Close />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedGroup.name}</h2>
                  {selectedGroup.description && (
                    <p className="text-gray-600 mt-2">{selectedGroup.description}</p>
                  )}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <span className="text-sm text-gray-500">Subject</span>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{selectedGroup.subject}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <span className="text-sm text-gray-500">Members</span>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {selectedGroup.members?.length || 0}/{selectedGroup.maxMembers}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <span className="text-sm text-gray-500">Status</span>
                    <p className={`text-lg font-semibold mt-1 ${
                      selectedGroup.isActive !== false ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {selectedGroup.isActive !== false ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <span className="text-sm text-gray-500">Created by</span>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {selectedGroup.creator?.name || 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Meeting Times */}
                {selectedGroup.meetingTime && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Meeting Times</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedGroup.meetingTime.weekdays && (
                        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium">
                          📅 Weekdays
                        </span>
                      )}
                      {selectedGroup.meetingTime.weekend && (
                        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium">
                          📅 Weekend
                        </span>
                      )}
                      {selectedGroup.meetingTime.morning && (
                        <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl text-sm font-medium">
                          🌅 Morning
                        </span>
                      )}
                      {selectedGroup.meetingTime.evening && (
                        <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-sm font-medium">
                          🌆 Evening
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Member List */}
                {selectedGroup.members && selectedGroup.members.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Members ({selectedGroup.members.length})</h4>
                    <div className="space-y-3">
                      {selectedGroup.members.map((member, idx) => (
                        <div
                          key={member._id || idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                          {member._id === selectedGroup.creator?._id && (
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                              Creator
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.Delete />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Group</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{showDeleteConfirm.name}"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteGroup}
                    disabled={actionLoading === showDeleteConfirm._id}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
                  >
                    {actionLoading === showDeleteConfirm._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leave Confirmation Modal */}
        {showLeaveConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.Leave />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Leave Group</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to leave "{showLeaveConfirm.name}"?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLeaveConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLeaveGroup}
                    disabled={actionLoading === showLeaveConfirm._id}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-all duration-200"
                  >
                    {actionLoading === showLeaveConfirm._id ? 'Leaving...' : 'Leave'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGroups;