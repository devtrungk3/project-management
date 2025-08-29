const getAllUsers = async (api, pageNumber) => {
    try {
        const response = await api.get(`/admin/users?page=${pageNumber}`);
        return response.data;
    } catch (error) {
        console.log("Failed to fetch all users: ", error);
        throw new error;
    }
}
const addNewUser = async (api, userInfo) => {
    try {
        await api.post("/admin/users", userInfo);
    } catch (error) {
        console.log("Failed to add user: ", error);
        throw new error;
    }
}
const deleteUser = async (api, userId) => {
    try {
        const response = await api.delete(`/admin/users/${userId}`);
    } catch (error) {
        console.log("Failed to delete user: ", error);
        throw new error;
    }
}
const activeUser = async (api, userId) => {
    try {
        const response = await api.patch(`/admin/users/${userId}/active`);
        return response.data;
    } catch (error) {
        console.log("Failed to active user: ", error);
        throw new error;
    }
}
const suspendUser = async (api, userId) => {
    try {
        const response = await api.patch(`/admin/users/${userId}/suspend`);
        return response.data;
    } catch (error) {
        console.log("Failed to suspend user: ", error);
        throw new error;
    }
}
const banUser = async (api, userId) => {
    try {
        const response = await api.patch(`/admin/users/${userId}/ban`);
        return response.data;
    } catch (error) {
        console.log("Failed to ban user: ", error);
        throw new error;
    }
}
export default {
    getAllUsers,
    addNewUser,
    deleteUser,
    activeUser,
    suspendUser,
    banUser,
}