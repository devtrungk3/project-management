import { Row, Table } from "react-bootstrap";
import style from './UserManagement.module.css'
import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import CurrencyDialog from '../../components/CurrencyDialog';
import currencyService from '../../services/Admin/CurrencyService';
import { toast } from "react-toastify";

const Currency = ({api}) => {
    const [currencies, setCurrencies] = useState(null);
    const [openCurrencyDialog, setOpenCurrencyDialog] = useState(0);
    const [isAddDialog, setIsAddDialog] = useState(false);
    const [tempCurrency, setTempCurrency] = useState(null);
    const [selectedCurrencyId, setSelectedCurrencyId] = useState(0);
    useEffect(() => {
        loadCurrencyTable();
    }, []);
    const loadCurrencyTable = async () => {
        let data = null;
        try {
            data = await currencyService.getAllCurrencies(api);
        } catch (error) {}
        setCurrencies(data);
    }
    const handleOpenCurrencyDialog = (addDialogFlag, currencyId = -1) => {
        if (addDialogFlag) {
            setTempCurrency({
                "name": "" 
            });
        } else {
            setTempCurrency(currencies.find(currency => currency.id === currencyId));
        }
        setIsAddDialog(addDialogFlag);
        setOpenCurrencyDialog(currencyId);
    }
    const handleCloseCurrencyDialog = () => {
        setOpenCurrencyDialog(0);
    }
    const addNewCurrency = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formJson = Object.fromEntries(formData.entries());
        const payload = {
            name: formJson.name,
        };
        try {
            const addedCurrency = await currencyService.addCurrency(api, payload);
            setCurrencies((prev) => [
                addedCurrency,
                ...(prev ?? [])
            ])
            toast.success("Add new currency successfully");
        } catch (error) {}
        handleCloseCurrencyDialog(0);
    }
    const updateCurrency = async (e) => {
        e.preventDefault();
        try {
            const updatedCurrency = await currencyService.updateCurrency(api, tempCurrency);
            setCurrencies((prev) => prev.map(currency => currency.id === updatedCurrency.id ? updatedCurrency : currency))
            toast.success("Update currency successfully");
        } catch (error) {}
        handleCloseCurrencyDialog(0);
    }
    const deleteCurrency = async () => {
        if (selectedCurrencyId != 0) {
            if (confirm(`Do you want to delete currency id ${selectedCurrencyId}?`)) {
                try {
                    await currencyService.deleteCurrency(api, selectedCurrencyId);
                    setCurrencies(prev => prev.filter(currency => currency.id !== selectedCurrencyId));
                    toast.success("Delete currency successfully");
                } catch (error) {}   
            setSelectedCurrencyId(0);                         
            }
        }
    }
    const handleSelectedCurrencyId = (currentSelectedCurrencyId) => {
        if (currentSelectedCurrencyId === selectedCurrencyId) {
            setSelectedCurrencyId(0);
        } else {
            setSelectedCurrencyId(currentSelectedCurrencyId);
        }
    }
    return (
        <>
            <Row className="mb-3">
                <div className="d-flex gap-3">
                    <div className={`${style['toolbar-item']} d-inline-flex align-items-center gap-4 px-3 py-2 border rounded-3 shadow-sm bg-info text-black`} onClick={() => handleOpenCurrencyDialog(true)}>
                        <div className="d-flex align-items-center gap-2">
                            <FaPlus />
                            <span className="fw-semibold">New currency</span>
                        </div>
                    </div>
                    <div className={`${style['toolbar-item']} d-inline-flex align-items-center gap-4 px-3 py-2 border rounded-3 shadow-sm bg-danger text-white`} onClick={deleteCurrency}>
                        <div className="d-flex align-items-center gap-2">
                            <FaTrash />
                            <span className="fw-semibold">Delete currency</span>
                        </div>
                    </div>
                </div>
            </Row>
            <Table bordered hover responsive style={{ border: '2px solid #000', borderRadius: 12, overflow: 'hidden' }}>
                <thead style={{ background: '#dddddd' }}>
                    <tr>
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>ID</th>    
                        <th style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Currency</th>
                    </tr>
                </thead>
                <tbody>
                    {currencies?.map((currency) => (
                        <tr key={currency.id} onClick={(e) => {handleSelectedCurrencyId(currency.id)}} className={currency.id === selectedCurrencyId ? 'table-active' : ''} style={{ verticalAlign: 'middle' }} onDoubleClick={() => handleOpenCurrencyDialog(false, currency.id)}>
                            <td style={{ fontSize: 14, textAlign: 'center' }}>{currency.id}</td>
                            <td style={{ fontSize: 14 }}>{currency.name}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <CurrencyDialog openCurrencyDialog={openCurrencyDialog} handleCloseCurrencyDialog={handleCloseCurrencyDialog} onSubmit={isAddDialog === false ? updateCurrency : addNewCurrency} tempCurrency={tempCurrency} setTempCurrency={setTempCurrency} />
        </>
    );
}
export default Currency;