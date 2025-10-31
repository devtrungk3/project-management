import { Dialog, DialogActions, DialogContent, TextField } from "@mui/material";
import { Button, Col, Row } from "react-bootstrap";
const ExtraCostDialog = ({ openExtraCostDialog, handleCloseExtraCostDialog, tempExtraCost, setTempExtraCost, onSubmit }) => {
    return (
        <Dialog
            sx={{
                '& .MuiDialog-paper': {
                    width: '500px',
                    maxWidth: 'none'
                }
            }}
            open={openExtraCostDialog != 0}
            onClose={handleCloseExtraCostDialog}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: onSubmit
                },
            }}
        >
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    fullWidth
                    id="item"
                    name="item"
                    margin="dense"
                    label="Item"
                    value={tempExtraCost?.item || ''}
                    onChange={(e) => setTempExtraCost({...tempExtraCost, item: e.target.value})}
                />
                <Row>
                    <Col md={6}>
                        <TextField
                            fullWidth
                            margin="dense"
                            id="cost"
                            name="cost"
                            label="Cost"
                            type="number"
                            inputProps={{ min: 0, step: 0.01 }}
                            value={tempExtraCost?.cost || 0}
                            onChange={(e) => setTempExtraCost({...tempExtraCost, cost: Number(e.target.value) })}
                        />
                    </Col>
                    <Col md={6}>
                        <div style={{position:'relative'}} className="mt-2">
                            <div className="dialog_input_label_container">
                                <span className="dialog_input_label">Status</span>
                            </div>
                            <select
                                id="status-select"
                                value={tempExtraCost?.status || "UNPAID"}
                                name="status"
                                onChange={(e) => setTempExtraCost({...tempExtraCost, status: e.target.value})}
                                className="w-100 py-3 px-2 rounded-1 dialog_input"
                            >
                                <option value="PAID">Paid</option>
                                <option value="UNPAID">Unpaid</option>
                            </select>
                        </div>
                    </Col>
                </Row>
                <TextField
                    fullWidth
                    margin="dense"
                    id="description"
                    name="description"
                    label="Description"
                    multiline
                    rows={3}
                    value={tempExtraCost?.description || ''}
                    onChange={(e) => setTempExtraCost({...tempExtraCost, description: e.target.value})}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseExtraCostDialog}>Cancel</Button>
                <Button type="submit">Save</Button>
            </DialogActions>
        </Dialog>
    );
}
export default ExtraCostDialog;