import { Dialog, DialogActions, DialogContent, TextField } from "@mui/material";
import { useState } from "react";
import { Button, Alert } from 'react-bootstrap';
const UserDialog = ({ openUserDialog, handleCloseUserDialog, onSubmit, userInfo, setUserInfo }) => {
    const [error, setError] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState('')
    return (
        <Dialog
            sx={{
                '& .MuiDialog-paper': {
                    width: '500px',
                    maxWidth: 'none'
                }
            }}
            open={openUserDialog != 0}
            onClose={handleCloseUserDialog}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: (e) => {
                        e.preventDefault();
                        if (userInfo.password != confirmPassword) {
                            setError("Password and confirm password do not match")
                        } else {
                            setError(null);
                            setConfirmPassword('');
                            onSubmit();
                        }
                    }
                },
            }}
        >
            <DialogContent>
                {error != null && (<Alert variant="danger">{error}</Alert>)}
                <TextField
                    autoFocus
                    required
                    fullWidth
                    id="username"
                    name="username"
                    margin="dense"
                    label="Username"
                    value={userInfo?.username || ''}
                    onChange={(e) => setUserInfo({...userInfo, username: e.target.value})}
                />
                <TextField
                    required
                    fullWidth
                    margin="dense"
                    id="fullname"
                    name="fullname"
                    label="Fullname"
                    value={userInfo?.fullname || ''}
                    onChange={(e) => setUserInfo({...userInfo, fullname: e.target.value})}
                />
                <TextField
                    required
                    fullWidth
                    margin="dense"
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={userInfo?.password || ''}
                    onChange={(e) => setUserInfo({...userInfo, password: e.target.value})}
                />
                <TextField
                    required
                    fullWidth
                    margin="dense"
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseUserDialog}>Cancel</Button>
                <Button type="submit">Save</Button>
            </DialogActions>
        </Dialog>
    );
}
export default UserDialog;