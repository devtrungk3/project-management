export const formatDateTime = (isoString) => {
    if (!isoString) {
        return "None";
    }
    return (new Date(isoString)).toLocaleString();
}
export const formatDate = (isoString) => {
    if (!isoString) {
        return "None";
    }
    return (new Date(isoString)).toLocaleDateString();
}