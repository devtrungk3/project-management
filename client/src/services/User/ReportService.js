const getProjectOverviewReport = async (api, projectId) => {
    try {
        const response = await api.get(`/user/reports/${projectId}/project-overview`)
        return response.data;
    } catch (error) {
        console.log("Failed to fetch project overview report: ", error);
        throw new error;
    }
}
export default {
    getProjectOverviewReport,
}