const getAllMyProjects = async (api, pageNumber, searchParams) => {
    let apiUrl = `user/projects/my-projects?page=${pageNumber}`;
    if (searchParams.get("name") !== null) {
        apiUrl += `&name=${searchParams.get("name").trim()}`;
    }
    if (searchParams.get("status") !== null && searchParams.get("status") !== "ALL") {
        apiUrl += `&status=${searchParams.get("status")}`;
    }
    try {
        const response = await api.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch my projects: ', error);
        throw error;
    }
}
const getAllJoinedProjects = async (api, pageNumber, searchParams) => {
    let apiUrl = `user/projects/joined-projects?page=${pageNumber}`;
    if (searchParams.get("name") !== null) {
        apiUrl += `&name=${searchParams.get("name").trim()}`;
    }
    if (searchParams.get("owner") !== null) {
        apiUrl += `&owner=${trsearchParams.get("owner").trim()}`;
    }
    if (searchParams.get("status") !== null && searchParams.get("status") !== "ALL") {
        apiUrl += `&status=${searchParams.get("status")}`;
    }
    try {
        const response = await api.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch joined projects: ', error);
        throw error;
    }
}
const addProject = async (api, formData) => {
    try {
        const response = await api.post('user/projects', formData);
        return response.headers.location.split("/")[4];
    } catch (error) {
        console.error('Failed to insert a new project: ', error);
        throw error;
    }
}
const updateProject = async (api, projectId, projectInfo) => {
    try {
        const response = await api.patch(`user/projects/${projectId}`, projectInfo);
        return response.data;
    } catch (error) {
        console.error('Failed to update project: ', error);
        throw error;
    }
}
const cancelProject = async (api, projectId) => {
    try {
        const response = await api.patch(`user/projects/${projectId}/cancel`);
        return response.data;
    } catch (error) {
        console.error('Failed to cancel project: ', error);
        throw error;
    }
}
const getProjectById = async (api, id, isMyProject) => {
    if (!/^[1-9]\d*$/.test(id)) {
        throw new Error("Invalid parameters");
    }
    try {
        let response = null;
        if (isMyProject) {
            response = await api.get(`/user/projects/${id}`)
        } else {
            response = await api.get(`/user/projects/joined/${id}`)
        }
        return response.data
    } catch (error) {
        console.log('Failed to get a project: ', error);
        throw error;
    }
}
const getMyProjectStatistics = async (api) => {
    try {
        const response = await api.get('/user/projects/my-projects-statistics')
        return response.data;
    } catch (error) {
        console.log('Failed to get statistic: ', error);
        throw new error;
    }
}
const getJoinedProjectStatistics = async (api) => {
    try {
        const response = await api.get('/user/projects/joined-projects-statistics')
        return response.data;
    } catch (error) {
        console.log('Failed to get statistic: ', error);
        throw error;
    }
}
const deleteProjectById = async (api, id) => {
    try {
        await api.delete(`/user/projects/${id}`)
    } catch (error) {
        console.log('Delete failed: ', error);
        throw error;
    }
}

export default {
    getAllMyProjects,
    getAllJoinedProjects,
    addProject,
    updateProject,
    cancelProject,
    getProjectById,
    getMyProjectStatistics,
    getJoinedProjectStatistics,
    deleteProjectById
}