import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import projectService from "../../services/User/ProjectService";
import useAuth from "../../hooks/useAuth";
import api, { setAuthHandlers } from '../../utils/axios';
import style from './DetailProject.module.css';
import TaskList from "./TaskList";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { FaAngleLeft } from "react-icons/fa";
import { MdOutlineViewTimeline, MdPeople } from "react-icons/md";
import { HiOutlineChartBar } from "react-icons/hi";
import { TextField } from "@mui/material";
import Resources from "./Resources";
import { formatDateTime } from '../../utils/format';
import Reports from "./Reports";
import currencyService from '../../services/User/CurrencyService';

const DetailProject = ({isMyProject}) => {
    const {projectId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [projectInfo, setProjectInfo] = useState(null);
    const [currencies, setCurrencies] = useState(null);
    const { logout, setAccessToken, setUserRole } = useAuth();
    useEffect(() => {
        setAuthHandlers({
            logout,
            updateAccessToken: setAccessToken,
            updateUserRole: setUserRole
        });
        loadProjectInformation();
        loadCurrencies();
    }, [])
    const loadCurrencies = async () => {
        let data = null;
        try {
            data = await currencyService.getAllCurrencies(api);
        } catch (error) {}
        setCurrencies(data);
    }
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
                navigate('/user/my-projects')
            }
        })();
    }
    const updateProjectInfo = async () => {
        try {   
            const data = await projectService.updateProject(api, projectId, projectInfo);
            const updatedAt = data.updatedAt;
            setProjectInfo({...projectInfo, updatedAt: updatedAt})
        } catch (error) {}
    }

    return(
        <Container fluid className='px-5'>
            <Row>
                <Col className="my-4">
                <Link className='text-decoration-none py-3' to={"/user/my-projects"}>
                    <FaAngleLeft className="fs-3"/>
                    <span className='fw-medium'>Back to my projects</span>
                </Link>
                </Col>
                <div className="d-inline-flex dropdown pt-2 gap-3">
                    {/* project information dropdown */}
                    <a
                    className={`nav-link dropdown-toggle ${style.project_name}`}
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
                            <table className="w-100">
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
                                            <select id="status_options" value={projectInfo?.status} onChange={(e) => setProjectInfo({...projectInfo, status: e.target.value})} className="w-100 py-1">
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
                                    <tr>
                                        <td className='pe-4 py-2'>Planned budget:</td>
                                        {isMyProject ?
                                        <td>
                                            <input type="number" className="w-100" value={projectInfo?.plannedBudget || 0} min={0} onChange={(e) => setProjectInfo({
                                                ...projectInfo,
                                                plannedBudget: e.target.value
                                            })} />
                                        </td>
                                        :
                                        <td>{projectInfo?.plannedBudget || '0'}</td>
                                        }
                                    </tr>
                                    <tr>
                                        <td className='pe-4 py-2'>Currency:</td>
                                        {isMyProject ?
                                        <td>
                                            <select id="currency_options" value={projectInfo?.currency?.id} onChange={(e) => setProjectInfo(
                                                {
                                                    ...projectInfo, 
                                                    currency: {id: e.target.value}
                                                }
                                            )} className="w-100 py-1">
                                                <option key={0} value={0}>None</option>
                                                {currencies?.map(currency => 
                                                    <option key={currency.id} value={currency.id}>{currency.name}</option>
                                                )}
                                            </select>
                                        </td>
                                        :
                                        <td>{projectInfo?.currency?.name || 'None'}</td>
                                        }
                                    </tr>
                                </tbody>
                            </table>
                        </li>
                        {isMyProject === true && <li className='d-flex justify-content-end mt-4'>
                            <Button onClick={updateProjectInfo}>Save</Button>
                        </li>}
                    </ul>
                    <Card className={`justify-content-center border border-none ${style.nav} ${isActive('tasks') === true && style.active}`}>
                        <Link to={`/user/${isMyProject ? 'my-projects' : 'joined-projects'}/${projectId}`} className="text-dark p-2">
                            <MdOutlineViewTimeline className="fs-2"/>
                        </Link>
                    </Card>
                    {isMyProject === true && <Card className={`justify-content-center border border-none ${style.nav} ${isActive('resources') === true && style.active}`}>
                        <Link to={`/user/my-projects/${projectId}/resources`} className="text-dark p-2">
                            <MdPeople className="fs-2"/>
                        </Link>
                    </Card>}
                    {isMyProject === true && <Card className={`justify-content-center border border-none ${style.nav} ${isActive('reports') === true && style.active}`}>
                        <Link to={`/user/my-projects/${projectId}/reports/project-overview`} className="text-dark p-2">
                            <HiOutlineChartBar className="fs-2"/>
                        </Link>
                    </Card>}
                </div>
                <div className="content pt-3">
                    <Routes>
                        <Route path="/" element={<TaskList api={api} isMyProject={isMyProject} projectId={projectId} />} />
                        {isMyProject === true &&
                        (<Route path="/resources" element={<Resources api={api} projectId={projectId} />} />)
                        }
                        {isMyProject === true &&
                        (<Route path="/reports/*" element={<Reports api={api} projectId={projectId} />} />)
                        }
                        <Route path="*" element={<Navigate to=".." replace />} />
                    </Routes>
                </div>
            </Row>
        </Container>
    );
}
export default DetailProject;