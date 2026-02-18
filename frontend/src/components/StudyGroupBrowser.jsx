import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllStudyGroups,
    searchStudyGroupsBySubject,
    searchStudyGroupsByAvailability,
    joinStudyGroup
} from '../services/studyGroupService';
import CreateGroupModal from "./CreateGroupModal";


const StudyGroupBrowser = () => {
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState("all"); //all , subject, adcavanced
    const [subject, setSubject] = useState('');
    const [meetingTime, setMeetingTime] = useState({
        weekdays: false,
        weekend: false,
        morning: false,
        evening: false,
    });

    //Stores array of study groups from API
     const [groups, setGroups] = useState([]);

     const [loading, setLoading] = useState(false);
     const [error, setError] = useState('');

     //control modal visibility
     const [showCreateModal, setShowCreateModal] = useState(false);

     //Tracks which group is beign joing 
     const [joinLoading, setJoinLoading] = useState(null);

     //Show all groups when pages open
     useEffect(() => {
        loadAllGroups();
     }, []);


     const loadAllGroups = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getAllStudyGroups();
            setGroups(data.studyGroups);
        } catch (error) {
            setError(error.message || "Failed to load study groups");
        } finally {
            setLoading(false);
        }
     };

     //Search by subject only
     const handleSubjectSearch = async (e) => {
        e.preventDefault();
        if(!subject.trim()){
            setError("Please enter a subject to search");
            return;
        }

        setLoading(true);
        setError('');
        try {
            const data =  await searchStudyGroupsBySubject(subject);
            setGroups(data.studyGroups);
        } catch (error) {
            setError(error.message || "Failed to search study groups");
        } finally {
            setLoading(false);
        }
     };

     //Advanced with meeting time
     const handleAdvancedSearch = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            const data = await searchStudyGroupsByAvailability({
                subject: subject || undefined,
                meetingTime,
            });
            setGroups(data.studyGroups);
        } catch (error) {
            setError(error.message || "Failed to search study groups");
        } finally {
            setLoading(false);
        }

     };

     //Join a study group
     const handleJoinGroup = async (groupId) => {
        setJoinLoading(groupId);
        setError('');
        try {
            await joinStudyGroup(groupId);
            alert("Successfully joined the study group!");
            
            //Refresh for updated member count showing
            if(searchType === "all"){
                loadAllGroups();

            } else if (searchType === "subject"){
                handleSubjectSearch({ preventDefault: () => {} });
            } else {
                handleAdvancedSearch({ preventDefault: () => {} });

            }

        } catch (error) {
            setError(error.message || "Failed to join the study group");
        } finally {
            setJoinLoading(null);
        }

     };

     const handleCheckboxChange = (field) => {
        setMeetingTime((prev) => ({
            ...prev,
            [field]: !prev[field],
      }));
     };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div  className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
                  >
                    ← Back
                  </button>
                  <h2 className="text-2xl font-bold text-gray-800">Study Groups</h2>
                </div>
                <button 
                 onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                   + Create New Group
                </button>
            </div>

            {/* Search type toggle */}
            <div className="flex gap-4 mb-6">
                <button
                 onClick={() => {
                    setSearchType("all");
                    loadAllGroups();
                 }}
                 className={`px-4 py-2 rounded-lg font-medium transition ${
                    searchType === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                >
                    All Groups
                </button>
                <button 
                 onClick = {() => setSearchType('subject')}
                 className={`px-4 py-2 rounded-lg font-medium transition ${
                    searchType === 'subject'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}

                >

                    Search by Subject
                </button>
                <button
                 onClick={() => setSearchType('advanced')}
                 className={`px-4 py-2 rounded-lg font-medium transition ${
                    searchType === 'advanced'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                
                >
                    Advanced Search
                </button>

            </div>

            {/* Subject search form */}
            {searchType === "subject" && (
                <form onSubmit={handleSubjectSearch} className="mb-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter subject (e.g. Math, History)"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                         type="submit"
                         disabled={loading}
                         className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition"
                        
                        >
                            {loading ? "Searching..." : "Search"}

                        </button>

                    </div>

                </form>
                
            )}

            {/* Advanced search form  */}
            {searchType === "advanced" && (
             <form onSubmit={handleAdvancedSearch} className="mb-6">
                <div className="space-y-4">
                    {/* Subject Input Optional */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject (optional)
                        </label>
                        <input
                         type="text"
                         placeholder="Enter Subject"
                         value={subject}
                         onChange={(e) => setSubject(e.target.value)}
                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />

                    </div>
                    {/* Meeting Time Checkboxes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meeting Time
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={meetingTime.weekdays}
                                    onChange={() => handleCheckboxChange('weekdays')}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                            <span className="text-sm text-gray-700">Weekdays</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={meetingTime.weekend}
                                    onChange={() => handleCheckboxChange('weekend')}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                            <span className="text-sm text-gray-700">Weekend</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={meetingTime.morning}
                                    onChange={() => handleCheckboxChange('morning')}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                            <span className="text-sm text-gray-700">Morning</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={meetingTime.evening}
                                    onChange={() => handleCheckboxChange('evening')}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                            <span className="text-sm text-gray-700">Evening</span>
                            </label>
                        </div>
                    </div>
                    <button
                     type="submit"
                      disabled={loading}
                      className="w-full px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition"
                    >
                        {loading ? "Searching..." : "Search with Filters"}

                    </button>

                </div>

             </form>    
            
            )}
            {/* error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Group List */}
            {loading ? (
                <div className="text-center py-8 text-gray-500">Loading Groups ....</div>
            ) : groups.length > 0 ? (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {groups.length} group{groups.length !== 1 ? 's' : ''} found
                    </h3>
                    <div className="space-y-4">
                        {groups.map ((group) => (
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
                                    <button
                                        onClick={() => handleJoinGroup(group._id)}
                                        disabled={joinLoading === group._id}
                                        className="ml-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition"
                                    >
                                        {joinLoading === group._id ? 'Joining...' : 'Join Group'}

                                    </button>

                             </div>  
                         </div>  

                        ))}

                    </div>

                </div>

            ) : (
                <div className="text-center py-8 text-gray-500">
                    No Study groups found {searchType !== 'all' && 'Try different search criteria or '}
                    <button 
                     onClick={() => setShowCreateModal(true)}
                     className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >

                        create a new group

                    </button>
                    .
                </div>

            )}
            {/* Create Group Modal placeholder */}
          <CreateGroupModal
           isOpen={showCreateModal}
           onClose={() => setShowCreateModal(false)}
           onSuccess={loadAllGroups}
          
        
          
          />

        </div>
    );

};

export default StudyGroupBrowser;

