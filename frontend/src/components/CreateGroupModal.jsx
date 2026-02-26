
import { useState } from "react";
import { createStudyGroup} from "../services/studyGroupService"


const CreateGroupModal = ({ isOpen, onClose, onSuccess}) => {

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        subject: '',
        maxMembers: 10,
        meetingTime: {
            weekdays: false,
            weekend: false,
            morning: false,
            evening: false,
        },

    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    //Dont render if modal is closed
    if (!isOpen) {
        return null;
    }

    const handleChange = (e) => {
     const { name, value } = e.target;
     setFormData((prev) => ({
        ...prev,
        [name]: value,
     }));
    };

    const handleCheckboxChange = (field) => {
        setFormData((prev) => ({
            ...prev,
            meetingTime: {
                ...prev.meetingTime,
                [field]: !prev.meetingTime[field],
            },
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        //validation
        if(!formData.name.trim()){
            setError('Please provide a group name');
            return;
        }
        if(!formData.subject.trim()){
            setError('Please provide a subject');
            return;
        }

        //Check if at least one meeting time is selected
        const {weekdays, weekend, morning, evening} = formData.meetingTime;
        if (!weekdays && !weekend && !morning && !evening){
            setError('Please select at least one meeting time');
            return;
        }
        
        setLoading(true);
        setError('');

        try {
            await createStudyGroup(formData);
            alert('Study group created successfully!');

            //Rest form
            setFormData({
                name: '',
                description: '',
                subject: '',
                maxMembers: 10,
                meetingTime: {
                    weekdays: false,
                    weekend: false,
                    morning: false,
                    evening: false,
                },
            });
            onSuccess(); //Refresh parent component data
            onClose(); //Close modal

        } catch (error) {
            console.error('Error creating study group:', error);
            // Handle different error formats safely
            let errorMessage = 'Failed to create study group. Please try again.';
            
            if (typeof error === 'string') {
                errorMessage = error;
            } else if (error?.message && typeof error.message === 'string') {
                errorMessage = error.message;
            } else if (error?.response?.data?.message && typeof error.response.data.message === 'string') {
                errorMessage = error.response.data.message;
            }
            
            setError(errorMessage);

        } finally {
            setLoading(false);
        }
    }

    const handleClose = () => {
        //Reset form and error when closing
        setFormData({
            name: '',
            description: '',
            subject: '',
            maxMembers: 10,
            meetingTime: {
                weekdays: false,
                weekend: false,
                morning: false,
                evening: false,
            },
        });
        setError('');
        onClose();

    };



    return (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Create Study Group</h3>
            <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
            >
                ×
            </button>
            </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Math Study Group"
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
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g., Mathematics, Physics"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of your study group..."
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
              value={formData.maxMembers}
              onChange={handleChange}
              min="2"
              max="50"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Between 2 and 10 members</p>
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
                  checked={formData.meetingTime.weekdays}
                  onChange={() => handleCheckboxChange('weekdays')}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Weekdays</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.meetingTime.weekend}
                  onChange={() => handleCheckboxChange('weekend')}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Weekend</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.meetingTime.morning}
                  onChange={() => handleCheckboxChange('morning')}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Morning</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.meetingTime.evening}
                  onChange={() => handleCheckboxChange('evening')}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Evening</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">Select at least one</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div> 
    );
    
};

export default CreateGroupModal;