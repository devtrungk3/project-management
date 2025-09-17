const mainAPI = "/user/tag-rates"
const getAllTagRates = async (api, projectId) => {
    try {
        const response = await api.get(`${mainAPI}/${projectId}`);
        return response.data;
    } catch (error) {
        console.log('Failed to get tag rates');
        throw error;
    }
}
const addTagRate = async (api, newTagRate, projectId) => {
    const payload = {
        ...newTagRate,
        project: {
            id: projectId
        }
    }
    try {
        const response = await api.post(mainAPI, payload);
        return response.data;
    } catch (error) {
        console.log('Failed to add tag rate');
        throw error;
    }
}
const updateTagRate = async (api, updatedTagRate, projectId) => {
    const payload = {
        ...updatedTagRate,
        project: {
            id: projectId
        }
    }
    try {
        const response = await api.put(`${mainAPI}`, payload);
        return response.data;
    } catch (error) {
        console.log('Failed to update tag rate');
        throw error;
    }
}
const deleteTagRate = async (api, tagRateId) => {
    try {
        await api.delete(`${mainAPI}/${tagRateId}`);
    } catch (error) {
        console.log('Failed to delete tag rate');
        throw error;
    }
}
export default {
    getAllTagRates,
    addTagRate,
    updateTagRate,
    deleteTagRate
}