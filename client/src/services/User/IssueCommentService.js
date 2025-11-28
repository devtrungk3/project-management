const addComment = async (api, projectId, issueId, commentContent) => {
    try {
        const response = await api.post(`/user/projects/${projectId}/issues/${issueId}/comment`, {
            content: commentContent
        });
        return response.data;
    } catch (error) {
        console.log('Failed to add issue comment: ', error);
        throw error;
    }
}
const deleteComment = async (api, projectId, issueId, commentId) => {
    try {
        await api.delete(`/user/projects/${projectId}/issues/${issueId}/comment/${commentId}`);
    } catch (error) {
        console.log('Failed to delete issue comment: ', error);
        throw error;
    }
}
export default {
    addComment,
    deleteComment
};