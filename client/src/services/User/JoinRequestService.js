const addJoinRequest = async (api, projectId) => {
    try {
        await api.post('/user/join-requests', projectId)
    } catch (error) {
        console.log("Failed to make join request: ", error);
        throw error;
    }
}
const getAllIncomingJoinRequests = async (api, pageNumber) => {
    try {
        const response = await api.get(`/user/join-requests/incoming?page=${pageNumber}`)
        return response.data;
    } catch (error) {
        console.log("Failed to fetch incoming join requests: ", error);
        throw error;
    }
}
const getAllOutgoingJoinRequests = async (api, pageNumber) => {
    try {
        const response = await api.get(`/user/join-requests/outgoing?page=${pageNumber}`)
        return response.data;
    } catch (error) {
        console.log("Failed to fetch outgoing join requests: ", error);
        throw error;
    }
}
const updateJoinRequest = async (api, joinRequestId, isAccepted) => {
    const data = {
        acceptFlag: isAccepted
    }
    try {
        await api.patch(`/user/join-requests/${joinRequestId}`, data);
    } catch (error) {
        console.log("Failed to update join requests: ", error);
        throw error;
    }
}
export default {
    addJoinRequest,
    getAllIncomingJoinRequests,
    getAllOutgoingJoinRequests,
    updateJoinRequest
}