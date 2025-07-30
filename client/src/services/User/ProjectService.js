const getAllMyProjects = async (api, pageNumber) => {
    try {
        const response = await api.get(`user/projects/my-projects?page=${pageNumber}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch my projects: ', error);
        throw new Error('Cannot load project table');
    }
}
const getAllJoinedProjects = async (api, pageNumber) => {
    try {
        const response = await api.get(`user/projects/joined-projects?page=${pageNumber}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch joined projects: ', error);
        throw new Error('Cannot load project table');
    }
}
const addProject = async (api, formData) => {
    try {
        const response = await api.post('user/projects', formData);
        return response.headers.location.split("/")[4];
    } catch (error) {
        console.error('Failed to insert a new project: ', error);
        throw new Error('Cannot add new project');
    }
}
const updateProject = async (api, projectId, projectInfo) => {
    try {
        const response = await api.patch(`user/projects/${projectId}`, projectInfo);
        return response.data;
    } catch (error) {
        console.error('Failed to update project: ', error);
        throw new Error('Cannot update project information');
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
        switch (error.status) {
            case 404:
                throw new Error('Resource not found');
            default:
                throw new Error('Cannot access this project');
        }
    }
}
const getMyProjectStatistics = async (api) => {
    try {
        const response = await api.get('/user/projects/my-projects-statistics')
        return response.data;
    } catch (error) {
        console.log('Failed to get statistic: ', error);
        throw new Error('Cannot load project statistics');
    }
}
const getJoinedProjectStatistics = async (api) => {
    try {
        const response = await api.get('/user/projects/joined-projects-statistics')
        return response.data;
    } catch (error) {
        console.log('Failed to get statistic: ', error);
        throw new Error('Cannot load project statistics');
    }
}
const deleteProjectById = async (api, id) => {
    try {
        await api.delete(`/user/projects/${id}`)
    } catch (error) {
        console.log('Delete failed: ', error);
        switch (error.status) {
            case 404:
                throw new Error('Resource not found');
            default:
                throw new Error('Cannot delete the project');
        }
    }
}

export default {
    getAllMyProjects,
    getAllJoinedProjects,
    addProject,
    updateProject,
    getProjectById,
    getMyProjectStatistics,
    getJoinedProjectStatistics,
    deleteProjectById
}