import { useEffect, useState } from "react";
import { Row, Table } from "react-bootstrap";
import userService from "../../services/Admin/UserService";
import { formatDateTime } from '../../utils/format';
import style from './UserManagement.module.css'
import { FaPlus } from "react-icons/fa";

const UserManagement = ({api}) => {
    const [users, setUsers] = useState(null);
    const [usersPageNumber, setUsersPageNumber] = useState(0);
    useEffect(() => {
        fetchUserData();
    }, [usersPageNumber]);
    const fetchUserData = async () => {
        let data = null;
        try {
            data = await userService.getAllUsers(api, usersPageNumber);
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
    return (
        <>
            <Row className="mb-3">
                <div className="d-flex gap-3">
                    <div className={`${style['toolbar-item']} d-inline-flex align-items-center gap-4 px-3 py-2 border rounded-3 shadow-sm bg-info text-black`} onClick={() => handleOpenTaskDialog(tasks.length+1, true)}>
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
                        <td style={{ fontSize: 14 }}>{formatDateTime(user.createdAt)}</td>
                        <td style={{ fontSize: 14 }}>{user.updatedAt ? formatDateTime(user.updatedAt) : 'None'}</td>
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
        </>
    );
}
export default UserManagement;