import { useEffect, useState } from 'react';
import { LuCircleDot } from 'react-icons/lu';
import { BsThreeDots } from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  Container, 
  Row, 
  Col, 
  Badge,
  Dropdown,
  Card,
  Button
} from 'react-bootstrap';
import IssueService from '../../services/User/IssueService';
import IssueCommentService from '../../services/User/IssueCommentService';
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { formatDateTime } from '../../utils/format';
import { jwtDecode } from 'jwt-decode';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { FiCheckCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';

const IssueDetail = ({ api, projectId }) => {
  const [issue, setIssue] = useState(null);
  const {issueId} = useParams();
  const [commentContent, setCommentContent] = useState('');
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const { accessToken } = useAuth();
  useEffect(() => {
    loadIssueDetail();
    setUsername(jwtDecode(accessToken)?.username || '');
  }, []);

  const loadIssueDetail = async () => {
    let data = null;
    try {
      data = await IssueService.getIssue(api, projectId, issueId);
    } catch (error) {
      console.log(error);
      navigate('../issues');
    }
    setIssue(data);
  };

  const addComment = async () => {
    try {
      await IssueCommentService.addComment(api, projectId, issueId, commentContent.trim());
      await loadIssueDetail();
    } catch (error) {
      console.log(error);
    }
  }

  const deleteComment = async (commentId) => {
    try {
      await IssueCommentService.deleteComment(api, projectId, issueId, commentId);
      await loadIssueDetail();
      toast.success('Delete comment successfully');
    } catch (error) {
      console.log(error);
    }
  }

  const changeIssueStatus = async (status) => {
    if (!status) {
      return;
    }
    try {
      await IssueService.changeIssueStatus(api, projectId, issueId, status);
      await loadIssueDetail();
    } catch (error) {
      console.log(error);
    }
  }

  const deleteIssue = async () => {
    const result = await Swal.fire({
        text: `Do you want to delete issue #${issueId}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await IssueService.deleteIssue(api, projectId, issueId);
        toast.success("Delete issue successfully");
        navigate('../issues');
      } catch (error) {
        console.log(error);
      }
    }
  }

  if (!issue) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-vh-100 py-4">
      <Container fluid="xl">
        {/* Header */}
        <div className="mb-3">
          <div className="d-flex align-items-start gap-3">
            <h3 className="mb-2 fw-normal">
              {issue?.title} <span className="text-secondary">#{issue?.id}</span>
            </h3>
            <div className='ms-auto'>
              <Button variant="light" className='border border-dark me-3' size="sm" onClick={() => changeIssueStatus(issue?.issueStatus === "OPEN" ? "CLOSED" : "OPEN")}>
                {issue?.issueStatus === "OPEN" ? 'Close issue' : 'Reopen issue'}
              </Button>
              <Button variant="danger" className='border border-dark sm-mt-3' size="sm" onClick={deleteIssue}>
                Delete issue
              </Button>
            </div>
          </div>
          <p>{issue?.description}</p>
          <div className="d-flex align-items-center gap-2">
            {issue?.issueStatus === "OPEN" ?
            <Badge 
              bg="success" 
              className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
            >
              <LuCircleDot size={16} />
              <span>Open</span>
            </Badge>
            :
            <Badge 
              bg="primary"
              className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
            >
              <FiCheckCircle size={16} />
              <span>Closed</span>
            </Badge>
            }
            <span className="text-secondary">
              <strong>{issue?.author}</strong> created at {formatDateTime(issue.createdAt, 'vi-VN')}
            </span>
          </div>
        </div>
        <Row>
          <Col xs={12}>
            {issue?.comments?.map(comment =>
              <Card className="mb-3" key={comment.id}>
                <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{comment.author}</strong> <span className="text-secondary">{formatDateTime(comment.createdAt, 'vi-VN')}</span>
                  </div>
                  {comment.author === username &&
                  <Dropdown align="end">
                    <Dropdown.Toggle 
                      variant="link" 
                      className="text-secondary p-0 text-decoration-none shadow-none"
                      bsPrefix="custom-dropdown"
                    >
                      <BsThreeDots size={20} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => deleteComment(comment.id)}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  }
                </Card.Header>

                <Card.Body>
                  <p className="mb-3">{comment.content}</p>
                </Card.Body>
              </Card>
            )}
            {/* Add comment */}
          <div className='mt-5 mb-2'>Add a comment</div>
          <Card className="mb-3">
              <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <div>
                  <strong>{issue?.author}</strong>
                </div>
              </Card.Header>

              <Card.Body className="p-0">
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Write a comment..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="border-0 rounded-0"
                  style={{
                    resize: 'vertical',
                    fontSize: '14px'
                  }}
                />
              </Card.Body>
            </Card>
            <div className='d-flex justify-content-end'>
              <Button variant="success" size="sm" onClick={addComment} disabled={!commentContent.trim()}>
                Comment
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default IssueDetail;