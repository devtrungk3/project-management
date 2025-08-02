export const formatDateTime = (isoString) => {
    if (!isoString) {
        return "None";
    }
    return new Date(isoString).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    })
}