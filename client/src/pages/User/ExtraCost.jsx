import { useEffect, useState } from 'react';
import style from './DetailProject.module.css';
import { FaPlus, FaTrash } from "react-icons/fa";
import ExtraCostService from '../../services/User/ExtraCostService';
import { toast } from "react-toastify";
import { formatDate } from '../../utils/format';
import ExtraCostDialog from '../../components/ExtraCostDialog';

const ExtraCost = ({ api, projectId }) => {
    const [extraCosts, setExtraCosts] = useState(null);
    const [selectedExtraCostId, setSelectedExtraCostId] = useState(0);
    const [openExtraCostDialog, setOpenExtraCostDialog] = useState(0);
    const [isAddDialog, setIsAddDialog] = useState(false);
    const [tempExtraCost, setTempExtraCost] = useState(null);

    useEffect(() => {
        loadExtraCosts();
    }, []);

    const loadExtraCosts = async () => {
        try {
            const data = await ExtraCostService.getAllExtraCosts(api, projectId);
            setExtraCosts(data);
        } catch (error) {
            toast.error("Failed to load extra costs");
        }
    };

    const handleOpenExtraCostDialog = (addDialogFlag, extraCostId = -1) => {
        if (addDialogFlag) {
            setTempExtraCost({
                item: "",
                cost: 0,
                status: "PAID",
                projectId
            });
        } else {
            const found = extraCosts.find(cost => cost.id === extraCostId);
            setTempExtraCost(found);
        }
        setIsAddDialog(addDialogFlag);
        setOpenExtraCostDialog(extraCostId);
    };

    const handleCloseExtraCostDialog = () => {
        setOpenExtraCostDialog(0);
    };

    const addNewExtraCost = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formJson = Object.fromEntries(formData.entries());
        const payload = {
            item: formJson.item,
            cost: parseFloat(formJson.cost),
            status: formJson.status,
            description: formJson.description
        };
        try {
            const added = await ExtraCostService.addExtraCost(api, payload, projectId);
            setExtraCosts(prev => [...(prev ?? []), added]);
            toast.success("Added extra cost successfully");
        } catch (error) {}
        handleCloseExtraCostDialog();
    };

    const updateExtraCost = async (e) => {
        e.preventDefault();
        try {
            const updated = await ExtraCostService.updateExtraCost(api, tempExtraCost, projectId);
            setExtraCosts(prev => prev.map(cost => cost.id === updated.id ? updated : cost));
            toast.success("Updated extra cost successfully");
        } catch (error) {}
        handleCloseExtraCostDialog();
    };

    const deleteExtraCost = async () => {
        if (selectedExtraCostId === 0) {
            toast.warn("Please select an extra cost to delete");
            return;
        }
        if (confirm(`Do you want to delete extra cost id ${selectedExtraCostId}?`)) {
            try {
                await ExtraCostService.deleteExtraCost(api, selectedExtraCostId, projectId);
                setExtraCosts(prev => prev.filter(cost => cost.id !== selectedExtraCostId));
                toast.success("Deleted extra cost successfully");
                setSelectedExtraCostId(0);
            } catch (error) {}
        }
    };

    const handleSelectedExtraCost = (id) => {
        setSelectedExtraCostId(prev => (prev === id ? 0 : id));
    };

    return (
        <>
            <div className="overflow-auto max_width_1200">
                <div className="fs-4 mb-3">Extra Cost Management</div>

                <div className="d-flex flex-wrap gap-3">
                    <div
                        className={`${style['toolbar-item']} d-inline-flex align-items-center gap-4 px-3 py-2 border rounded-3 shadow-sm bg-info text-white`}
                        onClick={() => handleOpenExtraCostDialog(true)}
                    >
                        <div className="d-flex align-items-center gap-2">
                            <FaPlus />
                            <span className="fw-semibold">Add</span>
                        </div>
                    </div>

                    <div
                        className={`${style['toolbar-item']} d-inline-flex align-items-center gap-4 px-3 py-2 border rounded-3 shadow-sm bg-danger text-white`}
                        onClick={deleteExtraCost}
                    >
                        <div className="d-flex align-items-center gap-2">
                            <FaTrash />
                            <span className="fw-semibold">Delete</span>
                        </div>
                    </div>
                </div>

                <table className={`${style.table} mt-4`}>
                    <thead>
                        <tr>
                            <th className={`${style.cell} ${style['cell-header']}`}>Item</th>
                            <th className={`${style.cell} ${style['cell-header']}`}>Cost</th>
                            <th className={`${style.cell} ${style['cell-header']}`}>Status</th>
                            <th className={`${style.cell} ${style['cell-header']}`}>Description</th>
                            <th className={`${style.cell} ${style['cell-header']}`}>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {extraCosts?.map((extraCost) => (
                            <tr
                                key={extraCost.id}
                                onClick={() => handleSelectedExtraCost(extraCost.id)}
                                onDoubleClick={() => handleOpenExtraCostDialog(false, extraCost.id)}
                                className={extraCost.id === selectedExtraCostId ? 'selected_row' : ''}
                            >
                                <td className={style.cell}>{extraCost.item}</td>
                                <td className={style.cell}>{extraCost.cost}</td>
                                <td className={style.cell}>{extraCost.status}</td>
                                <td className={style.cell}>{extraCost.description}</td>
                                <td className={style.cell}>{formatDate(extraCost.createdAt, 'vi-VN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ExtraCostDialog
                openExtraCostDialog={openExtraCostDialog}
                handleCloseExtraCostDialog={handleCloseExtraCostDialog}
                onSubmit={isAddDialog ? addNewExtraCost : updateExtraCost}
                tempExtraCost={tempExtraCost}
                setTempExtraCost={setTempExtraCost}
            />
        </>
    );
};

export default ExtraCost;
