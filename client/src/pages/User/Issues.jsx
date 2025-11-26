import { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { LuCircleDot } from "react-icons/lu";
import { FiCheckCircle } from 'react-icons/fi';
import { BiMessageSquareDetail } from 'react-icons/bi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  InputGroup
} from 'react-bootstrap';
import IssueService from '../../services/User/IssueService';
import IssueDialog from '../../components/IssueDialog';
import { formatDateTime } from '../../utils/format';

const Issues = ({api, projectId}) => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('open');
    const [searchQuery, setSearchQuery] = useState('');
    const [openIssues, setOpenIssues] = useState([]);
    const [closedIssues, setClosedIssues] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [tempIssue, setTempIssue] = useState({ title: '', description: '', issueStatus: 'OPEN'});

    useEffect(() => {
        loadIssues();
    }, []);

    const loadIssues = async () => {
        let openIssueData = [];
        let closedIssueData = [];
        try {
            const data = await IssueService.getAllIssues(api, projectId);
            data.map(d => {
                if (d.issueStatus === 'OPEN') {
                    openIssueData.push(d);
                } else {
                    closedIssueData.push(d);
                }
            })
        } catch (error) {
            console.log(error);
        }
        setOpenIssues(openIssueData);
        setClosedIssues(closedIssueData);
    }

    const handleOpenDialog = () => {
        setTempIssue({ title: '', issueStatus: 'OPEN'});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setTempIssue({ title: '', issueStatus: 'OPEN'});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          await IssueService.addIssue(api, projectId, tempIssue);
          await loadIssues();
        } catch (error) {
          console.log(error);
        }
        handleCloseDialog();
    };

    return (
        <div className="min-vh-100 py-4">
            <Container fluid="xl">
                <div className="fs-4 mb-3">Issues</div>
                <div className="bg-white rounded border">
                    <div className="p-3 border-bottom">
                        <Row className="g-2 align-items-center">
                        <Col xs={12} md={6} lg={4}>
                            <InputGroup size="sm">
                            <InputGroup.Text className="bg-white">
                                <IoSearch  size={16} />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Search Issues"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            </InputGroup>
                        </Col>
                        
                        <Col xs="auto" className="ms-auto">
                            <div className="d-flex gap-2 flex-wrap">
                            <Button variant="success" size="sm" onClick={handleOpenDialog}>
                                New issue
                            </Button>
                            </div>
                        </Col>
                        </Row>
                    </div>

                    <div className="p-3 border-bottom">
                        <Row className="align-items-center g-3">
                        <Col xs={12} md="auto">
                            <div className="d-flex align-items-center gap-3">
                            <Button
                                variant="link"
                                onClick={() => setActiveTab('open')}
                                className={`text-decoration-none p-0 d-flex align-items-center gap-2 ${
                                activeTab === 'open' ? 'text-dark fw-semibold' : 'text-secondary'
                                }`}
                            >
                                <span>{openIssues.length} Open</span>
                            </Button>

                            <Button
                                variant="link"
                                onClick={() => setActiveTab('closed')}
                                className={`text-decoration-none p-0 d-flex align-items-center gap-2 ${
                                activeTab === 'closed' ? 'text-dark fw-semibold' : 'text-secondary'
                                }`}
                            >
                                <span>{closedIssues.length} Closed</span>
                            </Button>
                            </div>
                        </Col>
                        </Row>
                    </div>

                    <div className="list-group list-group-flush">
                        {activeTab === 'open' ?
                            openIssues
                            .filter(issue => issue.title?.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((issue) => (
                                <div
                                    key={issue.id}
                                    className="list-group-item list-group-item-action border-0 border-bottom"
                                >
                                    <Row className="align-items-start g-2">
                                        <Col xs="auto">
                                            <LuCircleDot 
                                                size={16} 
                                                className="text-purple mt-1"
                                                style={{ color: '#8250df' }}
                                            />
                                        </Col>
                                        <Col>
                                            <div className="fw-semibold text-dark mb-1">
                                            <Link 
                                                to={`${location.pathname}/${issue.id}`} 
                                                className="text-decoration-none link-primary text-dark"
                                            >
                                                {issue.title}
                                            </Link>
                                            </div>
                                            <small className="text-secondary">
                                                #{issue.id} · by {issue.author} at {formatDateTime(issue.createdAt, 'vi-VN')}
                                            </small>
                                        </Col>
                                        {issue.commentCount > 0 && (
                                            <Col xs="auto">
                                                <div className="d-flex align-items-center gap-1 text-secondary">
                                                    <BiMessageSquareDetail size={16} />
                                                    <small>{issue.commentCount}</small>
                                                </div>
                                            </Col>
                                        )}
                                    </Row>
                                </div>
                            ))
                        :
                            closedIssues
                            .filter(issue => issue.title?.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((issue) => (
                                <div
                                    key={issue.id}
                                    className="list-group-item list-group-item-action border-0 border-bottom"
                                >
                                    <Row className="align-items-start g-2">
                                        <Col xs="auto">
                                            <FiCheckCircle 
                                                size={16} 
                                                className="text-success mt-1"
                                                style={{ color: '#28a745' }}
                                            />
                                        </Col>
                                        <Col>
                                            <div className="fw-semibold text-dark mb-1">
                                                <Link 
                                                    to={`${location.pathname}/${issue.id}`} 
                                                    className="text-decoration-none link-primary text-dark"
                                                >
                                                    {issue.title}
                                                </Link>
                                            </div>
                                            <small className="text-secondary">
                                                #{issue.id} · by {issue.author} at {formatDateTime(issue.createdAt, 'vi-VN')}
                                            </small>
                                        </Col>

                                        {issue.commentCount > 0 && (
                                            <Col xs="auto">
                                                <div className="d-flex align-items-center gap-1 text-secondary">
                                                    <BiMessageSquareDetail size={16} />
                                                    <small>{issue.commentCount}</small>
                                                </div>
                                            </Col>
                                        )}
                                    </Row>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </Container>

            <IssueDialog
                open={openDialog}
                handleClose={handleCloseDialog}
                onSubmit={handleSubmit}
                tempIssue={tempIssue}
                setTempIssue={setTempIssue}
            />    
        </div>
    );
};

export default Issues;