export const formatDateTime = (isoString, tagLocale='en-US') => {
    if (!isoString) {
        return "";
    }
    return (new Date(isoString)).toLocaleString(tagLocale);
}
export const formatDate = (isoString, tagLocale='en-US') => {
    if (!isoString) {
        return "";
    }
    return (new Date(isoString)).toLocaleDateString(tagLocale);
}