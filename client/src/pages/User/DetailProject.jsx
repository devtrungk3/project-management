import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import projectService from "../../services/User/ProjectService";
import useAuth from "../../hooks/useAuth";
import api, { setAuthHandlers } from '../../utils/axios';
import { toast } from 'react-toastify';
import style from './DetailProject.module.css';
import TaskList from "./TaskList";
import { Button, Col, Container, Row } from "react-bootstrap";
import { FaAngleLeft } from "react-icons/fa";
import { MdChecklist, MdOutlineViewTimeline, MdPeople } from "react-icons/md";
import { HiOutlineChartBar } from "react-icons/hi";
import { TextField } from "@mui/material";
import Resources from "./Resources";
import { formatDateTime } from '../../utils/format';

const DetailProject = ({isMyProject}) => {
    const {projectId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [projectInfo, setProjectInfo] = useState(null);
    const { setAccessToken, setUserRole } = useAuth();
    useEffect(() => {
        setAuthHandlers({
            updateAccessToken: setAccessToken,
            updateUserRole: setUserRole
        });
        loadProjectInformation();
    }, [])
    const isActive = (path) => {
        if (path === 'tasks' && (location.pathname === `/user/${isMyProject ? 'my-projects' : 'joined-projects'}/${projectId}` || location.pathname === `/user/${isMyProject ? 'my-projects' : 'joined-projects'}/${projectId}/`)) return true;
        return location.pathname.startsWith(`/user/${isMyProject ? 'my-projects' : 'joined-projects'}/${projectId}/${path}`);
    }
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
    const updateProjectInfo = async () => {
        try {   
            const data = await projectService.updateProject(api, projectId, projectInfo);
            const updatedAt = data.updatedAt;
            setProjectInfo({...projectInfo, updatedAt: updatedAt})
        } catch (error) {
            toast.error(error.message);
        }
    }

    return(
        <Container fluid className='px-5 py-3'>
            <Row>
                <Col md={2} className={`${style.sidebar} border rounded-3 shadow-sm bg-white d-flex flex-column`}>
                    <Link className='text-decoration-none ms-2 mb-4 d-flex align-items-center gap-2' to={"/user/my-projects"}>
                        <FaAngleLeft/>
                        <span className='fw-medium'>Back to my projects</span>
                    </Link>
                    <Link className={`text-decoration-none ms-2 d-flex align-items-center gap-2 my-1 ${style["sidebar-link"]} ${isActive('tasks') ? style.active : ''}`} to={`/user/${isMyProject ? 'my-projects' : 'joined-projects'}/${projectId}/tasks`}>
                        <MdChecklist />
                        <span className='fw-medium'>Task list</span>
                    </Link>
                    <Link className={`text-decoration-none ms-2 d-flex align-items-center gap-2 my-1 ${style["sidebar-link"]} ${isActive('gantt') ? style.active : ''}`} to={`/user/${isMyProject ? 'my-projects' : 'joined-projects'}/${projectId}/gantt`}>
                        <MdOutlineViewTimeline />
                        <span className='fw-medium'>Gantt chart</span>
                    </Link>
                    {isMyProject === true &&
                    <Link className={`text-decoration-none ms-2 d-flex align-items-center gap-2 my-1 ${style["sidebar-link"]} ${isActive('resources') ? style.active : ''}`} to={`/user/my-projects/${projectId}/resources`}>
                        <MdPeople />
                        <span className='fw-medium'>Resources</span>
                    </Link>
                    }
                    {isMyProject === true &&
                    <Link className={`text-decoration-none ms-2 d-flex align-items-center gap-2 my-1 ${style["sidebar-link"]} ${isActive('report') ? style.active : ''}`} to={`/user/${isMyProject ? 'my-projects' : 'joined-projects'}/${projectId}/report`}>
                        <HiOutlineChartBar />
                        <span className='fw-medium'>Report</span>
                    </Link>
                    }
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
                                            {isMyProject ?
                                            <td>
                                                <select id="options" value={projectInfo?.status} onChange={(e) => setProjectInfo({...projectInfo, status: e.target.value})}>
                                                    <option value="PLANNING">PLANNING</option>
                                                    <option value="IN_PROGRESS">IN PROGRESS</option>
                                                    <option value="DONE">DONE</option>
                                                    <option value="CANCELLED">CANCELLED</option>
                                                </select>
                                            </td>
                                            :
                                            <td>{projectInfo?.status}</td>
                                            }
                                        </tr>
                                    </tbody>
                                </table>
                            </li>
                            {isMyProject === true && <li className='d-flex justify-content-end'>
                                <Button onClick={updateProjectInfo}>Save</Button>
                            </li>}
                        </ul>
                    </div>
                    <div className="content pt-3">
                        <Routes>
                            <Route path="/" element={<TaskList api={api} isMyProject={isMyProject} projectId={projectId} />} />
                            {isMyProject === true &&
                            (<Route path="/resources" element={<Resources api={api} projectId={projectId} />} />)
                            }
                            {/* <Route path="/gantt" element={}/>
                            <Route path="/report" element={}/> */}
                            <Route path="*" element={<Navigate to=".." replace />} />
                        </Routes>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
export default DetailProject;