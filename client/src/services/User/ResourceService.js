const getAllResources = async (api, projectId) => {
    try {
        const response = await api.get(`/user/resources?projectId=${projectId}`);
        return response.data;
    } catch (error) {
        console.log("Fetch resources failed: ", error);
        throw new Error("Get resources failed");
    }
}
export default {
    getAllResources
}