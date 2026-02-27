import{ useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAllStudyGroups,
         getStudyGroupById,
         updateStudyGroup,
         deleteStudyGroup,
         leaveStudyGroup,
 } from "../services/studyGroupService";


 const MyGroups = () => {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [myCreatedGroups, setMyCreatedGroups] = useState([]);
    const [myJoinedGroups, setMyJoinedGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [editFormData, setEditFormData] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadMyGroups();
    },[]);

    const loadMyGroups = async () => {
        setLoading(true);
        try {
            const data = await getAllStudyGroups();
            const allGroups = data.studyGroups;

            // user from AuthContext has "id", backend returns "_id"
            const userId = user._id || user.id;

            //Filter groups created by me
            const created = allGroups.filter(
              (group) => group.creator?._id === userId || group.creator?.id === userId
            );

            //Filter groups I joined (but didnt create)
            const joined = allGroups.filter(
                (group) => 
                    group.members?.some((member) => (member._id === userId || member.id === userId)) &&
                    group.creator?._id !== userId && group.creator?.id !== userId
            );

            setMyCreatedGroups(created);
            setMyJoinedGroups(joined);

        } catch (error) {
            setError(error.message|| "Failed to load study groups");
        } finally {
            setLoading(false);
        }

    };

    //view details
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
   
    //Open edit modal
    const handleOpenEdit = (group) => {
        setSelectedGroup(group);
        setEditFormData({
            name: group.name,
            description: group.description || '',
            subject: group.subject,
            maxMembers: group.maxMembers,
            meetingTime: {...group.meetingTime},
            isActive: group.isActive ?? true,

        });
        setShowEditModal(true);

    };

    //Update Group
    const handleUpdateGroup = async (e) => {
        e.preventDefault();


        if(!editFormData.name.trim() || !editFormData.subject.trim()){
            setError('name and subject are required');
            return;
        }

        const {weekdays, weekend, morning, evening} = editFormData.meetingTime;
        if (!weekdays && !weekend && !morning && !evening){
            setError('Please select at least one meeting time');
            return;
        }

       setActionLoading(selectedGroup._id);
       setError('');

       try {
        await updateStudyGroup(selectedGroup._id, editFormData);
        alert('Group updated successfully!');
        setShowEditModal(false);
        loadMyGroups(); //Refresh groups data

       } catch (error) {
         setError(error.message || 'Failed to update group. Please try again.');

       } finally {
        setActionLoading(false);
       }

    };

    //Delete group
    const handleDeleteGroup = async (groupId, groupName) => {
      const confimed = window.confirm(`Are you sure you want to delete the group "${groupName}"? This action cannot be undone.`);
         
      if (!confimed) return;

      setActionLoading(groupId);
      setError('');

       try {
        await deleteStudyGroup(groupId);
        alert('Group deleted successfully!');
        loadMyGroups(); //Refresh groups data
       } catch (error) {
            setError(error.message || 'Failed to delete group. Please try again.');
       } finally {
        setActionLoading(null);
       }

    };


    //Leave Group
    const handleLeaveGroup = async (groupId, groupName) => {
        const confimed = window.confirm(`Are you sure you want to leave the group "${groupName}"?`);
         
        if (!confimed) return;

        setActionLoading(groupId);
        setError('');

        try {
            await leaveStudyGroup(groupId);
            alert('You have left the group successfully!');
            loadMyGroups(); //Refreshing 

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

    if( loading){
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-8 text-gray-500">Loading your groups...</div>
            </div>
        );
    }


    return (

     <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Study Groups</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
            </div>
        )}

        {/* Groups I Created */}
        <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Groups I Created ({myCreatedGroups.length})
            </h3>
            {myCreatedGroups.length > 0 ? (
            <div className="space-y-4">
                {myCreatedGroups.map((group) => (
                <div
                    key={group._id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                    <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{group.name}</h4>
                        {group.description && (
                        <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                        )}
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                            📚 {group.subject}
                        </span>
                        <span>
                            👥 {group.members?.length || 0}/{group.maxMembers} members
                        </span>
                        <span className={`px-2 py-1 rounded ${group.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {group.isActive !== false ? '✓ Active' : '✗ Inactive'}
                        </span>
                        </div>
                        {group.meetingTime && (
                        <div className="mt-2 flex gap-2 text-xs text-gray-500">
                            {group.meetingTime.weekdays && <span>📅 Weekdays</span>}
                            {group.meetingTime.weekend && <span>📅 Weekend</span>}
                            {group.meetingTime.morning && <span>🌅 Morning</span>}
                            {group.meetingTime.evening && <span>🌆 Evening</span>}
                        </div>
                        )}
                    </div>
                    <div className="ml-4 flex gap-2">
                        <button
                        onClick={() => handleViewDetails(group._id)}
                        disabled={actionLoading === group._id}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                        View
                        </button>
                        <button
                        onClick={() => handleOpenEdit(group)}
                        disabled={actionLoading === group._id}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                        Edit
                        </button>
                        <button
                        onClick={() => handleDeleteGroup(group._id, group.name)}
                        disabled={actionLoading === group._id}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                        >
                        {actionLoading === group._id ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            ) : (
            <div className="text-center py-8 text-gray-500">
                You haven't created any groups yet.
            </div>
            )}
        </div>

        {/* Groups I Joined */}
        <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Groups I Joined ({myJoinedGroups.length})
            </h3>
            {myJoinedGroups.length > 0 ? (
            <div className="space-y-4">
                {myJoinedGroups.map((group) => (
                <div
                    key={group._id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                    <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{group.name}</h4>
                        {group.description && (
                        <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                        )}
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                            📚 {group.subject}
                        </span>
                        <span>
                            👥 {group.members?.length || 0}/{group.maxMembers} members
                        </span>
                        {group.creator?.name && (
                            <span className="text-xs">Created by {group.creator.name}</span>
                        )}
                        </div>
                        {group.meetingTime && (
                        <div className="mt-2 flex gap-2 text-xs text-gray-500">
                            {group.meetingTime.weekdays && <span>📅 Weekdays</span>}
                            {group.meetingTime.weekend && <span>📅 Weekend</span>}
                            {group.meetingTime.morning && <span>🌅 Morning</span>}
                            {group.meetingTime.evening && <span>🌆 Evening</span>}
                        </div>
                        )}
                    </div>
                    <div className="ml-4 flex gap-2">
                        <button
                        onClick={() => handleViewDetails(group._id)}
                        disabled={actionLoading === group._id}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                        View
                        </button>
                        <button
                        onClick={() => handleLeaveGroup(group._id, group.name)}
                        disabled={actionLoading === group._id}
                        className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400"
                        >
                        {actionLoading === group._id ? 'Leaving...' : 'Leave'}
                        </button>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            ) : (
            <div className="text-center py-8 text-gray-500">
                You haven't joined any groups yet.
            </div>
            )}
        </div>

        {/* Edit Modal */}
        {showEditModal && editFormData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Edit Study Group</h3>
                <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                </button>
                </div>

                <form onSubmit={handleUpdateGroup} className="space-y-4">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Meeting Time */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Time <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={editFormData.meetingTime.weekdays}
                        onChange={() => handleEditCheckbox('weekdays')}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">Weekdays</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={editFormData.meetingTime.weekend}
                        onChange={() => handleEditCheckbox('weekend')}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">Weekend</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={editFormData.meetingTime.morning}
                        onChange={() => handleEditCheckbox('morning')}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">Morning</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
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
                    <label className="flex items-center space-x-2 cursor-pointer">
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
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition"
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Group Details</h3>
                <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                </button>
                </div>

                <div className="space-y-4">
                <div>
                    <h4 className="text-2xl font-bold text-gray-900">{selectedGroup.name}</h4>
                    {selectedGroup.description && (
                    <p className="text-gray-600 mt-2">{selectedGroup.description}</p>
                    )}
                </div>

                <div>
                    <span className="text-sm font-medium text-gray-700">Subject:</span>
                    <div className="mt-1">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded">
                        📚 {selectedGroup.subject}
                    </span>
                    </div>
                </div>

                <div>
                    <span className="text-sm font-medium text-gray-700">Members:</span>
                    <p className="text-gray-600 mt-1">
                    {selectedGroup.members?.length || 0}/{selectedGroup.maxMembers}
                    </p>
                </div>

                {selectedGroup.creator && (
                    <div>
                    <span className="text-sm font-medium text-gray-700">Created by:</span>
                    <p className="text-gray-600 mt-1">
                        {selectedGroup.creator.name} ({selectedGroup.creator.email})
                    </p>
                    </div>
                )}

                {selectedGroup.meetingTime && (
                    <div>
                    <span className="text-sm font-medium text-gray-700">Meeting Times:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                        {selectedGroup.meetingTime.weekdays && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            📅 Weekdays
                        </span>
                        )}
                        {selectedGroup.meetingTime.weekend && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            📅 Weekend
                        </span>
                        )}
                        {selectedGroup.meetingTime.morning && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            🌅 Morning
                        </span>
                        )}
                        {selectedGroup.meetingTime.evening && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            🌆 Evening
                        </span>
                        )}
                    </div>
                    </div>
                )}

                {selectedGroup.members && selectedGroup.members.length > 0 && (
                    <div>
                    <span className="text-sm font-medium text-gray-700">Member List:</span>
                    <div className="mt-2 space-y-2">
                        {selectedGroup.members.map((member, idx) => (
                        <div
                            key={member._id || idx}
                            className="p-2 bg-gray-50 rounded flex items-center justify-between"
                        >
                            <div>
                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.email}</p>
                            </div>
                            {member._id === selectedGroup.creator?._id && (
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                                Creator
                            </span>
                            )}
                        </div>
                        ))}
                    </div>
                    </div>
                )}

                <div>
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <p className={`mt-1 ${selectedGroup.isActive !== false ? 'text-green-600' : 'text-gray-500'}`}>
                    {selectedGroup.isActive !== false ? '✓ Active' : '✗ Inactive'}
                    </p>
                </div>
                </div>

                <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                Close
                </button>
            </div>
            </div>
        )}
    </div>

    );

 };
 export default MyGroups;