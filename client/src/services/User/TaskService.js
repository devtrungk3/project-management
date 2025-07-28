const getAllTasksForOwner = async (api, projectId) => {
    try {
        const response = await api.get(`user/tasks?projectId=${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch tasks: ', error);
        throw new Error('Cannot load task table');
    }
}
const getAllAssignedTasksForUser = async (api, projectId) => {
    try {
        const response = await api.get(`user/tasks/joined?projectId=${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch tasks: ', error);
        throw new Error('Cannot load task table');
    }
}
const syncTasks = async (api, projectId, tasks) => {
    const copiedTasks = JSON.parse(JSON.stringify(tasks));
    copiedTasks.forEach((task, index) => {
        task.arrangement = index+1;
        if (task.id < 1) {
            task.id = null;
        }
    });
    try {
        await api.post(`user/tasks?projectId=${projectId}`, copiedTasks);
    } catch (error) {
        console.log('Cannot save tasks: ', error);
        throw Error('Cannot save tasks');
    }
}
export default {
    getAllTasksForOwner,
    getAllAssignedTasksForUser,
    syncTasks
}