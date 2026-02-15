import api from './api';


//Search students by subject

export const searchStudentsBySubject = async (subject) => {
    try {
        const response = await api.get(`/users/search?subject=${subject}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

//Search Students by subject and availability
export const searchStudentByAvailability = async(searchData) => {
    try {
        const response = await api.post("/users/search/availability", searchData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }

};
