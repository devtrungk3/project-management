import { MDBCard, MDBCardBody, MDBCardHeader, MDBCardText, MDBCardTitle } from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FaTasks, FaExclamationTriangle } from "react-icons/fa";
import { AiOutlineHourglass } from "react-icons/ai";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import dashboardService from '../../services/User/DashboardService'

const TASK_STATUS_COLORS = {
    "DONE": '#00C49F',
    "IN PROGRESS": '#FFBB28',
    "TODO": '#0088FE'
}
const TASK_PRIORITY_COLORS = {
    "HIGH": '#cf1b1b', 
    "MEDIUM": '#5d1c3e', 
    "LOW": '#403be5'
}
const HomePage = ({api}) => {
    const [overviewData, setOverviewData] = useState(null);
    useEffect(() => {
        (async () => {
            let data = null;
            try {
                data = await dashboardService.getOverview(api);
                data.assignedTaskStatuses = Object.entries(data.assignedTaskStatuses).map(([status, count]) => ({
                    status: status.replaceAll("_", " "),
                    count: count
                }))
                data.assignedTaskPriorities = Object.entries(data.assignedTaskPriorities).map(([priority, count]) => ({
                    priority: priority,
                    count: count
                }))
                data.upcomingTasksIn10Days = Object.entries(data.upcomingTasksIn10Days).map(([date, value]) => ({
                    name: date,
                    value: value
                }));
            } catch(error) {
            }
            setOverviewData(data);
        })();
    }, []);
    return (
        <>
            <Row>
                <Col lg={3}>
                    <MDBCard shadow='sm' background='white' className="mb-4">
                        <MDBCardBody className='text-dark'>
                        <MDBCardTitle>My active tasks</MDBCardTitle>
                        <MDBCardText className="fs-3">{overviewData?.myActiveTasks || 0}</MDBCardText>
                        </MDBCardBody>
                        <div className="position-absolute top-50 end-0 translate-middle-y p-4">
                            <FaTasks className="fs-4" />
                        </div>
                    </MDBCard>
                </Col>
                <Col lg={3}>
                    <MDBCard shadow='sm' background='white' className="mb-4">
                        <MDBCardBody className='text-dark'>
                        <MDBCardTitle>My overdue tasks</MDBCardTitle>
                        <MDBCardText className="fs-3">{overviewData?.myOverdueTasks || 0}</MDBCardText>
                        </MDBCardBody>
                        <div className="position-absolute top-50 end-0 translate-middle-y p-4">
                            <FaExclamationTriangle className="fs-2" />
                        </div>
                    </MDBCard>
                </Col>
                <Col lg={3}>
                    <MDBCard shadow='sm' background='white' className="mb-4">
                        <MDBCardBody className='text-dark'>
                        <MDBCardTitle>Pending requests</MDBCardTitle>
                        <MDBCardText className="fs-3">{overviewData?.pendingIncomingJoinRequests || 0}</MDBCardText>
                        </MDBCardBody>
                        <div className="position-absolute top-50 end-0 translate-middle-y p-4">
                            <AiOutlineHourglass className="fs-2" />
                        </div>
                    </MDBCard>
                </Col>
            </Row>
            <Row>
                <Col lg={4}>
                    <MDBCard shadow='sm' background='white' className="mb-4">
                        <MDBCardHeader background="white">Task status</MDBCardHeader>
                        <MDBCardBody className='text-dark d-flex gap-4'>
                            {overviewData && 
                            <PieChart width={180} height={180}>
                                <Pie data={overviewData.assignedTaskStatuses} cx={90} cy={90} outerRadius={80} dataKey="count" nameKey="status">
                                {overviewData.assignedTaskStatuses.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={TASK_STATUS_COLORS[entry.status]} />
                                ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>}
                            <div className="d-flex flex-column justify-content-center">
                                {overviewData && 
                                overviewData.assignedTaskStatuses.map((entry, index) => (
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }} key={index}>
                                        <span style={{ background: TASK_STATUS_COLORS[entry.status], width: 22, height: 22, borderRadius: '50%', display: 'inline-block', marginRight: 7 }}></span>
                                        <span style={{ color: '#181B20', fontWeight: 700, fontSize: 15 }}>{entry.status}</span>
                                    </div>
                                ))}
                            </div>   
                        </MDBCardBody>
                    </MDBCard>
                    <MDBCard shadow='sm' background='white' className="mb-4">
                        <MDBCardHeader background="white">Task priority distribution</MDBCardHeader>
                        <MDBCardBody className='text-dark d-flex gap-4'>
                            {overviewData &&
                            <PieChart width={180} height={180}>
                                <Pie data={overviewData.assignedTaskPriorities} cx={90} cy={90} outerRadius={80} dataKey="count" nameKey="priority">
                                {overviewData.assignedTaskPriorities.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={TASK_PRIORITY_COLORS[entry.priority]} />
                                ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>}
                            <div className="d-flex flex-column justify-content-center">
                                {overviewData && 
                                overviewData.assignedTaskPriorities.map((entry, index) => (
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }} key={index}>
                                        <span style={{ background: TASK_PRIORITY_COLORS[entry.priority], width: 22, height: 22, borderRadius: '50%', display: 'inline-block', marginRight: 7 }}></span>
                                        <span style={{ color: '#181B20', fontWeight: 700, fontSize: 15 }}>{entry.priority}</span>
                                    </div>
                                ))}  
                            </div>   
                        </MDBCardBody>
                    </MDBCard>
                </Col>
                <Col lg={8}>
                    <MDBCard shadow='sm' background='white'>
                        <MDBCardHeader background="white">Upcoming tasks in next 10 days</MDBCardHeader>
                        <MDBCardBody className='text-dark d-flex gap-4'>
                            <div style={{ width: '100%', height: 460 }}>
                            {overviewData &&
                            <ResponsiveContainer width="95%" height="100%">
                                <BarChart
                                data={overviewData.upcomingTasksIn10Days}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                                >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false}/>
                                <Tooltip />
                                <Legend />
                                <Bar 
                                    dataKey="value" 
                                    fill="#a13c3cff"
                                    name="Number of tasks"
                                />
                                </BarChart>
                            </ResponsiveContainer>}
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </Col>
            </Row>
        </>
    );
}
export default HomePage;