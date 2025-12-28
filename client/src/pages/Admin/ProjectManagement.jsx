import { useCallback, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import ProjectService from "../../services/Admin/ProjectService";
import style from './UserManagement.module.css'
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ProjectManagement = ({api}) => {
    const [projects, setProjects] = useState(null);
    const [pageNumber, setPageNumber] = useState(0);
    const [goPrev, setGoPrev] = useState(false);
    const [goNext, setGoNext] = useState(false);
    useEffect(() => {
        loadProjects();
    }, [pageNumber])
    const loadProjects = async () => {
        try {
            const data = await ProjectService.getProjects(api, pageNumber)
            setProjects(data);
            setGoPrev(!data.first);
            setGoNext(!data.last);
        } catch (error) {
            console.log(error);
            setPageNumber(0);
        }
    }
    const goToPrevPage = useCallback(() => {
        if (goPrev) {
            setPageNumber(prev => prev-1);
        }
    }, [goPrev]);
    const goToNextPage = useCallback(() => {
        if (goNext) {
            setPageNumber(prev => prev+1);
        }
    }, [goNext]);
    return (
        <>
            <Table bordered hover responsive style={{ border: '2px solid #000', borderRadius: 12, overflow: 'hidden' }}>
                <thead style={{ background: '#dddddd' }}>
                    <tr>
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>ID</th>    
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Onwer</th>
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Status</th>
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Currency</th>
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Number of tasks</th>
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Cost</th>
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Number of resources</th>
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Created at</th>
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Updated at</th>
                    </tr>
                </thead>
                <tbody>
                    {projects?.content.map((project) => (
                        <tr key={project.id}>
                            <td style={{ fontSize: 14, textAlign: 'center' }}>{project.id}</td>
                            <td style={{ fontSize: 14, textAlign: 'center' }}>{project.owner}</td>
                            <td style={{ fontSize: 14, textAlign: 'center' }}>{project.status}</td>
                            <td style={{ fontSize: 14, textAlign: 'center' }}>{project.currency}</td>
                            <td style={{ fontSize: 14, textAlign: 'center' }}>{project.taskCount}</td>
                            <td style={{ fontSize: 14, textAlign: 'center' }}>{project.cost}</td>
                            <td style={{ fontSize: 14, textAlign: 'center' }}>{project.resourceCount}</td>
                            <td style={{ fontSize: 14, textAlign: 'center' }}>{project.createdAt}</td>
                            <td style={{ fontSize: 14, textAlign: 'center' }}>{project.updatedAt}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-center align-items-center gap-2">
                <Button variant="" disabled={!goPrev} className={goPrev || `${style["unactive-arrow"]}`} onClick={goToPrevPage}>
                    <FaArrowLeft />
                </Button>
                <Button disabled>{pageNumber+1}</Button>
                <Button variant="" disabled={!goNext} className={goNext || `${style["unactive-arrow"]}`} onClick={goToNextPage}>
                    <FaArrowRight />
                </Button>
            </div>
        </>
    );
}
export default ProjectManagement;