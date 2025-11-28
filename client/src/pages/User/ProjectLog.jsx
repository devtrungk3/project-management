import { useCallback, useEffect, useRef, useState } from 'react';
import style from './DetailProject.module.css';
import LogService from '../../services/User/LogService';
import { Button } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import style2 from './ProjectLog.module.css';
import { formatDateTime } from '../../utils/format';
const ProjectLog = ({api, projectId}) => {
    const [logData, setLogData] = useState(null);
    const [goPrev, setGoPrev] = useState(false);
    const [goNext, setGoNext] = useState(false);
    const pageNumber = useRef(0);
    useEffect(() => {
        loadLogData();
    }, [])
    const loadLogData = async () => {
        let data;
        try {
            data = await LogService.getActionLog(api, projectId, pageNumber.current);
            if (goPrev !== !data.first) setGoPrev(!data.first);
            if (goNext !== !data.last) setGoNext(!data.last);
        } catch (error) {
            console.log(error);
        }
        setLogData(data);
    }
    const goToPrevPage = useCallback(() => {
        if (goPrev) {
            pageNumber.current -= 1;
            loadLogData();
        }
    }, [goPrev]);
    const goToNextPage = useCallback(() => {
        if (goNext) {
            pageNumber.current += 1;
        }
        loadLogData();
    }, [goNext]);
    return (
        <>
            <div className="overflow-auto">
                <div className="fs-4 mb-3">Action log</div>
                <table className={`${style.table} mt-4`}>
                    <thead>
                        <tr>
                            <th className={`${style.cell} ${style['cell-header']}`}>Action type</th>
                            <th className={`${style.cell} ${style['cell-header']}`}>Actor ID</th>
                            <th className={`${style.cell} ${style['cell-header']}`}>Actor username</th>
                            <th className={`${style.cell} ${style['cell-header']}`}>Description</th>
                            <th className={`${style.cell} ${style['cell-header']}`}>Logged at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logData?.content.map((record) => 
                            <tr key={record.id}>
                                <td className={style.cell}>{record.actionType}</td>
                                <td className={style.cell}>{record.actor.userId}</td>
                                <td className={style.cell}>{record.actor.username}</td>
                                <td className={style.cell}>{record.description}</td>
                                <td className={style.cell}>{formatDateTime(new Date(record.createdAt), 'vi-VN')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="my-4">
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <Button variant="" disabled={!goPrev} className={goPrev || `${style2["unactive-arrow"]}`} onClick={goToPrevPage}>
                            <FaArrowLeft />
                        </Button>
                        <Button disabled>{pageNumber.current+1}</Button>
                        <Button variant="" disabled={!goNext} className={goNext || `${style2["unactive-arrow"]}`} onClick={goToNextPage}>
                            <FaArrowRight />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
export default ProjectLog;