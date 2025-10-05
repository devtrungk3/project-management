import { useEffect, useState, useMemo, useRef } from "react";
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
import { useBlocker } from 'react-router-dom';
import tagRateService from "../../services/User/TagRateService";
import { calculateTaskCost } from "../../utils/calculateTaskCost";
import { PiTextIndentBold, PiTextOutdentBold } from "react-icons/pi";
import Task from '../../models/Task';
import { businessDuration } from "../../utils/businessDays";
const TaskList = ({api, projectId, isMyProject}) => {
    useBlocker(() => {
      if (isDirty) {
        const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
        if (leave) {
            setIsDirty(false);
        }
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
                    const taskMap = new Map();
                    data.forEach(d => {
                        const task = new Task(
                            d.id, 
                            d.name, 
                            d.description, 
                            d.effort, 
                            d.duration, 
                            d.start,
                            d.priority,
                            d.complete,
                            d.cost,
                            d.resourceAllocations,
                            d.parentId != null ? new Task(d.parentId) : null,
                            new Task(d.predecessor),
                            d.dependencyType
                        );
                        taskMap.set(d.id, task);
                    });
                    const newTasks = [];
                    taskMap.forEach(task => {
                        // resolve task parent and predecessor
                        if (task.parent != null && taskMap.has(task.parent.id)) {
                            task.parent = taskMap.get(task.parent.id);
                        }
                        if (task.predecessor?.id > 0) {
                            task.predecessor = taskMap.get(task.predecessor.id)
                        } else {
                            task.predecessor = null;
                        }
                        newTasks.push(task);
                    });
                    setTasks(newTasks);
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

        const draggedTask = tasks.find((t) => t.id === active.id);
        if (!draggedTask) return items;

        const descendants = getDescendants(tasks, draggedTask.id);
        const childrenSize = descendants.length;
        const fromIndex = tasks.findIndex((t) => t.id === draggedTask.id);

        const toIndex = tasks.findIndex((t) => t.id === over?.id);
        if (toIndex > fromIndex && toIndex <= fromIndex + childrenSize) return;
        const tasksAfterMoving = arrayMoveBlock(tasks, fromIndex, toIndex, childrenSize+1);
        refreshSummaryTasks(tasksAfterMoving);
        setIsDirty(true);
    };
    // re-calculate information of summary tasks and their subtasks
    const refreshSummaryTasks = (newTasks) => {
        if (newTasks.length <= 1) {
            setTasks(newTasks);
            return;
        };
        // trigger task start update
        newTasks.forEach(t => {
            t.start
        })
        // bottom to top
        for (let i=newTasks.length-2; i>=0; i--) {
            const currentTask = newTasks[i];
            let earlestStart = null;
            let latestFinish = null;
            let sumEffort = 0;
            let sumCost = 0;
            const unspecifiedChildren = [];
            // find children
            let hasChild = false;
            for (let y=i+1; y<newTasks.length; y++) {
                const taskBelow = newTasks[y];
                if (taskBelow.level <= currentTask.level) {
                    break;
                }
                // this is a child
                if (taskBelow.level === currentTask.level+1) {
                    hasChild = true;
                    if (taskBelow.start == null) {
                        unspecifiedChildren.push(taskBelow);
                        continue;
                    }
                    // start date
                    if (earlestStart == null || earlestStart > taskBelow.start) {
                        earlestStart = taskBelow.start;
                    }
                    // finish date
                    if (latestFinish == null || latestFinish < taskBelow.finish) {
                        latestFinish = taskBelow.finish;
                    }
                    // effort
                    sumEffort += taskBelow.effort;
                    // cost 
                    sumCost += taskBelow.cost;
                }
            }
            unspecifiedChildren.forEach(unspecifiedTask => {
                // reassigned child based on summary task
                unspecifiedTask.start = earlestStart;
                unspecifiedTask.cost = calculateTaskCost(unspecifiedTask.resourceAllocations, unspecifiedTask.effort, tagRates);
                // finish date for summary task
                if (latestFinish == null || latestFinish < unspecifiedTask.finish) {
                    latestFinish = unspecifiedTask.finish;
                }
                // effort for summary task
                sumEffort += unspecifiedTask.effort;
                // cost for summary task
                sumCost += unspecifiedTask.cost;
            })
            if (hasChild === true) {
                currentTask.cost = sumCost;
                currentTask.effort = sumEffort;
                if (earlestStart != null) {
                    currentTask.duration = businessDuration(earlestStart, latestFinish);
                }
                currentTask.start = earlestStart;
            }
        }
        setTasks(newTasks);
    }
    const getDescendants = (tasks, parentId) => {
        const children = tasks.filter(t => t.parent?.id === parentId);
        return children.reduce((acc, child) => 
            [...acc, child, ...getDescendants(tasks, child.id)]
        ,[]);
    };
    const getAncestorIds = (tasks, taskInfo) => {
        if (!taskInfo || !taskInfo.parent) return [];
        const parent = tasks.find(t => t.id === taskInfo.parent.id) || null;
        return parent != null
            ? [parent.id, ...getAncestorIds(tasks, parent)]
            : [];
    };
    const arrayMoveBlock = (array, from, to, blockSize) => {
        const newArr = [...array];
        const blocks = newArr.splice(from, blockSize);
        to = to > from ? (to - blockSize)+1 : to
        newArr.splice(
            to, 
            0, ...blocks
        )
        reCalculateTaskParent(newArr, newArr[to], to-1, to+blockSize);
        validateDependency(array, newArr[to]);
        return newArr;
    };
    // re calculate parent task based on tasks above and below
    const reCalculateTaskParent = (array, currentTask, indexAbove, indexBelow) => {
        const taskAbove = array[indexAbove];
        const taskBelow = array[indexBelow];
        if (!taskAbove) {
            currentTask.parent = null;
        } else if (!taskBelow) {
            currentTask.parent = taskAbove.parent;
        } else if (taskBelow.parent?.id === taskAbove.id) {
            currentTask.parent = taskBelow.parent;
        } else {
            currentTask.parent = taskAbove.parent;
        }
    }
    // validate task dependency
    const validateDependency = (tasks, taskData) => {
        if (!taskData) {
            return;
        }
        let ancestorIds = getAncestorIds(tasks, taskData);
        const children = getDescendants(tasks, taskData.id);
        // validate target task's dependency
        // not allowing summary task to have a predecessor
        if (children.length > 0) {
            taskData.predecessor = null;
            taskData.predecessorType = null;
        }
        // make sure predecessor not null
        else if (taskData.predecessor?.id > 0) {
            if (
                // self-dependent
                taskData.predecessor.id == taskData.id
                // unspecified predecessor's start
                || taskData.predecessor.start == null
                // conflict dependency
                || (taskData.predecessor.predecessor?.id === taskData.id)
            ) {
                taskData.predecessor = null;
                taskData.predecessorType = null;
            } else {
                // predecessor is a ancestor
                for (let i=0; i<ancestorIds.length; i++) {
                    if (ancestorIds[i] === taskData.predecessor.id) {
                        taskData.predecessor = null;
                        taskData.predecessorType = null;
                        break;
                    }
                }   
            }  
        }
        // validate children's dependencies
        if (children.length != 0) {
            children.forEach(child => {
                // predecessor is a child
                if (child.id === taskData.predecessor?.id) {
                    taskData.predecessor = null;
                    taskData.predecessorType = null;
                } else {
                    ancestorIds = [taskData.id, ...ancestorIds];
                    // children's predecessor is an ancestor
                    for (let i=0; i<ancestorIds.length; i++) {
                        if (ancestorIds[i] === child.predecessor?.id) {
                            child.predecessor = null;
                            child.predecessorType = null;
                            break;
                        }
                    }
                }

            })     
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
            setTempTaskInfo({
                id: -Date.now(),
                priority: "LOW",
                duration: 0,
                effort: 0,
                start: null,
                predecessor: 0,
                dependencyType: null,
                resourceAllocations: []
            });
        } else {
            const task = tasks.find(task => task.id === taskId);
            const predecessorIndex = tasks.findIndex(t => t.id === task.predecessor?.id);
            setTempTaskInfo({
                id: task.id,
                name: task.name,
                description: task.description,
                effort: task.effort,
                duration: task.duration,
                start: task.start,
                priority: task.priority,
                parentId: task.parent?.id || null,
                predecessor: predecessorIndex > -1 ? predecessorIndex+1 : 0,
                dependencyType: task.dependencyType,
                complete: task.complete,
                resourceAllocations: task.resourceAllocations
            })
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
        const updatedTask = tasks.find(task => task.id === tempTaskInfo.id) || null;
        updatedTask.setAll(
            tempTaskInfo.name, 
            tempTaskInfo.description, 
            Number(tempTaskInfo.effort),
            Number(tempTaskInfo.duration),
            tempTaskInfo.start, 
            tempTaskInfo.priority,  
            Number(tempTaskInfo.complete), 
            calculateTaskCost(tempTaskInfo.resourceAllocations, tempTaskInfo.effort, tagRates),
            tempTaskInfo.resourceAllocations,
            tasks.find(task => task.id === tempTaskInfo.parentId) || null, 
            tempTaskInfo.predecessor > 0 ? tasks[tempTaskInfo.predecessor-1] : null, 
            tempTaskInfo.predecessor > 0 
                ? tempTaskInfo.dependencyType 
                    ? tempTaskInfo.dependencyType 
                    : "FS"
                : null
        );
        validateDependency(tasks, updatedTask);
        refreshSummaryTasks([...tasks]);
        setIsDirty(true);
        handleCloseTaskDialog();
    }
    const addNewTaskInfo = (e) => {
        e.preventDefault();
        const newTask = new Task(
            tempTaskInfo.id,
            tempTaskInfo.name, 
            tempTaskInfo.description, 
            Number(tempTaskInfo.effort),
            Number(tempTaskInfo.duration),
            tempTaskInfo.start, 
            tempTaskInfo.priority,  
            Number(tempTaskInfo.complete), 
            calculateTaskCost(tempTaskInfo.resourceAllocations, tempTaskInfo.effort, tagRates),
            tempTaskInfo.resourceAllocations,
            null, 
            tempTaskInfo.predecessor > 0 ? tasks[tempTaskInfo.predecessor-1] : null, 
            tempTaskInfo.predecessor > 0 
                ? tempTaskInfo.dependencyType 
                    ? tempTaskInfo.dependencyType 
                    : "FS"
                : null
        );
        reCalculateTaskParent(tasks, newTask, selectedTaskIndex-1, selectedTaskIndex);
        validateDependency(tasks, newTask);
        const tasksAfterAdding = selectedTaskIndex > -1
            ? [...tasks.slice(0, selectedTaskIndex), newTask, ...tasks.slice(selectedTaskIndex)]
            : [...tasks, newTask];
        refreshSummaryTasks(tasksAfterAdding);
        setIsDirty(true);
        handleCloseTaskDialog();
    }
    const deleteTaskInfo = (e) => {
        if (selectedTaskIndex > -1) {
            if (confirm(`Do you want to delete this task and its subtasks?`)) {
                const deletedSet = new Set([tasks[selectedTaskIndex].id, ...getDescendants(tasks, tasks[selectedTaskIndex].id).map(d => d.id)]);
                const tasksAfterDeleting = tasks.filter(task => !deletedSet.has(task.id));
                refreshSummaryTasks(tasksAfterDeleting)
                setIsDirty(true);
            }
        }
        setSelectedTaskIndex(-1);
    }
    const saveAllTasks = async () => {
        try {
            if (isMyProject) {
                await taskService.syncTasks(api, projectId, tasks);
                loadTaskTable();
                setIsDirty(false);
            } else {
                await taskService.updateTaskComplete(api, projectId, tasks);
                setIsDirty(false);
            }
            toast.success("Save successfully");
        } catch (error) {}
    }
    const findParent = (level, currentIndex) => {
        if (currentIndex < 0) return null;
        if (level > tasks[currentIndex].level) return tasks[currentIndex];
        return findParent(level, currentIndex-1);
    }
    const outdent = () => {
        const outdentedTask = tasks[selectedTaskIndex] || null;
        if (outdentedTask == null) return;

        const parent = findParent(outdentedTask.level-1, selectedTaskIndex-1);
        outdentedTask.parent = parent;
        // Reassigns parent for the subtasks directly below the selected task.
        // Stop when reaching another task at the same level or higher level than selected task.
        // For tasks exactly one level deeper, set their parentId to the selected task’s id.
        for (let i=selectedTaskIndex+1; i<tasks.length; i++) {
            const taskBelow = tasks[i];
            if (taskBelow.level <= outdentedTask.level) {
                break;
            }
            if (taskBelow.level === outdentedTask.level+1) {
                taskBelow.parent = outdentedTask;
            }
        }
        validateDependency(tasks, outdentedTask);
        refreshSummaryTasks([...tasks]);
        setIsDirty(true);
    }
    const indent = () => {
        const indentedTask = tasks[selectedTaskIndex] || null;
        if (indentedTask == null) return;
        const parent = findParent(indentedTask.level+1, selectedTaskIndex-1);
        indentedTask.parent = parent;
        validateDependency(tasks, indentedTask);
        refreshSummaryTasks([...tasks]);
        setIsDirty(true);
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
            <Row className="pt-4 pb-5">
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
                                <th className={`${style.cell} min_width_100 ${style['cell-header']}`}>Predecessor</th>
                                <th className={`${style.cell} min_width_100 ${style['cell-header']}`}>Effort</th>
                                <th className={`${style.cell} min_width_100 ${style['cell-header']}`}>Total cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task, index) => (
                                    <SortableTask isParent={tasks[index+1]?.level > task.level} key={task.id} task={task} predecessorIndex={tasks.findIndex(t => t.id === task.predecessor?.id)+1} index={index} onSelect={handleTaskSelect} isSelected={selectedTaskIndex === index} onDoubleClick={handleOpenTaskDialog} isMyProject={isMyProject}/>
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