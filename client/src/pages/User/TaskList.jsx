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
import { Dialog, DialogActions, DialogContent, TextField } from "@mui/material";
import TaskDialog from "../../components/TaskDialog";
import { FaPlus, FaTrash } from "react-icons/fa";
import style from './DetailProject.module.css';
import { Button, Col, Row } from "react-bootstrap";
import { toast } from 'react-toastify';
import GanttChart from "../../components/GanttChart";

const TaskList = ({api, projectId, isMyProject}) => {
    const [tasks, setTasks] = useState([]);
    const [resources, setResources] = useState(null);
    const [openTaskDialog, setOpenTaskDialog] = useState(0);
    const [tempTaskInfo, setTempTaskInfo] = useState(null);
    const [isAddDialog, setIsAddDialog] = useState(null);
    const [taskIdSelected, setTaskIdSelected] = useState(0);
    useEffect(() => {
        loadTaskTable();
        loadResourceList();
    }, [])
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
            } catch(error) {
                toast.error(error.message);
            }
        })();
    }
    const loadResourceList = () => {
        (async () => {
            try {
                const data = await resourceService.getAllResources(api, projectId);
                setResources(data);
            } catch(error) {
                toast.error(error.message);
            }
        })();
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
                finish: currentDate,
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
        setTasks(prev => prev.map(task => task.id === tempTaskInfo.id ? tempTaskInfo : task));
        handleCloseTaskDialog();
    }
    const addNewTaskInfo = (e) => {
        e.preventDefault();
        setTasks(prev => [...prev, tempTaskInfo])
        handleCloseTaskDialog();
    }
    const deleteTaskInfo = (e) => {
        if (taskIdSelected != 0) {
            if (confirm(`Are you sure?`)) {
                setTasks(tasks.filter(task => task.id != taskIdSelected))
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
            toast.success("Save successfully")
        } catch (error) {
            toast.error(error.message);
        }
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
                                <th className={`${style.cell} ${style['cell-header']}`}></th>
                                <th className={`${style.cell} ${style['cell-header']} text-center`}>#</th>
                                <th className={`${style.cell} ${style['cell-header']}`}>Name</th>
                                <th className={`${style.cell} ${style['cell-header']}`}>Effort</th>
                                <th className={`${style.cell} ${style['cell-header']}`}>Owners</th>
                                <th className={`${style.cell} ${style['cell-header']}`}>Duration</th>
                                <th className={`${style.cell} ${style['cell-header']}`}>Start</th>
                                <th className={`${style.cell} ${style['cell-header']}`}>Finish</th>
                                <th className={`${style.cell} ${style['cell-header']}`}>Complete</th>
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
            {isMyProject ?
            <TaskDialog openTaskDialog={openTaskDialog} handleCloseTaskDialog={handleCloseTaskDialog} tempTaskInfo={tempTaskInfo} setTempTaskInfo={setTempTaskInfo} resources={resources} onSubmit={isAddDialog === true ? addNewTaskInfo : isAddDialog === false ? changeTaskInfo : (e)=>{e.preventDefault();}} />
            :
            <Dialog
                sx={{
                    '& .MuiDialog-paper': {
                        width: '1000px',
                        maxWidth: 'none'
                    }
                }}
                open={openTaskDialog != 0}
                onClose={handleCloseTaskDialog}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: changeTaskInfo
                    },
                }}
            >
                <DialogContent>
                        <TextField
                        fullWidth
                        margin="dense"
                        id="complete"
                        name="complete"
                        label="Complete %"
                        type="number"
                        inputProps={{ min: 0, max: 100 }}
                        value={tempTaskInfo?.complete || ''}
                        onChange={(e) => setTempTaskInfo({...tempTaskInfo, complete: e.target.value})}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTaskDialog}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </Dialog>
            }  
        </>
    )
}
export default TaskList;