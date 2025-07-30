import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import projectService from "../../services/User/ProjectService";
import taskService from "../../services/User/TaskService";
import resourceService from "../../services/User/ResourceService";
import useAuth from "../../hooks/useAuth";
import api, { setAuthHandlers } from '../../utils/axios';
import { toast } from 'react-toastify';
import style from './DetailProject.module.css';
import SortableTask from "../../components/SortableTask";
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
import { Button, Col, Container, Row } from "react-bootstrap";
import { FaAngleLeft, FaPlus, FaTrash } from "react-icons/fa";
import { MdChecklist, MdOutlineViewTimeline, MdPeople } from "react-icons/md";
import { HiOutlineChartBar } from "react-icons/hi";
import { TextField } from "@mui/material";
import TaskDialog from "../../components/TaskDialog";

const DetailProject = ({isMyProject}) => {
    const {projectId} = useParams();
    const navigate = useNavigate();
    const [projectInfo, setProjectInfo] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [resources, setResources] = useState(null);
    const { setAccessToken, setUserRole } = useAuth();
    const [taskIdSelected, setTaskIdSelected] = useState(0);
    const [openTaskDialog, setOpenTaskDialog] = useState(0);
    const [tempTaskInfo, setTempTaskInfo] = useState(null);
    const [isAddDialog, setIsAddDialog] = useState(null);
    useEffect(() => {
        setAuthHandlers({
            updateAccessToken: setAccessToken,
            updateUserRole: setUserRole
        });
        loadProjectInformation();
        loadTaskTable();
        loadResourceList();
    }, [])
    const loadProjectInformation = () => {
        (async () => {
            try {
                const data = await projectService.getProjectById(api, projectId, isMyProject);
                setProjectInfo(data);
            } catch(error) {
                toast.error(error.message);
                navigate('/user/my-projects')
            }
        })();
    }
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
                navigate('/user/my-projects')
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
        if (isMyProject) {
            try {
                await taskService.syncTasks(api, projectId, tasks);
                toast.success("Save successfully")
                loadTaskTable()
            } catch (error) {
                toast.error(error.message);
            }
        } else {
            //TODO
        }
    }

    const updateProjectInfo = async () => {
        try {   
            const data = await projectService.updateProject(api, projectId, projectInfo);
            const updatedAt = data.updatedAt;
            setProjectInfo({...projectInfo, updatedAt: updatedAt})
        } catch (error) {
            toast.error(error.message);
        }
    }
    const formatDateTime = (isoString) => {
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

    return(
        <Container fluid className='px-5 py-3'>
            <Row>
                <Col md={2} className={`${style.sidebar} border rounded-3 shadow-sm bg-white d-flex flex-column`}>
                    <Link className='text-decoration-none ms-2 mb-4 d-flex align-items-center gap-2' to={"/user/my-projects"}>
                        <FaAngleLeft/>
                        <span className='fw-medium'>Back to my projects</span>
                    </Link>
                    <Link className='text-decoration-none ms-2 d-flex align-items-center gap-2 my-1'>
                        <MdChecklist />
                        <span className='fw-medium'>Task list</span>
                    </Link>
                    <Link className='text-decoration-none ms-2 d-flex align-items-center gap-2 my-1'>
                        <MdPeople />
                        <span className='fw-medium'>Resource</span>
                    </Link>
                    <Link className='text-decoration-none ms-2 d-flex align-items-center gap-2 my-1'>
                        <MdOutlineViewTimeline />
                        <span className='fw-medium'>Gantt chart</span>
                    </Link>
                    <Link className='text-decoration-none ms-2 d-flex align-items-center gap-2 my-1'>
                        <HiOutlineChartBar />
                        <span className='fw-medium'>Report</span>
                    </Link>
                </Col>
                <Col md={10}>
                    <div className="d-inline-flex dropdown pt-3">
                        <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="userDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        >
                        <span className='fs-3 fw-bold'>{projectInfo?.name || 'None'}</span>
                        </a>
                        <ul
                        className="dropdown-menu dropdown-menu px-3 py-3 shadow-sm"
                        style={{minWidth: '450px'}}
                        aria-labelledby="userDropdown"
                        onClick={(e) => {e.stopPropagation()}}
                        >
                            {isMyProject === true &&
                            <li>
                                <TextField
                                fullWidth
                                margin="dense"
                                id="name"
                                name="name"
                                label="Name"
                                value={projectInfo?.name || ''}
                                onChange={(e) => setProjectInfo({...projectInfo, name: e.target.value})}
                                />
                            </li>}
                            {isMyProject === true && 
                            <li>
                                <TextField
                                fullWidth
                                margin="dense"
                                id="description"
                                name="description"
                                label="Description"
                                multiline
                                rows={4}
                                value={projectInfo?.description || ''}
                                onChange={(e) => setProjectInfo({...projectInfo, description: e.target.value})}
                                />
                            </li>}
                            <li>
                                <table>
                                    <tbody>
                                        {isMyProject === false &&
                                        <tr>
                                            <td colSpan={2} className={`${style["project-info-cell"]}`}>Description:<br/>{projectInfo?.description}</td>
                                        </tr>}
                                        <tr>
                                            <td className='pe-4 py-2'>Owner:</td>
                                            <td className={`${style["project-info-cell"]}`}>{projectInfo?.ownerUsername}</td>
                                        </tr>
                                        <tr>
                                            <td className='pe-4 py-2'>Created&nbsp;at:</td>
                                            <td>{formatDateTime(projectInfo?.createdAt)}</td>
                                        </tr>
                                        <tr>
                                            <td className='pe-4 py-2'>Updated&nbsp;at:</td>
                                            <td>{formatDateTime(projectInfo?.updatedAt)}</td>
                                        </tr>
                                        <tr>
                                            <td className='pe-4 py-2'>Status:</td>
                                            <td>
                                                <select id="options" value={projectInfo?.status} onChange={(e) => setProjectInfo({...projectInfo, status: e.target.value})}>
                                                    <option value="PLANNING">PLANNING</option>
                                                    <option value="IN_PROGRESS">IN PROGRESS</option>
                                                    <option value="DONE">DONE</option>
                                                    <option value="CANCELLED">CANCELLED</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </li>
                            {isMyProject === true && <li className='d-flex justify-content-end'>
                                <Button onClick={updateProjectInfo}>Save</Button>
                            </li>}
                        </ul>
                    </div>
                    <div className='pt-3'>
                        <div className="d-flex justify-content-between">
                            {isMyProject === true 
                            ?
                            <div className="d-flex gap-5">
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
                    <div className="pt-4">
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
                                            <SortableTask key={task.id} task={task} index={index} onSelect={handleTaskSelect} isSelected={taskIdSelected === task.id} onDoubleClick={handleOpenTaskDialog}/>
                                        ))}
                                    </tbody>
                                </table>
                            </SortableContext>
                        </DndContext>
                    </div>
                </Col>
            </Row>
            <TaskDialog openTaskDialog={openTaskDialog} handleCloseTaskDialog={handleCloseTaskDialog} tempTaskInfo={tempTaskInfo} setTempTaskInfo={setTempTaskInfo} resources={resources} onSubmit={isAddDialog === true ? addNewTaskInfo : isAddDialog === false ? changeTaskInfo : (e)=>{e.preventDefault();}} />
        </Container>
    );
}
export default DetailProject;