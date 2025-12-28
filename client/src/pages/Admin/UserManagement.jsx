import { useCallback, useEffect, useState } from "react";
import { Row, Table, Button } from "react-bootstrap";
import userService from "../../services/Admin/UserService";
import { formatDateTime } from '../../utils/format';
import style from './UserManagement.module.css'
import { FaArrowLeft, FaArrowRight, FaPlus } from "react-icons/fa";
import UserDialog from "../../components/UserDialog";
import { toast } from 'react-toastify';

const UserManagement = ({api}) => {
    const [users, setUsers] = useState(null);
    const [usersPageNumber, setUsersPageNumber] = useState(0);
    const [openUserDialog, setOpenUserDialog] = useState(0);
    const [userInfoTemp, setUserInfoTemp] = useState(null);
    const [goPrev, setGoPrev] = useState(false);
    const [goNext, setGoNext] = useState(false);
    useEffect(() => {
        fetchUserData();
    }, [usersPageNumber]);
    const fetchUserData = async () => {
        let data = null;
        try {
            data = await userService.getAllUsers(api, usersPageNumber);
            setGoPrev(!data.first);
            setGoNext(!data.last);
        } catch (error) {
            setUsersPageNumber(0);
        }
        setUsers(data);
    }
    const deleteUser = async (userId) => {
        if (confirm(`Do you want to delete user ${userId}?`)) {
            try {
                await userService.deleteUser(api, userId);
                await fetchUserData();
            } catch (error) {
            }
        }
    }
    const activeUser = async (userId) => {
        if (confirm(`Do you want to active user ${userId}?`)) {
            try {
                const activatedUser = await userService.activeUser(api, userId);
                setUsers(prev => ({
                    ...prev,
                    content: prev.content.map(user => user.id === activatedUser.id ? activatedUser : user)
                }))
            } catch (error) {
            }
        }
    }
    const suspendUser = async (userId) => {
        if (confirm(`Do you want to suspend user ${userId}?`)) {
            try {
                const suspendedUser = await userService.suspendUser(api, userId);
                setUsers(prev => ({
                    ...prev,
                    content: prev.content.map(user => user.id === suspendedUser.id ? suspendedUser : user)
                }))
            } catch (error) {
            }
        }
    }
    const banUser = async (userId) => {
        if (confirm(`Do you want to ban user ${userId}?`)) {
            try {
                const bannedUser = await userService.banUser(api, userId);
                setUsers(prev => ({
                    ...prev,
                    content: prev.content.map(user => user.id === bannedUser.id ? bannedUser : user)
                }))
            } catch (error) {
            }
        }
    }
    const handleOpenUserDialog = () => {
        setOpenUserDialog(1);
    }
    const handleCloseUserDialog = () => {
        setOpenUserDialog(0);
    }
    const addNewUser = async () => {
        try {
            await userService.addNewUser(api, userInfoTemp);
            await fetchUserData();
            toast.success("Create new user successfully");
        } catch (error) {
        }
        handleCloseUserDialog()
        setUserInfoTemp(null);
    }
    const goToPrevPage = useCallback(() => {
        if (goPrev) {
            setUsersPageNumber(prev => prev-1);
        }
    }, [goPrev]);
    const goToNextPage = useCallback(() => {
        if (goNext) {
            setUsersPageNumber(prev => prev+1);
        }
    }, [goNext]);
    return (
        <>
            <Row className="mb-3">
                <div className="d-flex gap-3">
                    <div className={`${style['toolbar-item']} d-inline-flex align-items-center gap-4 px-3 py-2 border rounded-3 shadow-sm bg-info text-black`} onClick={handleOpenUserDialog}>
                        <div className="d-flex align-items-center gap-2">
                            <FaPlus />
                            <span className="fw-semibold">New user</span>
                        </div>
                    </div>
                </div>
            </Row>
            <Table bordered hover responsive style={{ border: '2px solid #000', borderRadius: 12, overflow: 'hidden' }}>
                <thead style={{ background: '#dddddd' }}>
                    <tr>
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>ID</th>    
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Username</th>
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Fullname</th>
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Role</th>
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Status</th>
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Created at</th>
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Updated at</th>
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Function</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.content.map((user) => (
                    <tr key={user.id} style={{ verticalAlign: 'middle' }}>
                        <td style={{ fontSize: 14, textAlign: 'center' }}>{user.id}</td>
                        <td style={{ fontSize: 14 }}>{user.username}</td>
                        <td style={{ fontSize: 14 }}>{user.fullname}</td>
                        <td style={{ fontSize: 14 }}>{user.role.name}</td>
                        <td style={{ fontSize: 14 }}>{user.status}</td>
                        <td style={{ fontSize: 14 }}>{formatDateTime(user.createdAt, 'vi-VN')}</td>
                        <td style={{ fontSize: 14 }}>{user.updatedAt ? formatDateTime(user.updatedAt, 'vi-VN') : 'None'}</td>
                        <td>
                            {(user.status != 'ACTIVE' && user.status != 'BANNED') &&<button className="btn btn-primary me-2" onClick={() => activeUser(user.id)}>
                                Active
                            </button>}
                            {(user.status != 'SUSPENDED' && user.status != 'BANNED') && <button className="btn btn-warning me-2" onClick={() => suspendUser(user.id)}>
                                Suspend
                            </button>}
                            {(user.status != 'BANNED') &&<button className="btn btn-danger me-2" onClick={() => banUser(user.id)}>
                                Ban
                            </button>}
                            <button className="btn btn-danger me-2" onClick={() => deleteUser(user.id)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-center align-items-center gap-2">
                <Button variant="" disabled={!goPrev} className={goPrev || `${style["unactive-arrow"]}`} onClick={goToPrevPage}>
                    <FaArrowLeft />
                </Button>
                <Button disabled>{usersPageNumber+1}</Button>
                <Button variant="" disabled={!goNext} className={goNext || `${style["unactive-arrow"]}`} onClick={goToNextPage}>
                    <FaArrowRight />
                </Button>
            </div>
            <UserDialog openUserDialog={openUserDialog} handleCloseUserDialog={handleCloseUserDialog} onSubmit={addNewUser} userInfo={userInfoTemp} setUserInfo={setUserInfoTemp} />
        </>
    );
}
export default UserManagement;