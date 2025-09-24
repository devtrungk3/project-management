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
import { PiTextIndentBold, PiTextOutdentBold } from "react-icons/pi";

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
    const [selectedTaskIndex, setSelectedTaskIndex] = useState(-1);
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
                    // set level of each task based on parent level
                    const map = new Map();
                    setTasks(data.map(d => {
                        let level = 0;
                        if (d.parentId != null && map.has(d.parentId)) {
                            level = map.get(d.parentId).level + 1;
                        }
                        const newTask = { ...d, level };
                        map.set(d.id, newTask);
                        return newTask;
                    }));
                } else {
                    setTasks([]);
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
        if (active.id === over?.id) return;

        setTasks((tasks) => {
            const draggedTask = tasks.find((t) => t.id === active.id);
            if (!draggedTask) return items;

            const descendantIds = getDescendantIds(tasks, draggedTask.id);
            const childrenSize = descendantIds.length;
            const fromIndex = tasks.findIndex((t) => t.id === draggedTask.id);

            const toIndex = tasks.findIndex((t) => t.id === over?.id);
            if (toIndex > fromIndex && toIndex <= fromIndex + childrenSize) return tasks;
            return arrayMoveBlock(tasks, fromIndex, toIndex, childrenSize+1);
        });
        setIsDirty(true);
    };
    const getDescendantIds = (tasks, parentId) => {
        const children = tasks.filter(t => t.parentId === parentId);
        return children.reduce((acc, child) => 
            [...acc, child.id, ...getDescendantIds(tasks, child.id)]
        ,[]);
    };
    const arrayMoveBlock = (array, from, to, blockSize) => {
        if (from === to) return array;
        const newArr = [...array];
        const blocks = newArr.splice(from, blockSize);
        to = to > from ? (to - blockSize)+1 : to
        newArr.splice(
            to, 
            0, ...blocks
        )
        newArr[to] = reCalculateTaskParent(newArr, newArr[to], to-1, to+blockSize);
        refreshChildrenLevel(newArr, newArr[to].id);
        return newArr;
    };
    // re calculate parent task and level based on tasks above and below
    const reCalculateTaskParent = (array, currentTask, indexAbove, indexBelow) => {
        const taskAbove = array[indexAbove];
        const taskBelow = array[indexBelow];
        if (taskAbove === undefined) {
            return {
                ...currentTask,
                parentId: null,
                level: 0,
            }
        } else if (taskBelow === undefined) {
            return {
                ...currentTask,
                parentId: taskAbove.parentId,
                level: taskAbove.level,
            }
        } else if (taskBelow.parentId === taskAbove.id) {
            return {
                ...currentTask,
                parentId: taskBelow.parentId,
                level: taskBelow.level,
            }
        } else {
            return {
                ...currentTask,
                parentId: taskAbove.parentId,
                level: taskAbove.level,
            }
        }
    }
    const handleTaskSelect = (currentSelectedIndex) => {
        if (currentSelectedIndex === selectedTaskIndex) {
            setSelectedTaskIndex(-1);
        } else {
            setSelectedTaskIndex(currentSelectedIndex);
        }
    }
    const handleOpenTaskDialog = (taskId, addDialogFlag) => {
        if (addDialogFlag) {
            const currentDate = (new Date()).toISOString().split('T')[0];
            setTempTaskInfo({
                id: -Date.now(),
                start: currentDate,
                priority: "LOW",
                duration: 0,
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
        const newTask = reCalculateTaskParent(tasks, taskInfo, selectedTaskIndex-1, selectedTaskIndex);
        setTasks(prev => selectedTaskIndex > -1
            ? [...prev.slice(0, selectedTaskIndex), newTask, ...prev.slice(selectedTaskIndex)]
            : [...prev, newTask]
        )
        setIsDirty(true);
        handleCloseTaskDialog();
    }
    const deleteTaskInfo = (e) => {
        if (selectedTaskIndex > -1) {
            if (confirm(`Do you want to delete this task and its subtasks?`)) {
                const deletedSet = new Set([tasks[selectedTaskIndex].id, ...getDescendantIds(tasks, tasks[selectedTaskIndex].id)]);
                setTasks(tasks.filter(task => !deletedSet.has(task.id)));
                setIsDirty(true);
            }
        }
        setSelectedTaskIndex(-1);
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
    const findParent = (level, currentIndex) => {
        if (currentIndex < 0) return null;
        if (level > tasks[currentIndex].level) return tasks[currentIndex];
        return findParent(level, currentIndex-1);
    }
    const refreshChildrenLevel = (array, parentId) => {
        if (parentId === undefined) return;
        const parent = array.find(t => t.id === parentId);
        const children = array.filter(t => t.parentId === parent.id);
        if (children.length == 0) return;
        children.map(c => {
            c.level = parent.level + 1;
            refreshChildrenLevel(array, c.id)
        });
    }
    const outdent = () => {
        setTasks(tasks => {
            const newTasks = tasks.map((task, index) => {
                if (index === selectedTaskIndex) {
                    const parent = findParent(task.level-1, index-1);
                    return {
                        ...task,
                        parentId: parent != null ? parent.id : null,
                        level: parent != null ? parent.level+1 : 0
                    }
                }
                return task;
            });
            // Resets the parent of all tasks that are below the given task in hierarchy.
            // Only tasks with a higher level (+1) than the specified task will have their parent reassigned.
            if (selectedTaskIndex > -1) {
                for (let i=selectedTaskIndex+1; i<newTasks.length; i++) {
                    if (newTasks[i].level === newTasks[selectedTaskIndex].level+1) {
                        newTasks[i].parentId = newTasks[selectedTaskIndex].id;
                    }
                }
            }
            refreshChildrenLevel(newTasks, newTasks[selectedTaskIndex]?.id);
            return newTasks;
        })     
    }
    const indent = () => {
        setTasks(tasks => {
            const newTasks = tasks.map((task, index) => {
                if (index === selectedTaskIndex) {
                    const parent = findParent(task.level+1, index-1);
                    return {
                        ...task,
                        parentId: parent != null ? parent.id : null,
                        level: parent != null ? parent.level+1 : 0
                    }
                }
                return task;
            })
            refreshChildrenLevel(newTasks, newTasks[selectedTaskIndex]?.id);
            return newTasks;
        })
    }
    return (
        <>
            <div>
                <div className="d-flex justify-content-between">
                    {isMyProject === true 
                    ?
                    <div className="d-flex gap-3">
                        <div className={`${style['toolbar-item']} d-inline-flex align-items-center gap-4 px-2 border rounded-3 shadow-sm bg-secondary text-white`} onClick={outdent}>
                            <div className="d-flex align-items-center gap-2">
                                <span className="fs-4">
                                    <PiTextOutdentBold />
                                </span>
                            </div>
                        </div>
                        <div className={`${style['toolbar-item']} d-inline-flex align-items-center gap-4 px-2 border rounded-3 shadow-sm bg-secondary text-white`} onClick={indent}>
                            <div className="d-flex align-items-center gap-2">
                                <span className="fs-4">
                                    <PiTextIndentBold />
                                </span>
                            </div>
                        </div>
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
                                    <SortableTask key={task.id} task={task} index={index} onSelect={handleTaskSelect} isSelected={selectedTaskIndex === index} onDoubleClick={handleOpenTaskDialog} isMyProject={isMyProject}/>
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