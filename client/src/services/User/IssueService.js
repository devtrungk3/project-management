const getAllIssues = async (api, projectId) => {
    try {
        const response = await api.get(`/user/projects/${projectId}/issues`);
        return response.data;
    } catch (error) {
        console.log('Failed to load issues: ', error);
        throw error;
    }
}
const getIssue = async (api, projectId, issueId) => {
    try {
        const response = await api.get(`/user/projects/${projectId}/issues/${issueId}`);
        return response.data;
    } catch (error) {
        console.log('Failed to load issue: ', error);
        throw error;
    }
}
const addIssue = async (api, projectId, issue) => {
    try {
        const response = await api.post(`/user/projects/${projectId}/issues`, issue);
        return response.data;
    } catch (error) {
        console.log('Failed to add a new issue: ', error);
        throw error;
    }
}
const changeIssueStatus = async (api, projectId, issueId, status) => {
    try {
        await api.patch(`/user/projects/${projectId}/issues/${issueId}/${status.toLowerCase()}`, 
            status,
        );
    } catch (error) {
        console.log('Failed to change issue status: ', error);
        throw error;
    }
}
const deleteIssue = async (api, projectId, issueId) => {
    try {
        await api.delete(`/user/projects/${projectId}/issues/${issueId}`);
    } catch (error) {
        console.log('Failed to delete issue: ', error);
        throw error;
    }
}
export default {
    getAllIssues,
    addIssue,
    getIssue,
    changeIssueStatus,
    deleteIssue
}