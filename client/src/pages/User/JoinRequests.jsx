import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight, FaCheck, FaXmark } from "react-icons/fa6";
import style from './JoinRequests.module.css';
import { useCallback, useEffect, useState } from 'react';
import joinRequestService from '../../services/User/JoinRequestService';
import { toast } from 'react-toastify';

const JoinRequests = ({api}) => {
    const [pageNumber, setPageNumber] = useState(0);
    const [joinRequestData, setJoinRequestData] = useState(null);
    const [statisticsOption, setStatisticsOption] = useState(0);
    const [goPrev, setGoPrev] = useState(false);
    const [goNext, setGoNext] = useState(false);
    useEffect(() => {
        loadJoinRequestTable();
    }, [pageNumber, statisticsOption]);
    const loadJoinRequestTable = () => {
        (async () => {
            try {
                let data = null;
                if (statisticsOption) {
                    data = await joinRequestService.getAllOutgoingJoinRequests(api, pageNumber);
                } else {
                    data = await joinRequestService.getAllIncomingJoinRequests(api, pageNumber);
                }
                setJoinRequestData(data);
                if (goPrev !== !data.first) setGoPrev(!data.first);
                if (goNext !== !data.last) setGoNext(!data.last);
            } catch(error) {
                setPageNumber(0);
                toast.error(error.message);
            }
        })();
    }

    const goToPrevPage = useCallback(() => {
        if (goPrev) setPageNumber(pageNumber-1)
    }, [goPrev]);
    const goToNextPage = useCallback(() => {
        if (goNext) setPageNumber(pageNumber+1)
    }, [goNext]);
    const changeJoinRequestStatus = (joinRequestId, isAccepted) => {
        (async () => {
            try {
                await joinRequestService.updateJoinRequest(api, joinRequestId, isAccepted);
                loadJoinRequestTable();
            } catch(error) {
                toast.error(error.message);
            }
        })();
    }
    return (
        <Container fluid>
            <Row className="mb-4">
                <Col md={3}>
                    <Card className={`${style.card} ${statisticsOption || style.active}`} onClick={() => setStatisticsOption(0)}>
                        <Card.Body>
                            <Card.Title className="fs-3 fw-bold">Incoming join requests</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className={`${style.card} ${statisticsOption && style.active}`} onClick={() => setStatisticsOption(1)}>
                        <Card.Body>
                            <Card.Title className="fs-3 fw-bold">Outgoing join requests</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table bordered hover responsive style={{ border: '2px solid #000', borderRadius: 12, overflow: 'hidden' }}>
                        <thead style={{ background: '#dddddd' }}>
                            <tr>
                                {statisticsOption == 0 && <th style={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>Sender</th> }
                                <th style={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>Project ID</th>
                                <th style={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>Project name</th>
                                <th style={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>Request status</th>
                                {statisticsOption == 1 && <th style={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>Project owner</th> }
                                <th style={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>Created at</th>
                                <th style={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>Updated at</th>
                                {statisticsOption == 0 && <th style={{ width: 60 }}>Accept</th>}
                                {statisticsOption == 0 && <th style={{ width: 60 }}>Reject</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {joinRequestData?.content.map((joinRequest) => (
                            <tr key={joinRequest.id} style={{ verticalAlign: 'middle' }}>
                                {statisticsOption == 0 && <td style={{ fontSize: 18 }}>{joinRequest.username}</td>}
                                <td style={{ fontSize: 18 }}>{joinRequest.projectId}</td>
                                <td style={{ fontSize: 18 }}>{joinRequest.projectName}</td>
                                <td style={{ fontSize: 18 }}>{joinRequest.status}</td>
                                {statisticsOption == 1 && <td style={{ fontSize: 18 }}>{joinRequest.ownerUsername}</td>}
                                <td style={{ fontSize: 16 }}>{joinRequest.createdAt}</td>
                                <td style={{ fontSize: 16 }}>{joinRequest.updatedAt || 'None'}</td>
                                {joinRequest.status !== 'waiting' && <td colSpan={2}></td>}
                                {joinRequest.status === 'waiting' && statisticsOption == 0 && <td style={{ textAlign: 'center' }}>
                                <Button variant="link" style={{ color: 'red', padding: 0 }} onClick={() => changeJoinRequestStatus(joinRequest.id, true)}>
                                    <FaCheck size={19} />
                                </Button>
                                </td>}
                                {joinRequest.status === 'waiting' && statisticsOption == 0 && <td style={{ textAlign: 'center' }}>
                                <Button variant="link" style={{ color: 'red', padding: 0 }} onClick={() => changeJoinRequestStatus(joinRequest.id, false)}>
                                    <FaXmark size={20} />
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
                    <Button disabled>{pageNumber+1}</Button>
                    <Button variant="" disabled={!goNext} className={goNext || `${style["unactive-arrow"]}`} onClick={goToNextPage}>
                        <FaArrowRight />
                    </Button>
                </div>
            </Row>
        </Container>
    );
}
export default JoinRequests;