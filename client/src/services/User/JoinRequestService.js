const addJoinRequest = async (api, projectId) => {
    try {
        await api.post('/user/join-requests', projectId)
    } catch (error) {
        console.log("Failed to make join request: ", error);
        switch (error.status) {
            case 404:
                throw new Error('Resource not found');
            case 409:
                throw new Error('Already make join request for this project');
            case 400:
                throw new Error(error.response.data.error);
            default:
                throw new Error('Oops! Something went wrong');
        }
    }
}
const getAllIncomingJoinRequests = async (api, pageNumber) => {
    try {
        const response = await api.get(`/user/join-requests/incoming?page=${pageNumber}`)
        return response.data;
    } catch (error) {
        console.log("Failed to fetch incoming join requests: ", error);
        throw new Error('Oops! Something went wrong');
    }
}
const getAllOutgoingJoinRequests = async (api, pageNumber) => {
    try {
        const response = await api.get(`/user/join-requests/outgoing?page=${pageNumber}`)
        return response.data;
    } catch (error) {
        console.log("Failed to fetch outgoing join requests: ", error);
        throw new Error('Oops! Something went wrong');
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
        switch (error.status) {
            case 404:
                throw new Error('Resource not found');
            default:
                throw new Error('Oops! Something went wrong');
        }
    }
}
export default {
    addJoinRequest,
    getAllIncomingJoinRequests,
    getAllOutgoingJoinRequests,
    updateJoinRequest
}