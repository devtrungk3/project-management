import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import projectService from "../../services/User/ProjectService";
import useAuth from "../../hooks/useAuth";
import api, { setAuthHandlers } from '../../utils/axios';
import { toast } from 'react-toastify';

const DetailProject = ({isMyProject}) => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [projectInfo, setProjectInfo] = useState(null);
    const { setAccessToken, setUserRole } = useAuth();
    useEffect(() => {
        setAuthHandlers({
            updateAccessToken: setAccessToken,
            updateUserRole: setUserRole
        });
        (async () => {
            try {
                let data = await projectService.getProjectById(api, id, isMyProject);
                console.log(data);
                setProjectInfo(data);
            } catch(error) {
                toast.error(error.message);
                navigate('/user/my-projects')
            }
        })();
    }, [])
    return (
        <p>{id}</p>
    );
}
export default DetailProject;