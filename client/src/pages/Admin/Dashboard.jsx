import { MDBCard, MDBCardBody, MDBCardText, MDBCardTitle } from "mdb-react-ui-kit";
import { Col, Row } from "react-bootstrap";
import { Cell, Pie, PieChart, Tooltip as RechartsTooltip } from "recharts";
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartToolTip, Legend as ChartLegend, CategoryScale, LinearScale, PointElement, LineElement, Title, } from 'chart.js';
import { useEffect, useState } from "react";
import dashboardService from "../../services/Admin/DashboardService";

ChartJS.register(ArcElement, ChartToolTip, ChartLegend, CategoryScale, LinearScale, PointElement, LineElement, Title);
const PROJECT_STATUS_COLORS = {
    "PLANNING": '#bc9995',
    "IN_PROGRESS": '#ffafaf',
    "DONE": '#c8e0fa',
    "CANCELLED": '#547abb'
}
const Dashboard = ({api}) => {
    const [userSummary, setUserSummary] = useState(null);
    const [projectSummary, setProjectSummary] = useState(null);
    const [taskSummary, setTaskSummary] = useState(null);
    useEffect(() => {
        (async () => {
            let userStatsData = null;
            try {
                userStatsData = await dashboardService.getUserStats(api);
                userStatsData.activeRate = userStatsData?.activeUsers * 100 / userStatsData?.totalUsers;
                userStatsData.inactiveRate = userStatsData?.inactiveUsers * 100 / userStatsData?.totalUsers;
            } catch (error) {
            }
            setUserSummary(userStatsData);
        })();
        (async () => {
            let projectStatsData = null;
            try {
                projectStatsData = await dashboardService.getProjectStats(api);
                projectStatsData.completedRate = projectStatsData?.completedProjects * 100 / projectStatsData?.totalProjects;
                projectStatsData.cancelledRate = projectStatsData?.cancelledProjects * 100 / projectStatsData?.totalProjects;
                projectStatsData.newProjectInYearLabels = Object.keys(projectStatsData.newProjectInYear);
                projectStatsData.newProjectInYearValues = Object.values(projectStatsData.newProjectInYear);
            } catch (error) {
            }
            setProjectSummary(projectStatsData);
        })();
        (async () => {
            let taskStatsData = null;
            try {
                taskStatsData = await dashboardService.getTaskStats(api);
                taskStatsData.completedRate = taskStatsData?.completedTasks * 100 / taskStatsData?.totalTasks;
                taskStatsData.overdueRate = taskStatsData?.overdueTasks * 100 / taskStatsData?.totalTasks;
            } catch (error) {
            }
            setTaskSummary(taskStatsData);
        })();
    }, [])
    const success_rate_data = {
        labels: ['Completed', 'Remaining'],
        datasets: [
        {
            data: [projectSummary?.successRate || 0, 100-projectSummary?.successRate || 0],
            backgroundColor: ['#36A2EB', '#dc5f5f'],
            borderWidth: 0,
            circumference: 180,
            rotation: -90,
        },
        ],
    };

    const success_rate_options = {
        circumference: 180,
        rotation: -90,
        cutout: '70%',
        plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            enabled: false,
        },
        },
        maintainAspectRatio: false,
    };
    const chartData = {
        labels: projectSummary?.newProjectInYearLabels || [],
        datasets: [
        {
            label: 'New project',
            data: projectSummary?.newProjectInYearValues || [],
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.1,
        },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
        legend: {
            position: 'top',
        },

        },
        scales: {
        y: {
            beginAtZero: true,
            title: {
            display: true,
            text: 'Number of projects',
            },
            ticks: {
                stepSize: 1,
            },
        },
        x: {
            title: {
            display: true,
            text: 'Months',
            },
        },
        },
    };
    return (
      <>
        <Row>
            <Col lg={8}>
                <Row>
                    <Col lg={4}>
                        <MDBCard shadow='sm' background='info' className="mb-4">
                            <MDBCardBody className='text-dark'>
                            <MDBCardTitle>TOTAL USERS: {userSummary?.totalUsers || 0}</MDBCardTitle>
                            <hr/>
                            <MDBCardText>
                                Active: {userSummary?.activeUsers || 0} ({userSummary?.activeRate.toFixed(1) || 0}%)<br/>
                                Inactive: {userSummary?.inactiveUsers || 0} ({userSummary?.inactiveRate.toFixed(1) || 0}%)
                            </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </Col>
                    <Col lg={4}>
                        <MDBCard shadow='sm' className="mb-4" style={{ backgroundColor: '#c1db2c'}}>
                            <MDBCardBody className='text-dark'>
                            <MDBCardTitle>TOTAL PROJECTS: {projectSummary?.totalProjects || 0}</MDBCardTitle>
                            <hr/>
                            <MDBCardText>
                                Completed: {projectSummary?.completedProjects || 0} ({projectSummary?.completedRate.toFixed(1) || 0}%)<br/>
                                Cancelled: {projectSummary?.cancelledProjects || 0} ({projectSummary?.cancelledRate.toFixed(1) || 0}%)
                            </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </Col>                
                    <Col lg={4}>
                        <MDBCard shadow='sm' className="mb-4" style={{ backgroundColor: '#f2ff66' }}>
                            <MDBCardBody className='text-dark'>
                            <MDBCardTitle>TOTAL TASKS: {taskSummary?.totalTasks || 0}</MDBCardTitle>
                            <hr/>
                            <MDBCardText>
                                Completed: {taskSummary?.completedTasks || 0} ({taskSummary?.completedRate.toFixed(1) || 0}%)<br/>
                                Overdue: {taskSummary?.overdueTasks || 0} ({taskSummary?.overdueRate.toFixed(1) || 0}%)
                            </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </Col>
                </Row>
            </Col>
            <Col lg={4}>
                <MDBCard shadow='sm' className="mb-4" style={{ backgroundColor: '#b2a1d6' }}>
                    <MDBCardBody className='text-dark'>
                    <MDBCardTitle>RECENT TREND (vs 30 days ago)</MDBCardTitle>
                    <hr/>
                    <MDBCardText>
                        New users: {userSummary?.userGrowthCount || 0} (+{userSummary?.userGrowthRate.toFixed(1) || 0}%)<br/>
                        New projects: {projectSummary?.projectGrowthCount || 0} (+{projectSummary?.projectGrowthRate.toFixed(1) || 0}%)<br/>
                    </MDBCardText>
                    </MDBCardBody>
                </MDBCard>
            </Col>
        </Row>
        <div>
            <div className="position-relative fs-4 fw-bold text-center">
                <hr className="position-absolute w-100 z-0"/>
                <span className="position-relative d-inline-block px-3 bg-white z-1 fs-4 fw-bold pb-4">PROJECT STATISTICS</span>
            </div>
            <Row>
                <Col lg={8}>
                    <div className="w-100 h-100 text-center shadow shadow-1 px-5 py-3 rounded-3 border border-1">
                        <h5 className="text-primary">NEW PROJECT TREND IN 2025</h5>
                        <Line data={chartData} options={lineChartOptions} />
                    </div>
                </Col>
                <Col lg={4}>
                    <div className="w-100 h-100 shadow shadow-1 py-3 rounded-3 border border-1">
                        <h5 className="text-center text-primary">TOP PROJECT MANAGER</h5>
                        <div className="my-4 d-flex flex-column gap-3">
                            <div className="d-flex border-bottom border-1 pb-2 border-secondary border-opacity-25">
                                <div className="width_15 text-center fw-medium">#</div>
                                <div className="width_55 flex-fill text-break fw-medium">Username</div>
                                <div className="width_30 text-center fw-medium">Projects</div>
                            </div>
                            {projectSummary?.topProjectManager.map((pm, index) =>
                                (<div className="d-flex" key={index}>
                                    <div className="width_15 text-center text-success">{index+1}</div>
                                    <div className="width_55 flex-fill text-break text-success">{pm.username}</div>
                                    <div className="width_30 text-center text-success">{pm.projectCount}</div>
                                </div>)
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col lg={6}>
                    <div className="w-100 h-100 text-center shadow shadow-1 py-3 rounded-3 border border-1">
                        <h5 className="text-primary">SUCCESS RATE</h5>
                        <div style={{ width: '250px', height: '150px', margin: '0 auto' }}>
                            <Doughnut data={success_rate_data} options={success_rate_options} />
                            <div style={{ textAlign: 'center', marginTop: '-50px', color: '#000' }}>
                                {projectSummary?.successRate || 0}%  
                            </div>
                        </div>
                    </div>
                </Col>
                <Col lg={6}>
                    <div className="w-100 h-100 px-3 text-center shadow shadow-1 py-3 rounded-3 border border-1">
                        <h5 className="text-primary">STATUS DISTRIBUTION</h5>
                        <Row>
                            <Col md={6}>
                                <PieChart width={180} height={180}>
                                    <Pie data={projectSummary?.statusCounts} cx={90} cy={90} outerRadius={80} dataKey="count" nameKey="status">
                                    {projectSummary?.statusCounts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PROJECT_STATUS_COLORS[entry.status]} />
                                    ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </Col>
                            <Col md={6} className="d-flex flex-column justify-content-center">
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
                    </div>
                </Col>
            </Row>
        </div>
      </>
    );
}
export default Dashboard;