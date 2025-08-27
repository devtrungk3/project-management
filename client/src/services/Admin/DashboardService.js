const getUserStats = async (api) => {
    try {
        const response = await api.get("/admin/stats/users");
        return response.data;
    } catch (error) {
        console.log("Failed to fetch user statistics: ", error);
        throw new error;
    }
}
const getProjectStats = async (api) => {
    try {
        const response = await api.get("/admin/stats/projects");
        return response.data;
    } catch (error) {
        console.log("Failed to fetch project statistics: ", error);
        throw new error;
    }
}
const getTaskStats = async (api) => {
    try {
        const response = await api.get("/admin/stats/tasks");
        return response.data;
    } catch (error) {
        console.log("Failed to fetch task statistics: ", error);
        throw new error;
    }
}
export default {
    getUserStats,
    getProjectStats,
    getTaskStats
}