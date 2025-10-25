import { Row, Col } from "react-bootstrap";
import style from './Reports.module.css';
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ReportService from "../../services/User/ReportService";
import { formatDate } from '../../utils/format';
const UpcomingTasks = ({api, projectId}) => {
    const [reportData, setReportData] = useState({});
    useEffect(() => {
        loadReportData();
    }, []);
    const loadReportData = async () => {
        let data = {};
        try {
            data = await ReportService.getUpcomingTasksReport(api, projectId);
        } catch (error) {
        }
        setReportData(data);
    }
    return (
        <>
            <Row className='mt-3'>
                <Col md={5}>
                    <div className={`${style.title}`}>Upcoming tasks</div>
                    <div>
                        <div className='text-primary mb-1 fw-medium'>TASKS STARTING SOON</div>
                        <table className={`${style.table} w-100`}>
                            <thead>
                                <tr>
                                    <th className={`${style.cell} ${style.cell_header}`} style={{width: '40%'}}>Name</th>
                                    <th className={`${style.cell} ${style.cell_header}`}>Start</th>
                                    <th className={`${style.cell} ${style.cell_header}`}>Finish</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData["tasks_starting_soon"]?.map(ms => (
                                    <tr key={ms.id}>
                                        <td className={`${style.cell}`}>{ms.name}</td>
                                        <td className={`${style.cell}`}>{formatDate(ms.start, 'vi-VN')}</td>
                                        <td className={`${style.cell}`}>{formatDate(ms.finish, 'vi-VN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Col>
                <Col md={7}>
                    <div className='text-primary mb-1 mt-3 fw-medium'>TASKS DUE THIS WEEK</div>
                    {reportData["tasks_due_this_week"]?.length === 0
                    ? <div>No tasks due this week</div>
                    :
                    <ResponsiveContainer width="95%" height={400}>
                        <BarChart
                            data={reportData["tasks_due_this_week"]}
                            margin={{ bottom: 100 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis 
                                allowDecimals={false}
                                tickFormatter={(v) => `${v}%`}
                                ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                                />
                            <Tooltip formatter={(v) => `${v}%`} />
                            <Legend verticalAlign="top"/>
                            <Bar 
                                dataKey="complete" 
                                fill="#768accff"
                                name="Progress"
                                maxBarSize={40}
                            >
                                <LabelList 
                                    dataKey="complete" 
                                    position="top" 
                                    formatter={(v) => `${v}%`}
                                    style={{ fontSize: "12px" }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>}
                </Col>
            </Row>
        </>
    );
}
export default UpcomingTasks;