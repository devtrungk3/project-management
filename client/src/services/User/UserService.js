const changePassword = async (api, passwordForm) => {
    try {
        await api.put(`user/password`, {
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword
        });
    } catch (error) {
        console.error('Failed to update password: ', error);
        throw error;
    }
}
export default {
    changePassword
}