const getChatHistory = async (api, projectId) => {
    try {
        const response = await api.get(`/user/projects/${projectId}/chat/messages`);
        return response.data;
    } catch (error) {
        console.log('Failed to load chat history ', error);
        throw error;
    }
}
export default {
    getChatHistory
}