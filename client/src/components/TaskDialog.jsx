import { Box, Checkbox, Dialog, DialogActions, DialogContent, FormControlLabel, InputLabel, MenuItem, NativeSelect, Select, TextField } from "@mui/material";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import style from './TaskDialog.module.css'
const TaskDialog = ({ isMyProject, openTaskDialog, handleCloseTaskDialog, tempTaskInfo, setTempTaskInfo, resources, onSubmit }) => {
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
                            id="effort"
                            name="effort"
                            label="Effort"
                            type="number"
                            slotProps={{
                                input: {
                                    readOnly: isMyProject != true,
                                },
                            }}
                            value={tempTaskInfo?.effort || ''}
                            onChange={(e) => setTempTaskInfo({...tempTaskInfo, effort: e.target.value})}
                        />
                        <Row>
                            <Col md={6}>
                                <TextField
                                    fullWidth
                                    margin="dense"
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
                                    id="duration"
                                    name="duration"
                                    label="Duration"
                                    type="number"
                                    slotProps={{
                                        input: {
                                            readOnly: isMyProject != true,
                                        },
                                    }}
                                    value={tempTaskInfo?.duration || ''}
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
                                    value={tempTaskInfo?.complete || ''}
                                    onChange={(e) => setTempTaskInfo({...tempTaskInfo, complete: e.target.value})}
                                />
                            </Col>
                            <Col md={6}>
                                <div style={{position:'relative'}} className="mt-2">
                                    <div className={`${style['input-label-container']}`}>
                                        <span className={`${style['input-label']}`}>Priority</span>
                                    </div>
                                    <select
                                        id="priority-select"
                                        value={tempTaskInfo?.priority || "LOW"}
                                        onChange={(e) => setTempTaskInfo({...tempTaskInfo, priority: e.target.value})}
                                        className={`w-100 py-3 px-2 rounded-1 ${style.input}`}
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
                            <div className={`${style['input-label-container']}`}>
                                <span className={`${style['input-label']}`}>Owners</span>
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
                                    <FormControlLabel
                                        key={resource.id}
                                        control={
                                            <Checkbox 
                                                checked={(tempTaskInfo?.resourceAllocations || []).find(ra => ra.resourceId === resource.id) || false}
                                                onChange={(e) => handleResourcesChange(e, resource)}
                                            />
                                        }
                                        label={resource.username}
                                        sx={{ display: 'block', ml: 0 }}
                                    />
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