import { Box, Checkbox, Dialog, DialogActions, DialogContent, FormControlLabel, InputLabel, MenuItem, NativeSelect, Select, TextField } from "@mui/material";
import { Button, Col, FormControl, Row } from "react-bootstrap";
const TaskDialog = ({ isMyProject, openTaskDialog, handleCloseTaskDialog, tempTaskInfo, setTempTaskInfo, resources, tagRates, onSubmit }) => {
    const handleResourcesChange = (e, resource) => {
        if (e.target.checked) {
            setTempTaskInfo(prev => ({
                ...prev,
                resourceAllocations: [
                    ...prev.resourceAllocations || [],
                    {
                        resourceId: resource.id,
                        username: resource.username  
                    }
                ]
            }))
        } else {
            setTempTaskInfo(prev => ({
                ...prev,
                resourceAllocations: prev.resourceAllocations.filter(ra => ra.resourceId !== resource.id)
            }))
        }
    }
    const handleTagRateOfResourceAllocation = (e, resourceId) => {
        let tempResourceAllocation = tempTaskInfo?.resourceAllocations.find(ra => ra.resourceId === resourceId);
        if (tempResourceAllocation) {
            tempResourceAllocation.tagRateId = e.target.value;
            setTempTaskInfo(prev => ({
                ...prev,
                resourceAllocations: prev.resourceAllocations.map(ra => ra.resourceId === tempResourceAllocation.resourceId ? tempResourceAllocation : ra)
            }))            
        } else {
            e.target.value = 0
        }
    }
    return (
        <Dialog
            sx={{
                '& .MuiDialog-paper': {
                    width: '1000px',
                    maxWidth: 'none'
                }
            }}
            open={openTaskDialog != 0}
            onClose={handleCloseTaskDialog}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: onSubmit
                },
            }}
        >
            <DialogContent>
                <Row>
                    <Col md={6}>
                        <TextField
                            autoFocus
                            required
                            fullWidth
                            id="name"
                            name="name"
                            margin="dense"
                            label="Task name"
                            slotProps={{
                                input: {
                                    readOnly: isMyProject === false,
                                },
                            }}
                            value={tempTaskInfo?.name || ''}
                            onChange={(e) => setTempTaskInfo({...tempTaskInfo, name: e.target.value})}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            required
                            id="effort"
                            name="effort"
                            label="Effort"
                            type="decimal"
                            inputProps={{ min: 0 }}
                            slotProps={{
                                input: {
                                    readOnly: isMyProject != true,
                                },
                            }}
                            value={tempTaskInfo?.effort || 0}
                            onChange={(e) => setTempTaskInfo({...tempTaskInfo, effort: e.target.value})}
                        />
                        <Row>
                            <Col md={6}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    required
                                    id="start"
                                    name="start"
                                    label="Start"
                                    type="date"
                                    slotProps={{
                                        inputLabel: { shrink: true },
                                        input: {
                                            readOnly: isMyProject != true,
                                        },
                                    }}
                                    value={tempTaskInfo?.start || ''}
                                    onChange={(e) => setTempTaskInfo({...tempTaskInfo, start: e.target.value})}
                                />
                            </Col>
                            <Col md={6}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    required
                                    id="duration"
                                    name="duration"
                                    label="Duration"
                                    type="decimal"
                                    slotProps={{
                                        input: {
                                            readOnly: isMyProject != true,
                                        },
                                    }}
                                    inputProps={{ min: 0}}
                                    value={tempTaskInfo?.duration || 0}
                                    onChange={(e) => setTempTaskInfo({...tempTaskInfo, duration: e.target.value})}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    id="complete"
                                    name="complete"
                                    label="Complete %"
                                    type="number"
                                    inputProps={{ min: 0, max: 100 }}
                                    value={tempTaskInfo?.complete || 0}
                                    onChange={(e) => setTempTaskInfo({...tempTaskInfo, complete: e.target.value})}
                                />
                            </Col>
                            <Col md={6}>
                                <div style={{position:'relative'}} className="mt-2">
                                    <div className="dialog_input_label_container">
                                        <span className="dialog_input_label">Priority</span>
                                    </div>
                                    <select
                                        id="priority-select"
                                        value={tempTaskInfo?.priority || "LOW"}
                                        onChange={(e) => setTempTaskInfo({...tempTaskInfo, priority: e.target.value})}
                                        className="w-100 py-3 px-2 rounded-1 dialog_input"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6}>
                        <TextField
                            fullWidth
                            margin="dense"
                            id="description"
                            name="description"
                            label="Description"
                            multiline
                            rows={3}
                            slotProps={{
                                input: {
                                    readOnly: isMyProject != true,
                                },
                            }}
                            value={tempTaskInfo?.description || ''}
                            onChange={(e) => setTempTaskInfo({...tempTaskInfo, description: e.target.value})}
                        />
                        {isMyProject === true && 
                        <div style={{position:'relative'}}>
                            <div className="dialog_input_label_container">
                                <span className="dialog_input_label">Owners</span>
                            </div>
                            <Box
                                sx={{ 
                                    border: '1px solid #77e6c1ff',
                                    borderRadius: 1,
                                    p: 1,
                                    mt:1 ,
                                    height: '140px',
                                    overflow: 'auto'
                                }}
                            >
                                {resources?.map((resource) => (
                                    <div className="d-flex align-items-center" key={resource.id}>
                                        <select id="" className="border border-1 border-black rounded-1" value={(tempTaskInfo?.resourceAllocations || []).find(ra => ra.resourceId === resource.id)?.tagRateId} onChange={(e) => handleTagRateOfResourceAllocation(e, resource.id)}>
                                            <option key={0} value={0}>Tag rate</option>
                                            {
                                                tagRates?.map(tag => 
                                                    <option key={tag.id} value={tag.id}>{tag.tagName}</option>
                                                )
                                            }
                                        </select>
                                        <FormControlLabel
                                            control={
                                                <Checkbox 
                                                    checked={(tempTaskInfo?.resourceAllocations || []).some(ra => ra.resourceId === resource.id) || false}
                                                    onChange={(e) => handleResourcesChange(e, resource)}
                                                />
                                            }
                                            label={resource.username}
                                            sx={{ display: 'block', ml: 0 }}
                                        />                              
                                    </div>
                                ))}
                            </Box>
                        </div>}
                    </Col>
                </Row>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseTaskDialog}>Cancel</Button>
                <Button type="submit">Save</Button>
            </DialogActions>
        </Dialog>
    );
}
export default TaskDialog;