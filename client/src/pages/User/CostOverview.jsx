import { Row, Col } from "react-bootstrap";
import style from './Reports.module.css';
import { useEffect, useState } from "react";
import ReportService from "../../services/User/ReportService";
import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
const CostOverview = ({api, projectId, projectInfo}) => {
    const [reportData, setReportData] = useState(null);
    useEffect(() => {
        loadCostOverview();
    }, []);
    const loadCostOverview = async () => {
        let data = null;
        try {
            data = await ReportService.getCostOverviewReport(api, projectId);
            data.resourceWithCost = Object.entries(data.resourceWithCost).map(([resourceName, cost]) => ({
                resourceName: resourceName,
                cost: cost
            }))
        } catch (error) {}
        setReportData(data);
    }
    return (
        <>
            <Row className='mt-3'>
                <Col md={5}>
                    <div className={`${style.title}`}>Cost overview</div>
                    <div>
                        <div className={`${style.shape_container} bg-light_gray`}>
                            <div className='h-75'>
                                <div className='p-2'>
                                    <h6 className='opacity-75'>PLANNED COST</h6>
                                    <div className='fs-3 fw-medium'>{reportData?.plannedCost || 0}</div>
                                </div>
                            </div>
                        </div>
                        <div className={`${style.shape_container} mt-2 bg-light_gray`}>
                            <div className='h-75'>
                                <div className='p-2'>
                                    <h6 className='opacity-75 m-0'>ACTUAL COST</h6>
                                    <div className='fs-3 fw-medium'>{reportData?.actualCost || 0}</div>
                                    <div className='fs-6 fw-light'>({reportData?.actualCost < reportData?.plannedCost ? '-' : '+'}{reportData?.actualCost - reportData?.plannedCost || 0} vs planned cost)</div>
                                </div>
                            </div>
                        </div>
                        <div className={`${style.shape_container} mt-2 bg-light_gray`}>
                            <div className='h-75'>
                                <div className='p-2'>
                                    <h6 className='opacity-75 m-0'>REMAINING COST</h6>
                                    <div className='fs-3 fw-medium'>{reportData?.remainingCost || 0}</div>
                                    <div className='fs-6 fw-light'>({(reportData?.remainingCost / reportData?.actualCost * 100 || 0).toFixed(2)}% of actual cost)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col md={7}>
                    <div className='text-primary mb-1 mt-3 fw-medium'>RESOURCE COST VARIANCE</div>
                    {reportData?.resourceWithCost
                    ?
                    <ResponsiveContainer width="95%" height={350}>
                        <BarChart
                            data={reportData?.resourceWithCost}
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
                            <Tooltip 
                                formatter={(value, name) => [`${value} ${name}`]} />
                            <Legend 
                                verticalAlign="top"
                                wrapperStyle={{ top: 0 }}
                            />
                            <Bar
                                dataKey="cost" 
                                fill="#768accff"
                                name={projectInfo?.current.currency?.name}
                                maxBarSize={40}
                            >
                                <LabelList 
                                    dataKey="cost" 
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
export default CostOverview;