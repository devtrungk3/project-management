const getAllTasksForOwner = async (api, projectId) => {
    try {
        const response = await api.get(`user/tasks?projectId=${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch tasks: ', error);
        throw error;
    }
}
const getAllAssignedTasksForUser = async (api, projectId) => {
    try {
        const response = await api.get(`user/tasks/joined?projectId=${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch tasks: ', error);
        throw error;
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
        throw error;
    }
}
const updateTaskComplete = async (api, projectId, tasks) => {
    const copiedTasks = tasks.map(task => JSON.parse(JSON.stringify({
        id: task.id,
        complete: task.complete,
    })));
    try {
        await api.patch(`user/tasks/complete?projectId=${projectId}`, copiedTasks);
    } catch (error) {
        console.log('Cannot save tasks: ', error);
        throw error;
    }
}
export default {
    getAllTasksForOwner,
    getAllAssignedTasksForUser,
    syncTasks,
    updateTaskComplete
}