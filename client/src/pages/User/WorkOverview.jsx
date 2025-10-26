import { Row, Col } from "react-bootstrap"
import style from "./Reports.module.css"
import ReportService from "../../services/User/ReportService";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
const WorkOverview = ({api, projectId}) => {
    const [reportData, setReportData] = useState(null);
    useEffect(() => {
        loadWorkOverview();
    }, []);
    const loadWorkOverview = async () => {
        let data = null;
        try {
            data = await ReportService.getWorkOverviewReport(api, projectId);
            data.resourceWithEffort = Object.entries(data.resourceWithEffort).map(([resourceName, effort]) => ({
                resourceName: resourceName,
                effort: effort
            }))
        } catch (error) {}
        setReportData(data);
    }
    return (
        <>
            <Row className='mt-3'>
                <Col md={5}>
                    <div className={`${style.title}`}>Work overview</div>
                    <div>
                        <div className={`${style.shape_container} bg-light_gray`}>
                            <div className='h-75'>
                                <div className='p-2'>
                                    <h6 className='opacity-75'>PLANNED EFFORT</h6>
                                    <div className='fs-3 fw-medium'>{reportData?.plannedEffort || 0}</div>
                                </div>
                            </div>
                        </div>
                        <div className={`${style.shape_container} mt-2 bg-light_gray`}>
                            <div className='h-75'>
                                <div className='p-2'>
                                    <h6 className='opacity-75 m-0'>ACTUAL EFFORT</h6>
                                    <div className='fs-3 fw-medium'>{reportData?.actualEffort || 0}</div>
                                    <div className='fs-6 fw-light'>({reportData?.actualEffort < reportData?.plannedEffort ? '-' : '+'}{reportData?.actualEffort - reportData?.plannedEffort || 0} vs planned effort)</div>
                                </div>
                            </div>
                        </div>
                        <div className={`${style.shape_container} mt-2 bg-light_gray`}>
                            <div className='h-75'>
                                <div className='p-2'>
                                    <h6 className='opacity-75 m-0'>REMAINING EFFORT</h6>
                                    <div className='fs-3 fw-medium'>{reportData?.remainingEffort || 0}</div>
                                    <div className='fs-6 fw-light'>({(reportData?.remainingEffort / reportData?.actualEffort * 100 || 0).toFixed(2)}% of actual effort)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col md={7}>
                    <div className='text-primary mb-1 mt-3 fw-medium'>RESOURCE EFFORT VARIANCE</div>
                    {reportData?.resourceWithEffort
                    ?
                    <ResponsiveContainer width="95%" height={350}>
                        <BarChart
                            data={reportData?.resourceWithEffort}
                            margin={{ bottom: 10, top: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="resourceName"
                                angle={-30}
                                textAnchor="end"
                                height={80}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis/>
                            <Tooltip />
                            <Legend 
                                verticalAlign="top"
                                wrapperStyle={{ top: 0 }}
                            />
                            <Bar
                                dataKey="effort" 
                                fill="#768accff"
                                maxBarSize={40}
                            >
                                <LabelList
                                    dataKey="effort" 
                                    position="top"
                                    style={{ fontSize: "12px" }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    : <div>No available resource</div>}
                </Col>
            </Row>
        </>
    );
}
export default WorkOverview;