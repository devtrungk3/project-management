import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import UserService from "../../services/User/UserService";

const Profile = ({api}) => {
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [waiting, setWaiting] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
        ...prev,
        [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        setWaiting(true);
        try {
            await UserService.changePassword(api, passwordForm);
            toast.success("Updated password successfully");
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.log(error);
        }
        setWaiting(false);
    }
    return (
        <>
            <h4>Change the password</h4>
            <div className="col-md-6">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="form-outline mb-4">
                        <Form.Label>Current password</Form.Label>
                        <Form.Control 
                        value={passwordForm.currentPassword} 
                        onChange={handleChange} 
                        type="password" name="currentPassword" 
                        className="form-control-lg" 
                        required/>
                    </Form.Group>
                    <Form.Group className="form-outline mb-4">
                        <Form.Label>New password</Form.Label>
                        <Form.Control 
                        value={passwordForm.newPassword} 
                        onChange={handleChange} 
                        type="password" name="newPassword"
                        className="form-control-lg" 
                        required/>
                    </Form.Group>
                    <Form.Group className="form-outline mb-4">
                        <Form.Label>Confirm new password</Form.Label>
                        <Form.Control 
                        value={passwordForm.confirmPassword} 
                        onChange={handleChange} 
                        type="password" name="confirmPassword"
                        className="form-control-lg" 
                        required/>
                    </Form.Group>
                    <div className="pt-1 mb-4">
                        <Button className="btn btn-secondary" type="submit">
                        {waiting ? <span><span className='spinner-border spinner-border-sm'/> Waiting</span> : 'Change password'}
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    );
}
export default Profile;