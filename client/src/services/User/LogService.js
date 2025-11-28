const getActionLog = async (api, projectId, pageNumber) => {
    let apiUrl = `user/projects/${projectId}/action-log?page=${pageNumber}`;
    try {
        const response = await api.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch project aciton log: ', error);
        throw error;
    }
}
export default {
    getActionLog,
}