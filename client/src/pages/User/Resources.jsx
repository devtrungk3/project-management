import { useEffect, useState } from "react";
import resourceService from "../../services/User/ResourceService";
import { FaPlus, FaTrash } from "react-icons/fa";
import style from './DetailProject.module.css';
import { formatDateTime } from '../../utils/format';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import tagRateService from "../../services/User/TagRateService";
import { toast } from "react-toastify";
import TagRateDialog from "../../components/TagRateDialog";

const Resources = ({api, projectId}) => {
    const [resources, setResources] = useState([]);
    const [resourceIdSelected, setResourceIdSelected] = useState(0);
    const [tagRates, setTagRates] = useState(null);
    const [selectedTagRateId, setSelectedTagRateId] = useState(0);
    const [openTagRateDialog, setOpenTagRateDialog] = useState(0);
    const [isAddTagRateDialog, setIsAddTagRateDialog] = useState(false);
    const [tempTagRate, setTempTagRate] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        loadResourceTable();
        loadTagTable();
    }, [])
    const loadResourceTable = () => {
        (async () => {
            try {
                const data = await resourceService.getAllResources(api, projectId);
                setResources(data);
            } catch(error) {
                navigate(`/user/my-projects/${projectId}`)
            }
        })();
    }
    const loadTagTable = async () => {
        let data = null;
        try {
            data = await tagRateService.getAllTagRates(api, projectId);
        } catch (error) {
            navigate(`user/my-projects/${projectId}`)
        }
        setTagRates(data);
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
                        setResources(resources.filter(resource => resource.id != resourceIdSelected));
                        toast.success("Delete resource successfully");
                    } catch (error) {}
                }
        }
    }
    const handleSelectedTagRateId = (currentSelectedTagRateId) => {
        if (currentSelectedTagRateId == selectedTagRateId) {
            setSelectedTagRateId(0);
        } else {
            setSelectedTagRateId(currentSelectedTagRateId);
        }
    }
    const handleOpenTagRateDialog = (addDialogFlag, tagRateId = -1) => {
        if (addDialogFlag) {
            setTempTagRate({});
        } else {
            setTempTagRate(tagRates.find(tag => tag.id === tagRateId));
        }
        setIsAddTagRateDialog(addDialogFlag);
        setOpenTagRateDialog(tagRateId);
    }
    const handleCloseTagRateDialog = () => {
        setOpenTagRateDialog(0);
    }
    const addNewTagRate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formJson = Object.fromEntries(formData.entries());
        let payload = {
            tagName: formJson.name,
            rate: formJson.rate
        }
        if (formJson.description.trim() != "") {
            payload = {
                ...payload,
                description: formJson.description.trim()
            }
        }
        try {
            const addedTagRate = await tagRateService.addTagRate(api, payload, projectId);
            setTagRates((prev) => [
                addedTagRate,
                ...(prev ?? [])
            ])
            toast.success("Add new tag rate successfully");
        } catch (error) {}
        handleCloseTagRateDialog(0);
    }
    const updateTagRate = async (e) => {
        e.preventDefault();
        try {
            const updatedTagRate = await tagRateService.updateTagRate(api, tempTagRate, projectId);
            setTagRates((prev) => prev.map(tagRate => tagRate.id === updatedTagRate.id ? updatedTagRate : tagRate))
            toast.success("Update tag rate successfully");
        } catch (error) {}
        handleCloseTagRateDialog(0);
    }
    const deleteTagRate = async () => {
        if (selectedTagRateId != 0) {
            if (confirm(`Do you want to delete tag id ${selectedTagRateId}?`)) {
                try {
                    await tagRateService.deleteTagRate(api, selectedTagRateId);
                    setTagRates(prev => prev.filter(tag => tag.id !== selectedTagRateId));
                    toast.success("Delete tag rate successfully");
                } catch (error) {}   
            setSelectedTagRateId(0);                         
            }
        }
    }
    return (
        <>
            <div className="pt-4">
                <Row>
                    <Col md={6} className="overflow-auto">
                        <div className="d-flex gap-5">
                            <div className={`${style['toolbar-item']} d-inline-flex align-items-center gap-4 px-3 py-2 border rounded-3 shadow-sm bg-danger text-white`} onClick={deleteResource}>
                                <div className="d-flex align-items-center gap-2">
                                    <FaTrash />
                                    <span className="fw-semibold">Delete resource</span>
                                </div>
                            </div>
                        </div>
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
                                    <tr key={resource.id} onClick={(e) => {handleResourceSelect(resource.id)}} className={resource.id === resourceIdSelected ? 'selected_row' : ''}>
                                        <td className={`${style.cell}`}>{resource.id}</td>
                                        <td className={`${style.cell}`}>{resource.username}</td>
                                        <td className={`${style.cell}`}>{formatDateTime(resource.createdAt)}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>                    
                    </Col>
                    <Col md={6} className="overflow-auto">
                        <div className="d-flex gap-4">
                            <div className={`${style['toolbar-item']} d-inline-flex align-items-center gap-4 px-3 py-2 border rounded-3 shadow-sm bg-info text-white`} onClick={() => handleOpenTagRateDialog(true)}>
                                <div className="d-flex align-items-center gap-2">
                                    <FaPlus />
                                    <span className="fw-semibold">New tag</span>
                                </div>
                            </div>
                            <div className={`${style['toolbar-item']} d-inline-flex align-items-center gap-4 px-3 py-2 border rounded-3 shadow-sm bg-danger text-white`} onClick={deleteTagRate}>
                                <div className="d-flex align-items-center gap-2">
                                    <FaTrash />
                                    <span className="fw-semibold">Delete tag</span>
                                </div>
                            </div>
                        </div>
                        <table className={`${style.table}`}>
                            <thead>
                                <tr>
                                <th className={`${style.cell} ${style['cell-header']}`}>ID</th>
                                <th className={`${style.cell} ${style['cell-header']}`}>Tag name</th>
                                <th className={`${style.cell} ${style['cell-header']}`}>Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tagRates?.map(tag => 
                                    <tr 
                                        key={tag.id} 
                                        onClick={(e) => {handleSelectedTagRateId(tag.id)}} 
                                        className={tag.id === selectedTagRateId ? 'selected_row' : ''}
                                        onDoubleClick={() => handleOpenTagRateDialog(false, tag.id)}
                                    >
                                        <td className={`${style.cell}`}>{tag.id}</td>
                                        <td className={`${style.cell}`}>{tag.tagName}</td>
                                        <td className={`${style.cell}`}>{tag.rate}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>  
                    </Col>
                </Row>
            </div>
            <TagRateDialog openTagRateDialog={openTagRateDialog} handleCloseTagRateDialog={handleCloseTagRateDialog} onSubmit={isAddTagRateDialog === false ? updateTagRate : addNewTagRate} tempTagRate={tempTagRate} setTempTagRate={setTempTagRate} /> 
        </>
    );
}
export default Resources;