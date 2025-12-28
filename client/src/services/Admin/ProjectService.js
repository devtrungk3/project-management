const mainAPI = "/admin/projects";
const getProjects = async (api, pageNumber) => {
    try {
        const response = await api.get(`${mainAPI}?page=${pageNumber}`);
        return response.data;
    } catch (error) {
        console.log('Failed to load projects');
        throw error;
    }
}
export default {
    getProjects
}