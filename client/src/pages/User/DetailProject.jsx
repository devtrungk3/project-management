import { useEffect, useRef, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import ProjectService from "../../services/User/ProjectService";
import useAuth from "../../hooks/useAuth";
import api, { setAuthHandlers } from '../../utils/axios';
import style from './DetailProject.module.css';
import TaskList from "./TaskList";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { FaAngleLeft } from "react-icons/fa";
import { MdOutlineViewTimeline } from "react-icons/md";
import { HiOutlineChartBar } from "react-icons/hi";
import { TextField } from "@mui/material";
import Resources from "./Resources";
import { formatDateTime } from '../../utils/format';
import Reports from "./Reports";
import currencyService from '../../services/User/CurrencyService';
import { PiGearBold  } from "react-icons/pi";
import ProjectSettings from "./ProjectSettings";
import { toast } from "react-toastify";
import { FiUsers } from "react-icons/fi";
import { HiOutlineChatAlt } from "react-icons/hi";
import { TbAdjustmentsDollar } from "react-icons/tb";
import ChatRoom from "./ChatRoom";
import ExtraCost from "./ExtraCost";

const DetailProject = ({isMyProject}) => {
    const {projectId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [tempProjectInfo, setTempProjectInfo] = useState(null);
    const projectInfo = useRef(null);
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
                const data = await ProjectService.getProjectById(api, projectId, isMyProject);
                projectInfo.current = data;
                setTempProjectInfo(data);
            } catch(error) {
                navigate('/user/my-projects')
            }
        })();
    }
    const updateProjectInfo = async () => {
        try {   
            const data = await ProjectService.updateProject(api, projectId, tempProjectInfo);
            projectInfo.current = data;
            setTempProjectInfo(data);
        } catch (error) {}
    }
    const resetProjectInfo = () => {
        setTempProjectInfo({...projectInfo.current})
    }
    const deleteProject = async () => {
        if (confirm('Do you want to delete this project?')) {
            try {
                await ProjectService.deleteProjectById(api, projectId);
                toast.success("Delete the project successfully");
                navigate('/user/my-projects')
            } catch (error) {}
        }
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
                    <span className='fs-3 fw-bold'>{tempProjectInfo?.name || 'None'}</span>
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
                            value={tempProjectInfo?.name || ''}
                            onChange={(e) => setTempProjectInfo({...tempProjectInfo, name: e.target.value})}
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
                            value={tempProjectInfo?.description || ''}
                            onChange={(e) => setTempProjectInfo({...tempProjectInfo, description: e.target.value})}
                            />
                        </li>}
                        <li>
                            <table className="w-100">
                                <tbody>
                                    {isMyProject === false &&
                                    <tr>
                                        <td colSpan={2} className={`${style["project-info-cell"]}`}>Description:<br/>{tempProjectInfo?.description}</td>
                                    </tr>}
                                    <tr>
                                        <td className='pe-4 py-2'>Owner:</td>
                                        <td className={`${style["project-info-cell"]}`}>{tempProjectInfo?.ownerUsername}</td>
                                    </tr>
                                    <tr>
                                        <td className='pe-4 py-2'>Created&nbsp;at:</td>
                                        <td>{formatDateTime(tempProjectInfo?.createdAt, 'vi-VN')}</td>
                                    </tr>
                                    <tr>
                                        <td className='pe-4 py-2'>Updated&nbsp;at:</td>
                                        <td>{formatDateTime(tempProjectInfo?.updatedAt, 'vi-VN')}</td>
                                    </tr>
                                    <tr>
                                        <td className='pe-4 py-2'>Status:</td>
                                        {isMyProject 
                                        && projectInfo.current?.status != "DONE"
                                        && projectInfo.current?.status != "CANCELLED"
                                        ? <td>
                                            <select id="status_options" value={tempProjectInfo?.status} onChange={(e) => setTempProjectInfo({...tempProjectInfo, status: e.target.value})} className="w-100 py-1">
                                                <option value="PLANNING">PLANNING</option>
                                                <option value="IN_PROGRESS">IN PROGRESS</option>
                                            </select>
                                        </td>
                                        :
                                        <td>{tempProjectInfo?.status}</td>
                                        }
                                    </tr>
                                    <tr>
                                        <td className='pe-4 py-2'>Currency:</td>
                                        {isMyProject 
                                        && projectInfo.current?.status != "DONE"
                                        && projectInfo.current?.status != "CANCELLED"
                                        ? <td>
                                            <select id="currency_options" value={tempProjectInfo?.currency?.id} onChange={(e) => setTempProjectInfo(
                                                {
                                                    ...tempProjectInfo, 
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
                                        <td>{tempProjectInfo?.currency?.name || 'None'}</td>
                                        }
                                    </tr>
                                </tbody>
                            </table>
                        </li>
                        {isMyProject === true && <li className='d-flex justify-content-end mt-4 gap-3'>
                            <Button onClick={resetProjectInfo}>Reset</Button>
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
                            <FiUsers className="fs-2"/>
                        </Link>
                    </Card>}
                    {isMyProject === true && <Card className={`justify-content-center border border-none ${style.nav} ${isActive('extra-costs') === true && style.active}`}>
                        <Link to={`/user/my-projects/${projectId}/extra-costs`} className="text-dark p-2">
                            <TbAdjustmentsDollar className="fs-2"/>
                        </Link>
                    </Card>}
                    {isMyProject === true && <Card className={`justify-content-center border border-none ${style.nav} ${isActive('reports') === true && style.active}`}>
                        <Link to={`/user/my-projects/${projectId}/reports/project-overview`} className="text-dark p-2">
                            <HiOutlineChartBar className="fs-2"/>
                        </Link>
                    </Card>}
                    <Card className={`justify-content-center border border-none ${style.nav} ${isActive('chat') === true && style.active}`}>
                        <Link to={`/user/${isMyProject ? 'my-projects' : 'joined-projects'}/${projectId}/chat`} className="text-dark p-2">
                            <HiOutlineChatAlt className="fs-2"/>
                        </Link>
                    </Card>
                    {isMyProject === true && <Card className={`justify-content-center border border-none ${style.nav} ${isActive('settings') === true && style.active}`}>
                        <Link to={`/user/my-projects/${projectId}/settings`} className="text-dark p-2">
                            <PiGearBold className="fs-2"/>
                        </Link>
                    </Card>}
                </div>
                <div className="content pt-3">
                    <Routes>
                        <Route path="/" element={<TaskList api={api} isMyProject={isMyProject} projectId={projectId} projectInfo={projectInfo} />} />
                        {isMyProject === true &&
                        (<Route path="/resources" element={<Resources api={api} projectId={projectId} />} />)
                        }
                        {isMyProject === true &&
                        (<Route path="/extra-costs" element={<ExtraCost api={api} projectId={projectId} />} />)
                        }
                        {isMyProject === true &&
                        (<Route path="/reports/*" element={<Reports api={api} projectId={projectId} projectInfo={projectInfo} />} />)
                        }
                        <Route path="/chat" element={<ChatRoom api={api} projectId={projectId} />} />
                        {isMyProject === true &&
                        (<Route path="/settings" element={<ProjectSettings api={api} projectId={projectId} setTempProjectInfo={setTempProjectInfo} projectInfo={projectInfo} deleteProject={deleteProject} />} />)
                        }
                        <Route path="*" element={<Navigate to=".." replace />} />
                    </Routes>
                </div>
            </Row>
        </Container>
    );
}
export default DetailProject;