import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import backgroundImg from '../../assets/images/background.png';
import useAuth from '../../hooks/useAuth';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData);
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <>
      <title>Login</title>
      <div className="vh-100" style={{ backgroundColor: "#00acee" }}>
          <Container className="py-5 h-100">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col col-xl-10">
                  <div className="card" style={{ borderRadius: "1rem" }}>
                    <div className="row g-0">
                      <div 
                          className="col-md-6 col-lg-5 d-none d-md-block" 
                          style={{ 
                              background: "linear-gradient(to bottom, transparent 5%, #9B9BFF 60%)",
                              borderRadius: "1rem 0 0 1rem"
                          }}
                      >
                        <img
                            src={backgroundImg}
                            alt="login form"
                            className="img-fluid p-2"
                            style={{ borderRadius: "1rem 0 0 1rem" }}
                        />
                      </div>
                      <div className="col-md-6 col-lg-7 d-flex align-items-center">
                        <div className="card-body p-4 p-lg-5 text-black">
                          <Form onSubmit={handleSubmit}>
                              <div className="d-flex align-items-center mb-3 pb-1">
                                  <span className="h1 fw-bold mb-0">Login</span>
                              </div>
                                
                                {error && (<Alert variant="danger">{error}</Alert>)}

                              <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: 1 }}>
                                  Sign into your account
                              </h5>
                              <Form.Group className="form-outline mb-4">
                                  <Form.Label>Username</Form.Label>
                                  <Form.Control 
                                    value={formData.username} 
                                    onChange={handleChange} 
                                    type="username" name="username" 
                                    className="form-control-lg" 
                                    required/>
                              </Form.Group>
                              <Form.Group className="form-outline mb-4">
                                  <Form.Label>Password</Form.Label>
                                  <Form.Control 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    type="password" name="password"
                                    className="form-control-lg" 
                                    required/>
                              </Form.Group>
                              <div className="pt-1 mb-4">
                                  <Button className="btn btn-dark btn-lg btn-block" type="submit">Login</Button>
                              </div>
                              <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                                  Don't have an account?{" "}
                                  <a href="/register" style={{ color: "#393f81" }}>
                                  Register here
                                  </a>
                              </p>
                          </Form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </Container>
      </div>
    </>
  );
};

export default Login;