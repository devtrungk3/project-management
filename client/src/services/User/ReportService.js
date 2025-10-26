const getProjectOverviewReport = async (api, projectId) => {
    try {
        const response = await api.get(`/user/reports/${projectId}/project-overview`)
        return response.data;
    } catch (error) {
        console.log("Failed to fetch project overview report: ", error);
        throw new error;
    }
}
const getUpcomingTasksReport = async (api, projectId) => {
    try {
        const response = await api.get(`/user/reports/${projectId}/upcoming-tasks`)
        return response.data;
    } catch (error) {
        console.log("Failed to fetch upcoming tasks report: ", error);
        throw new error;
    }
}
const getCostOverviewReport = async (api, projectId) => {
    try {
        const response = await api.get(`/user/reports/${projectId}/cost-overview`)
        return response.data;
    } catch (error) {
        console.log("Failed to fetch cost overview report: ", error);
        throw new error;
    }
}
const getWorkOverviewReport = async (api, projectId) => {
    try {
        const response = await api.get(`/user/reports/${projectId}/work-overview`)
        return response.data;
    } catch (error) {
        console.log("Failed to fetch work overview report: ", error);
        throw new error;
    }
}
export default {
    getProjectOverviewReport,
    getUpcomingTasksReport,
    getCostOverviewReport,
    getWorkOverviewReport
}