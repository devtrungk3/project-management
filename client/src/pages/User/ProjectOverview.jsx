import { useEffect, useState } from 'react';
import style from './Reports.module.css';
import { Col, Row } from "react-bootstrap";
import reportService from '../../services/User/ReportService';
import { formatDate } from '../../utils/format';
const ProjectOverview = ({api, projectId}) => {
    const [overviewData, setOverviewData] = useState(null);
    useEffect(() => {
        loadOverviewData();
    }, []);
    const loadOverviewData = async () => {
        let data = null;
        try {
            data = await reportService.getProjectOverviewReport(api, projectId);
        } catch (error) {
        }
        setOverviewData(data);
    }
    return (
        <>
            <Row className='mt-3'>
                <Col md={5}>
                    <div className={`${style.title}`}>Project overview</div>
                    <div className={`fs-4 ${style.project_duration}`}>
                        {overviewData?.projectStart ? formatDate(overviewData?.projectStart) : 'None'} - {overviewData?.projectFinish ? formatDate(overviewData?.projectFinish) : 'None'}
                    </div>
                    <div className={`${style.project_complete_container}`}>
                        <div className='position-relative h-75'>
                            <div className={`${style.project_complete_shape} z-1 bg-warning`}></div>
                            <div className='z-2 position-absolute p-2'>
                                <h6 className='opacity-50'>% COMPLETE</h6>
                                <div className='z-2 position-absolute fs-1 fw-medium'>{overviewData?.projectComplete.toFixed(1)}%</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='text-primary mb-1 fw-medium'>UPCOMING MILESTONES</div>
                        <table className={`${style.table} w-100`}>
                            <thead>
                                <tr>
                                    <th className={`${style.cell} ${style.cell_header}`} style={{width: '60%'}}>Name</th>
                                    <th className={`${style.cell} ${style.cell_header}`}>Finish</th>
                                    <th className={`${style.cell} ${style.cell_header}`}>Complete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {overviewData?.upcomingMilestones.map(ms => (
                                    <tr key={ms.id}>
                                        <td className={`${style.cell}`}>{ms.name}</td>
                                        <td className={`${style.cell}`}>{ms.finish}</td>
                                        <td className={`${style.cell}`}>{ms.complete}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Col>
                <Col md={7}>
                    <div className='text-primary mb-1 mt-3 fw-medium'>OVERDUE TASKS</div>
                    <table className={`${style.table} w-100`}>
                        <thead>
                            <tr>
                                <td className={`${style.cell} ${style.cell_header} text-center`}>#</td>
                                <th className={`${style.cell} ${style.cell_header}`}>Name</th>
                                <th className={`${style.cell} ${style.cell_header}`}>Duration</th>
                                <th className={`${style.cell} ${style.cell_header}`}>Finish</th>
                                <th className={`${style.cell} ${style.cell_header}`}>Complete</th>
                                <th className={`${style.cell} ${style.cell_header}`}>Priority</th>
                            </tr>
                        </thead>
                        <tbody>
                            {overviewData?.overdueTasks.map(t => (
                                <tr key={t.id}>
                                    <td className={`${style.cell} text-center`}>{t.arrangement}</td>
                                    <td className={`${style.cell}`}>{t.name}</td>
                                    <td className={`${style.cell}`}>{t.duration} days</td>
                                    <td className={`${style.cell}`}>{t.finish}</td>
                                    <td className={`${style.cell}`}>{t.complete}%</td>
                                    <td className={`${style.cell}`}>{t.priority}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Col>
            </Row>

        </>
    );
}
export default ProjectOverview;