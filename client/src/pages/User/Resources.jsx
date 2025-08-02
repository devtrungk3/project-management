import { useEffect, useState } from "react";
import resourceService from "../../services/User/ResourceService";
import { FaTrash } from "react-icons/fa";
import style from './DetailProject.module.css';
import { formatDateTime } from '../../utils/format';
import { toast } from "react-toastify";
const Resources = ({api, projectId}) => {
    const [resources, setResources] = useState([]);
    const [resourceIdSelected, setResourceIdSelected] = useState(0);
    useEffect(() => {
        loadResourceTable();
    }, [])
    const loadResourceTable = () => {
        (async () => {
            try {
                const data = await resourceService.getAllResources(api, projectId);
                setResources(data);
            } catch(error) {
                toast.error(error.message);
                navigate('/user/my-projects')
            }
        })();
    }
    const handleResourceSelect = (currentResourceIdSelected) => {
        if (currentResourceIdSelected == resourceIdSelected) {
            setResourceIdSelected(0);
        } else {
            setResourceIdSelected(currentResourceIdSelected);
        }
    }
    const deleteResource = async () => {
        if (resourceIdSelected != 0) {
                if (confirm(`Are you sure?`)) {
                    try {
                        await resourceService.deleteResource(api, resourceIdSelected)
                    } catch (error) {
                        toast.error(error.message);
                    }
                    setResources(resources.filter(resource => resource.id != resourceIdSelected))
                }
        }
    }
    return (
        <>
            <div>
                <div className="d-flex justify-content-between">
                    <div className="d-flex gap-5">
                        <div className={`${style['toolbar-item']} d-inline-flex align-items-center gap-4 px-3 py-2 border rounded-3 shadow-sm bg-danger text-white`} onClick={deleteResource}>
                            <div className="d-flex align-items-center gap-2">
                                <FaTrash />
                                <span className="fw-semibold">Delete resource</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-4">
                <table className={`${style.table}`}>
                    <thead>
                        <tr>
                        <th className={`${style.cell} ${style['cell-header']}`}>ID</th>
                        <th className={`${style.cell} ${style['cell-header']}`}>Username</th>
                        <th className={`${style.cell} ${style['cell-header']}`}>Added at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.map(resource => 
                            <tr key={resource.id} onClick={(e) => {handleResourceSelect(resource.id)}} className={resource.id === resourceIdSelected ? 'bg-light' : ''}>
                                <td className={`${style.cell}`}>{resource.id}</td>
                                <td className={`${style.cell}`}>{resource.username}</td>
                                <td className={`${style.cell}`}>{formatDateTime(resource.createdAt)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
export default Resources;