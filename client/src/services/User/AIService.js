import axios from 'axios'
import { businessDuration } from '../../utils/businessDays';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import ResourceService from './ResourceService';
import ProjectService from './ProjectService';
const ai_api = axios.create({
  baseURL: import.meta.env.VITE_AI_API_URL,
//   withCredentials: true,
});
const predictDelayTask = async (api, taskInfo, projectId) => {
    if (taskInfo.duration === 0) {
        return null;
    };
    if (taskInfo.complete === 100) {
        toast.warn("This task has been completed");
        return null;
    }
    if (dayjs(new Date()).isAfter(dayjs(taskInfo.finish), "day") && taskInfo.complete < 100) {
        toast.warn("This task is already overdue");
        return null;
    }
    const payload = {}
    const currentDate = dayjs(new Date());
    if (dayjs(taskInfo.start).isAfter(currentDate, "day")) {
        payload['day_since_start'] = -1*(businessDuration(currentDate, taskInfo.start)-1);
    } else {
        payload['day_since_start'] = businessDuration(taskInfo.start, currentDate)-1;
    }
    payload['deadline_day_of_week'] = dayjs(taskInfo.finish).format('dddd');
    payload['days_until_deadline'] = businessDuration(new Date(), taskInfo.finish)-1;
    if (payload['days_until_deadline'] < 0) {
        payload['days_until_deadline'] = 0;
    }
    payload['estimated_hours'] = taskInfo.effort;
    payload['priority'] = taskInfo.priority.toLowerCase();
    payload['has_dependencies'] = taskInfo.predecessor != null;
    payload['team_size'] = taskInfo.resourceAllocations.length;
    if ((taskInfo.resourceAllocations).length !== 0) {
        const assignees = [];
        (taskInfo.resourceAllocations).forEach(ra => {
            assignees.push({
                id: ra.resourceId
            })
        });
        payload['assignee_overdue_rate'] = await ResourceService.getAverageResourceOverdueRate(api, assignees);
    } else {
        payload['assignee_overdue_rate'] = 0;
    }
    payload['project_overdue_rate'] = await ProjectService.getOverdueRate(api, projectId);
    if (payload['day_since_start'] < 0) {
        payload['progress_gap'] = 0;
    } else {
        payload['progress_gap'] = taskInfo.complete - ((payload['day_since_start']+1)*(100/taskInfo.duration));
    }
    try {
        const response = await ai_api.post(`/delay-predict`, payload);
        return response.data;
    } catch (error) {
        console.log('Failed to predict task delay risk', error);
        throw error;
    }
}
export default {
    predictDelayTask
}