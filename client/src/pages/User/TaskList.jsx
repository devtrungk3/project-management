import { useEffect, useState, useMemo } from "react";
import taskService from "../../services/User/TaskService";
import resourceService from "../../services/User/ResourceService";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import SortableTask from "../../components/SortableTask";
import TaskDialog from "../../components/TaskDialog";
import { FaPlus, FaTrash } from "react-icons/fa";
import style from './DetailProject.module.css';
import { Button, Col, Row } from "react-bootstrap";
import { toast } from 'react-toastify';
import GanttChart from "../../components/GanttChart";
import dayjs from "dayjs";
import { useBlocker } from 'react-router-dom';
import tagRateService from "../../services/User/TagRateService";
import { calculateTaskCost } from "../../utils/calculateTaskCost";

const TaskList = ({api, projectId, isMyProject}) => {
    useBlocker(() => {
      if (isDirty) {
        const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
        return !leave;
      }
      return false;
    }
  );
    const [isDirty, setIsDirty] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [resources, setResources] = useState(null);
    const [openTaskDialog, setOpenTaskDialog] = useState(0);
    const [tempTaskInfo, setTempTaskInfo] = useState(null);
    const [isAddDialog, setIsAddDialog] = useState(null);
    const [taskIdSelected, setTaskIdSelected] = useState(0);
    const [tagRates, setTagRates] = useState(null);
    useEffect(() => {
        loadTaskTable();
        loadResourceList();
        loadTagRates();
    }, [])
    useEffect(() => {
        if (!isDirty) {
            return;
        }
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
            return '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty])
    const loadTaskTable = () => {
        (async () => {
            try {
                let data = null;
                if (isMyProject) {
                    data = await taskService.getAllTasksForOwner(api, projectId);
                } else {
                    data = await taskService.getAllAssignedTasksForUser(api, projectId);
                }
                if (data != null) {
                    setTasks(data);
                }
            } catch(error) {}
        })();
    }
    const loadResourceList = () => {
        (async () => {
            try {
                const data = await resourceService.getAllResources(api, projectId);
                setResources(data);
            } catch(error) {}
        })();
    }
    const loadTagRates = async () => {
        let data = null;
        try {
            data = await tagRateService.getAllTagRates(api, projectId);
        } catch (error) {}
        setTagRates(data);
    }
    const sensors = useSensors(
        useSensor(PointerSensor)
    );
    const sortableItems = useMemo(() => tasks.map(item => item.id), [tasks]);
    
    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        if (active.id !== over?.id) {
            setTasks((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
            setIsDirty(true);
        }
    };
    const handleTaskSelect = (currentTaskIdSelected) => {
        if (currentTaskIdSelected == taskIdSelected) {
            setTaskIdSelected(0);
        } else {
            setTaskIdSelected(currentTaskIdSelected);
        }
    }
    const handleOpenTaskDialog = (taskId, addDialogFlag) => {
        if (addDialogFlag) {
            const currentDate = (new Date()).toISOString().split('T')[0];
            setTempTaskInfo({
                id: -Date.now(),
                start: currentDate,
                priority: "LOW",
                resourceAllocations: []
            });
        } else {
            setTempTaskInfo(tasks.find(task => task.id === taskId))
        }
        setIsAddDialog(addDialogFlag)
        setOpenTaskDialog(taskId);
    }
    const handleCloseTaskDialog = () => {
        setOpenTaskDialog(0);
        setTempTaskInfo(null);
    }
    const changeTaskInfo = (e) => {
        e.preventDefault();
        const taskInfo = {
            ...tempTaskInfo,
            cost: calculateTaskCost(tempTaskInfo.resourceAllocations, tempTaskInfo.effort, tagRates),
            finish: (tempTaskInfo.duration && tempTaskInfo.duration != "" && tempTaskInfo.start != "") ? (dayjs(tempTaskInfo.start).add(tempTaskInfo.duration != 0 ? tempTaskInfo.duration-1 : 0, 'day')).format("YYYY-MM-DD") : tempTaskInfo.start
        }
        setTasks(prev => prev.map(task => task.id === taskInfo.id ? taskInfo : task));
        setIsDirty(true);
        handleCloseTaskDialog();
    }
    const addNewTaskInfo = (e) => {
        e.preventDefault();
        const taskInfo = {
            ...tempTaskInfo,
            cost: calculateTaskCost(tempTaskInfo.resourceAllocations, tempTaskInfo.effort, tagRates),
            finish: (tempTaskInfo.duration && tempTaskInfo.duration != "" && tempTaskInfo.start != "") ? (dayjs(tempTaskInfo.start).add(tempTaskInfo.duration != 0 ? tempTaskInfo.duration-1 : 0, 'day')).format("YYYY-MM-DD") : tempTaskInfo.start
        }
        setTasks(prev => [...prev, taskInfo])
        setIsDirty(true);
        handleCloseTaskDialog();
    }
    const deleteTaskInfo = (e) => {
        if (taskIdSelected != 0) {
            if (confirm(`Are you sure?`)) {
                setTasks(tasks.filter(task => task.id != taskIdSelected))
                setIsDirty(true);
            }
        }
    }
    const saveAllTasks = async () => {
        try {
            if (isMyProject) {
                await taskService.syncTasks(api, projectId, tasks);
                loadTaskTable()
            } else {
                await taskService.updateTaskComplete(api, projectId, tasks);
            }
            setIsDirty(false);
            toast.success("Save successfully");
        } catch (error) {}
    }
    return (
        <>
            <div>
                <div className="d-flex justify-content-between">
                    {isMyProject === true 
                    ?
                    <div className="d-flex gap-3">
                        <div className={`${style['toolbar-item']} d-inline-flex align-items-center gap-4 px-3 py-2 border rounded-3 shadow-sm bg-info text-white`} onClick={() => handleOpenTaskDialog(tasks.length+1, true)}>
                            <div className="d-flex align-items-center gap-2">
                                <FaPlus />
                                <span className="fw-semibold">New task</span>
                            </div>
                        </div>
                        <div className={`${style['toolbar-item']} d-inline-flex align-items-center gap-4 px-3 py-2 border rounded-3 shadow-sm bg-danger text-white`} onClick={deleteTaskInfo}>
                            <div className="d-flex align-items-center gap-2">
                                <FaTrash />
                                <span className="fw-semibold">Delete task</span>
                            </div>
                        </div>
                    </div>
                    :
                    <div></div>
                    }
                    <Button onClick={saveAllTasks} className="border rounded-3 shadow-sm px-3 py-2">Save all tasks</Button>
                </div>
            </div>
            <Row className="pt-4">
                <Col md={7} className="overflow-auto">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
                        <table className={`${style.table}`}>
                            <thead>
                                <tr>
                                <th className={`${style.cell} min_width_25 ${style['cell-header']}`}></th>
                                <th className={`${style.cell} min_width_50 ${style['cell-header']} text-center`}>#</th>
                                <th className={`${style.cell} ${style['cell-header']}`}>Name</th>
                                <th className={`${style.cell} min_width_100 ${style['cell-header']}`}>Priority</th>
                                <th className={`${style.cell} ${style['cell-header']}`}>Owners</th>
                                <th className={`${style.cell} min_width_100 ${style['cell-header']}`}>Duration</th>
                                <th className={`${style.cell} min_width_100 ${style['cell-header']}`}>Start</th>
                                <th className={`${style.cell} min_width_100 ${style['cell-header']}`}>Finish</th>
                                <th className={`${style.cell} min_width_100 ${style['cell-header']}`}>Complete</th>
                                <th className={`${style.cell} min_width_100 ${style['cell-header']}`}>Effort</th>
                                <th className={`${style.cell} min_width_100 ${style['cell-header']}`}>Total cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task, index) => (
                                    <SortableTask key={task.id} task={task} index={index} onSelect={handleTaskSelect} isSelected={taskIdSelected === task.id} onDoubleClick={handleOpenTaskDialog} isMyProject={isMyProject}/>
                                ))}
                            </tbody>
                        </table>
                    </SortableContext>
                </DndContext>
                </Col>
                <Col md={5} className="flex-grow overflow-hidden">
                    <GanttChart tasks={tasks} />
                </Col>
            </Row>
            <TaskDialog 
                isMyProject={isMyProject} 
                openTaskDialog={openTaskDialog} 
                handleCloseTaskDialog={handleCloseTaskDialog} 
                tempTaskInfo={tempTaskInfo} 
                setTempTaskInfo={setTempTaskInfo} 
                resources={resources}
                tagRates={tagRates}
                onSubmit={isAddDialog === true ? addNewTaskInfo : isAddDialog === false ? changeTaskInfo : (e)=>{e.preventDefault();}} />
        </>
    )
}
export default TaskList;