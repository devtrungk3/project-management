import { Box, Checkbox, Dialog, DialogActions, DialogContent, FormControlLabel, TextField } from "@mui/material";
import { Button, Col, Row } from "react-bootstrap";
const TaskDialog = ({ openTaskDialog, handleCloseTaskDialog, tempTaskInfo, setTempTaskInfo, resources, onSubmit }) => {
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
                            value={tempTaskInfo?.effort || ''}
                            onChange={(e) => setTempTaskInfo({...tempTaskInfo, effort: e.target.value})}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            id="duration"
                            name="duration"
                            label="Duration"
                            type="number"
                            value={tempTaskInfo?.duration || ''}
                            onChange={(e) => setTempTaskInfo({...tempTaskInfo, duration: e.target.value})}
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
                                        inputLabel: { shrink: true }
                                    }}
                                    value={tempTaskInfo?.start || ''}
                                    onChange={(e) => setTempTaskInfo({...tempTaskInfo, start: e.target.value})}
                                />
                            </Col>
                            <Col md={6}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    id="finish"
                                    name="finish"
                                    label="Finish"
                                    type="date"
                                    slotProps={{
                                        inputLabel: { shrink: true }
                                    }}
                                    value={tempTaskInfo?.finish || ''}
                                    onChange={(e) => setTempTaskInfo({...tempTaskInfo, finish: e.target.value})}
                                />
                            </Col>
                        </Row>
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
                        <TextField
                            fullWidth
                            margin="dense"
                            id="description"
                            name="description"
                            label="Description"
                            multiline
                            rows={3}
                            value={tempTaskInfo?.description || ''}
                            onChange={(e) => setTempTaskInfo({...tempTaskInfo, description: e.target.value})}
                        />
                        <div sx={{ mt: 2 }}>Owners</div>
                        <Box
                            sx={{ 
                                border: '1px solid #e0e0e0',
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