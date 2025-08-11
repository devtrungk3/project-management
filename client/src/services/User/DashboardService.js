const getOverview = async (api) => {
    try {
        const response = await api.get("/user/dashboard/overview")
        return response.data;
    } catch (error) {
        console.log("Failed to fetch overview: ", error);
        throw new Error('Cannot load overview');
    }
}
export default {
    getOverview
}