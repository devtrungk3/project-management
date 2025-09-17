const mainAPI = "/admin/currencies";
const getAllCurrencies = async (api) => {
    try {
        const response = await api.get(mainAPI);
        return response.data;
    } catch (error) {
        console.log('Failed to load currencies');
        throw error;
    }
}
const addCurrency = async (api, payload) => {
    try {
        const response = await api.post(mainAPI, payload);
        return response.data;
    } catch (error) {
        console.log('Failed to add currency');
        throw error;
    }
}
const deleteCurrency = async (api, currencyId) => {
    try {
        await api.delete(`${mainAPI}/${currencyId}`);
    } catch (error) {
        console.log('Failed to delete currency');
        throw error;
    }
}
const updateCurrency = async (api, updatedCurrency) => {
    try {
        const response = await api.put(`${mainAPI}`, updatedCurrency);
        return response.data;
    } catch (error) {
        console.log('Failed to update currency');
        throw error;
    }
}
export default {
    getAllCurrencies,
    addCurrency,
    deleteCurrency,
    updateCurrency
}