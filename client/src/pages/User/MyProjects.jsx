import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { FaArrowLeft, FaArrowRight, FaTrash } from "react-icons/fa";
import style from './MyProjects.module.css';
import { useCallback, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import projectService from '../../services/User/ProjectService';
import joinRequestService from '../../services/User/JoinRequestService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatDateTime } from '../../utils/format';

const PROJECT_STATUS_COLORS = {
    "PLANNING": '#bc9995',
    "IN_PROGRESS": '#ffafaf',
    "DONE": '#c8e0fa',
    "CANCELLED": '#547abb'
}

const MyProjects = ({api}) => {
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openJoinNewDialog, setOpenJoinNewDialog] = useState(false);
    const [projectData, setProjectData] = useState(null);
    const [myProjectPageNumber, setMyProjectPageNumber] = useState(0);
    const [joinedProjectPageNumber, setJoinedProjectPageNumber] = useState(0);
    const [statisticsOption , setStatisticsOption] = useState(0);
    const [statisticsData, setStatisticsData] = useState(null);
    const [goPrev, setGoPrev] = useState(false);
    const [goNext, setGoNext] = useState(false);
    const navigate = useNavigate();
    const [projectCreationForm, setProjectCreationForm] = useState({
        'name': '',
        'description': ''
    });
    const [joinedProjectId, setJoinedProjectId] = useState(0);
    useEffect(() => {
        loadProjectTable();
    }, [myProjectPageNumber, joinedProjectPageNumber, statisticsOption]);

    const loadProjectTable = () => {
        (async () => {
            try {
                let data = null;
                if (statisticsOption == 0) {
                    data = await projectService.getAllMyProjects(api, myProjectPageNumber);
                    setProjectData(data);
                } else {
                    data = await projectService.getAllJoinedProjects(api, joinedProjectPageNumber);
                    setProjectData(data);
                }
                if (goPrev !== !data.first) setGoPrev(!data.first);
                if (goNext !== !data.last) setGoNext(!data.last);
            } catch(error) {
                setMyProjectPageNumber(0);
                setJoinedProjectPageNumber(0);
            }
        })();
    }
    const loadProjectStatistics = () => {
        (async () => {
            try {
                let statisticData = null;
                if (statisticsOption == 0) {
                    statisticData = await projectService.getMyProjectStatistics(api);
                    setStatisticsData(statisticData);
                } else {
                    statisticData = await projectService.getJoinedProjectStatistics(api);
                    setStatisticsData(statisticData);
                }
            } catch (error) {}
        })()
    }

    const handleProjectCreationChange = (e) => {
        const { name, value } = e.target;
        setProjectCreationForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    };
    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
    };
    const handleOpenJoinNewDialog = () => {
        setOpenJoinNewDialog(true);
    }
    const handleCloseJoinNewDialog = () => {
        setOpenJoinNewDialog(false);
    }

    const goToPrevPage = useCallback(() => {
        if (goPrev) {
            if (statisticsOption == 0) {
                setMyProjectPageNumber(myProjectPageNumber-1)
            } else {
                setJoinedProjectPageNumber(joinedProjectPageNumber-1)
            }
        }
    }, [goPrev]);
    const goToNextPage = useCallback(() => {
        if (goNext) {
            if (statisticsOption == 0) {
                setMyProjectPageNumber(myProjectPageNumber+1)
            } else {
                setJoinedProjectPageNumber(joinedProjectPageNumber+1)
            }
        }
    }, [goNext]);

    const addNewProject = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formJson = Object.fromEntries(formData.entries());
        const payload = {
            name: formJson.name,
            description: formJson.description,
            status: "PLANNING",
        };
        (async () => {
            try {
                const id = await projectService.addProject(api, payload);
                navigate(`/user/my-projects/${id}`);
            } catch (error) {}
        })();
        handleCloseCreateDialog();
    }
    const joinNewProject = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formJson = Object.fromEntries(formData.entries());
        const payload = {
            projectId: formJson.projectId,
        };
        (async () => {
            try {
                await joinRequestService.addJoinRequest(api, payload);
                toast.success("Make join request successfully");
                setJoinedProjectId(0);
            } catch (error) {}
        })();
        handleCloseJoinNewDialog();
    }
    useEffect(() => {
        loadProjectStatistics();
    }, [statisticsOption]);

    const deleteProject = (id) => {
        if (confirm(`Do you want to delete project ${id}?`)) {
            (async () => {
                try {
                    await projectService.deleteProjectById(api, id);
                    loadProjectTable();
                    loadProjectStatistics();
                } catch (error) {}
            })();
        }
    }

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col md={6}>
                    <Row>
                        <Col md={6}>
                            <Card className={`${style.card} ${statisticsOption || style.active}`} onClick={() => setStatisticsOption(0)}>
                                <Card.Body>
                                    <Card.Title className="fs-4 fw-bold">My projects</Card.Title>
                                    {!statisticsOption ? <Card.Text className="mt-3 fs-4">{projectData ? `Total: ${projectData.totalElements}`: '\u00A0'}</Card.Text> : <Card.Text className="mt-3 fs-4">&nbsp;</Card.Text>}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className={`${style.card} ${statisticsOption && style.active}`} onClick={() => setStatisticsOption(1)}>
                                <Card.Body>
                                    <Card.Title className="fs-4 fw-bold">Joined projects</Card.Title>
                                    {statisticsOption ? <Card.Text className="mt-3 fs-4">{projectData ? `Total: ${projectData.totalElements}`: '\u00A0'}</Card.Text> : <Card.Text className="mt-3 fs-4">&nbsp;</Card.Text>}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="g-4 mt-2">
                        <Col md={3}>
                            <Button className={`${style.button}`} onClick={handleOpenCreateDialog}>
                                Create new
                            </Button>
                        </Col>
                        <Col md={3}>
                            <Button className={`${style.button}`} onClick={handleOpenJoinNewDialog}>
                                Join new
                            </Button>
                        </Col>
                        <Col md={3}>
                            <Button className={`${style.button}`}>
                                Filter
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Card style={{ background: '#f7f7f7', borderRadius: 18 }}>
                        <Card.Body>
                            <Row>
                                <Col md={8}>
                                    { statisticsData &&
                                    <PieChart width={180} height={180}>
                                        <Pie data={statisticsData.statusCounts} cx={90} cy={90} outerRadius={80} dataKey="count" nameKey="status">
                                        {statisticsData.statusCounts.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PROJECT_STATUS_COLORS[entry.status]} />
                                        ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>}
                                </Col>
                                <Col md={4} className="d-flex flex-column justify-content-center">
                                    {
                                        Object.entries(PROJECT_STATUS_COLORS).map(([status, color]) => (
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }} key={status}>
                                                <span style={{ background: `${color}`, width: 22, height: 22, borderRadius:
                                                '50%', display: 'inline-block', marginRight: 7 }}></span>
                                                <span style={{ color: '#181B20', fontWeight: 700, fontSize: 18 }}>{status.replace("_", " ")}</span>
                                            </div>
                                        ))
                                    }
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table bordered hover responsive style={{ border: '2px solid #000', borderRadius: 12, overflow: 'hidden' }}>
                        <thead style={{ background: '#dddddd' }}>
                            <tr>
                                <th style={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>ID</th>    
                                <th style={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>Project name</th>
                                <th style={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>Owner username</th>
                                <th style={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>Status</th>
                                <th style={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>Created at</th>
                                <th style={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>Updated at</th>
                                {statisticsOption == 0 && <th style={{ width: 60 }}>Delete</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {projectData?.content.map((project) => (
                            <tr key={project.id} style={{ verticalAlign: 'middle' }}>
                                <td style={{ fontSize: 18 }}>{project.id}</td>
                                <td style={{ fontSize: 18 }}><a href={statisticsOption == 0 ? `/user/my-projects/${project.id}` : `/user/joined-projects/${project.id}`}>{project.name}</a></td>
                                <td style={{ fontSize: 18 }}>{project.ownerUsername}</td>
                                <td style={{ fontSize: 18 }}>{project.status}</td>
                                <td style={{ fontSize: 16 }}>{formatDateTime(project.createdAt, 'vi-VN')}</td>
                                <td style={{ fontSize: 16 }}>{project?.updatedAt ? formatDateTime(project.updatedAt, 'vi-VN') : 'None'}</td>
                                {statisticsOption == 0 && <td style={{ textAlign: 'center' }}>
                                <Button variant="link" style={{ color: 'red', padding: 0 }} onClick={() => deleteProject(project.id)}>
                                    <FaTrash size={20} />
                                </Button>
                                </td>}
                            </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row className="mb-3">
                <div className="d-flex justify-content-center align-items-center gap-2">
                    <Button variant="" disabled={!goPrev} className={goPrev || `${style["unactive-arrow"]}`} onClick={goToPrevPage}>
                        <FaArrowLeft />
                    </Button>
                    <Button disabled>{statisticsOption == 0 ? myProjectPageNumber+1 : joinedProjectPageNumber+1}</Button>
                    <Button variant="" disabled={!goNext} className={goNext || `${style["unactive-arrow"]}`} onClick={goToNextPage}>
                        <FaArrowRight />
                    </Button>
                </div>
            </Row>
            <Dialog
                open={openCreateDialog}
                onClose={handleCloseCreateDialog}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: addNewProject
                    },
                }}
            >
                <DialogTitle>Create new project</DialogTitle>
                <DialogContent>
                    <TextField
                    autoFocus
                    required
                    fullWidth
                    id="name"
                    name="name"
                    margin="dense"
                    label="Project Name"
                    value={projectCreationForm.name || ''}
                    onChange={handleProjectCreationChange}
                    />
                    <TextField
                    fullWidth
                    margin="dense"
                    id="description"
                    name="description"
                    label="Description"
                    multiline
                    rows={3}
                    value={projectCreationForm.description || ''}
                    onChange={handleProjectCreationChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateDialog}>Cancel</Button>
                    <Button type="submit">Create</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openJoinNewDialog}
                onClose={handleCloseJoinNewDialog}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: joinNewProject
                    },
                }}
            >
                <DialogTitle>Request to join someone else's project</DialogTitle>
                <DialogContent>
                    <TextField
                    autoFocus
                    required
                    fullWidth
                    type="number"
                    id="projectId"
                    name="projectId"
                    margin="dense"
                    label="Project ID"
                    value={joinedProjectId || ''}
                    onChange={(e) => setJoinedProjectId(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseJoinNewDialog}>Cancel</Button>
                    <Button type="submit">Send request</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
export default MyProjects;
