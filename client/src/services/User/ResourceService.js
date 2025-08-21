const getAllResources = async (api, projectId) => {
    try {
        const response = await api.get(`/user/resources?projectId=${projectId}`);
        return response.data;
    } catch (error) {
        console.log("Fetch resources failed: ", error);
        throw error;
    }
}
const deleteResource = async (api, resourceId) => {
    try {
        await api.delete(`/user/resources/${resourceId}`)
    } catch (error) {
        console.log("Delete resource failed: ", error);
        throw error;
    }
}
export default {
    getAllResources,
    deleteResource
}