const mainAPI = "/user/currencies";
const getAllCurrencies = async (api) => {
    try {
        const response = await api.get(mainAPI);
        return response.data;
    } catch (error) {
        console.log('Failed to load currencies');
        throw error;
    }
}
export default {
    getAllCurrencies
}