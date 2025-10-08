import { Row, Col, Card, Button } from "react-bootstrap";
import ProjectService from "../../services/User/ProjectService";
import { toast } from "react-toastify";
const ProjectSettings = ({api, projectId, setTempProjectInfo, projectInfo, deleteProject}) => {
    const cancelProject = async () => {
        if (confirm('Do you want to cancel this project?')) {
            try {
                const data = await ProjectService.cancelProject(api, projectId);
                projectInfo.current = data;
                setTempProjectInfo(data);
                toast.success("Cancel project successfully");
            } catch (error) {}
        }
    }
    return (
        <>
            <div className="opacity-75 mt-3">Settings and options for your project</div>
            <Row>
                <Col xl={7}>
                    <div className="fs-3 mt-3">Danger zone</div>
                    <Card>
                        { projectInfo.status != "CANCELLED" && (
                            <div>
                                <Row className="px-4 py-3">
                                    <Col md={8}>
                                        <div className="fw-bold">Cancel this project</div>
                                        <div className="text-secondary">Cancelling this project will stop all ongoing activities and cannot be undone.</div>                            
                                    </Col>
                                    <Col md={4} className="d-flex justify-content-end align-items-center">
                                    <span className="">
                                        <Button className="btn btn-danger" onClick={cancelProject}>Cancel project</Button>
                                    </span>
                                    </Col>
                                </Row>
                                <hr className="p-0 m-0"/>                                
                            </div>
                        )}
                        <Row className="px-4 py-3">
                            <Col md={8}>
                                <div className="fw-bold">Delete this project</div>
                                <div className="text-secondary">Once you delete a project, there is no going back. Please be certain.</div>                            
                            </Col>
                            <Col md={4} className="d-flex justify-content-end align-items-center">
                            <span className="">
                                <Button className="btn btn-danger" onClick={deleteProject}>Delete project</Button>
                            </span>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
export default ProjectSettings;