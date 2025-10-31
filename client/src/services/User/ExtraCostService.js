const getAllExtraCosts = async (api, projectId) => {
    try {
        const response = await api.get(`/user/projects/${projectId}/extra-costs`);
        return response.data;
    } catch (error) {
        console.log("Failed to fetch extra costs: ", error);
        throw new error;
    }
}
const addExtraCost = async (api, payload, projectId) => {
    try {
        const response = await api.post(`/user/projects/${projectId}/extra-costs`, payload);
        return response.data;
    } catch (error) {
        console.log('Failed to add extra cost', error);
        throw error;
    }
}
const updateExtraCost = async (api, updatedExtraCost, projectId) => {
    try {
        const response = await api.put(`/user/projects/${projectId}/extra-costs/${updatedExtraCost.id}`, updatedExtraCost);
        return response.data;
    } catch (error) {
        console.log('Failed to update extra cost', error);
        throw error;
    }
}
const deleteExtraCost = async (api, deletedExtraCostId, projectId) => {
    try {
        await api.delete(`/user/projects/${projectId}/extra-costs/${deletedExtraCostId}`);
    } catch (error) {
        console.log('Failed to delete extra cost', error);
        throw error;
    }
}
export default {
    getAllExtraCosts,
    addExtraCost,
    updateExtraCost,
    deleteExtraCost
}