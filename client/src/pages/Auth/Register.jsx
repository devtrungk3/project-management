import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import backgroundImg from '../../assets/images/background.png';
import { registerApi } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullname: '',
        repassword:''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.repassword) {
          setError("Password and re-password do not match")
          return
        }
        setError('');
        try {
          await registerApi(formData);
          toast.success("Register sucessfully");
          navigate('/login')
        } catch (err) {
          setError(err.response?.data?.error || 'Register failed. Please try again.');
        }
    };

  return (
    <>
      <title>Register</title>
      <div className="vh-100" style={{ backgroundColor: "#00acee" }}>
          <Container className="h-100">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col col-xl-10">
                  <div className="card" style={{ borderRadius: "1rem" }}>
                    <div className="row g-0">
                      <div 
                          className="col-md-6 col-lg-5 d-none d-md-block" 
                          style={{ 
                              background: "linear-gradient(to bottom, transparent 10%, #9B9BFF 60%)",
                              borderRadius: "1rem 0 0 1rem"
                          }}
                      >
                          <img
                              src={backgroundImg}
                              alt="register form"
                              className="img-fluid p-2"
                              style={{ borderRadius: "1rem 0 0 1rem" }}
                          />
                      </div>
                      <div className="col-md-6 col-lg-7 d-flex align-items-center">
                        <div className="card-body p-4 p-lg-5 pt-lg-2 text-black">
                          <Form onSubmit={handleSubmit}>
                              <div className="d-flex align-items-center mb-3 pb-1">
                                  <span className="h1 fw-bold mb-0">Register</span>
                              </div>
                                
                                {error && (<Alert variant="danger">{error}</Alert>)}

                              <h5 className="fw-normal mb-2 pb-3" style={{ letterSpacing: 1 }}>
                                  Create your new account
                              </h5>
                              <Form.Group className="form-outline mb-2">
                                  <Form.Label>Username</Form.Label>
                                  <Form.Control 
                                    value={formData.username} 
                                    onChange={handleChange} 
                                    type="text" name="username" 
                                    className="form-control-lg" 
                                    required/>
                              </Form.Group>
                              <Form.Group className="form-outline mb-2">
                                  <Form.Label>Fullname</Form.Label>
                                  <Form.Control 
                                    value={formData.fullname} 
                                    onChange={handleChange} 
                                    type="text" name="fullname"
                                    className="form-control-lg" 
                                    required/>
                              </Form.Group>
                              <Form.Group className="form-outline mb-2">
                                  <Form.Label>Password</Form.Label>
                                  <Form.Control 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    type="password" name="password"
                                    className="form-control-lg" 
                                    required/>
                              </Form.Group>
                              <Form.Group className="form-outline mb-2">
                                  <Form.Label>Re-Password</Form.Label>
                                  <Form.Control 
                                    value={formData.repassword} 
                                    onChange={handleChange} 
                                    type="password" name="repassword"
                                    className="form-control-lg" 
                                    required/>
                              </Form.Group>
                              <div className="pt-2 mb-3">
                                  <Button className="btn btn-dark btn-lg btn-block" type="submit">Register</Button>
                              </div>
                              <p className="mb-1" style={{ color: "#393f81" }}>
                                  If you already have an account{" "}
                                  <a href="/login" style={{ color: "#393f81" }}>
                                  Login here
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

export default Register;