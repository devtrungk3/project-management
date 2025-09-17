import { Dialog, DialogActions, DialogContent, TextField } from "@mui/material";
import { Button } from "react-bootstrap";

const TagRateDialog = ({ openTagRateDialog, handleCloseTagRateDialog, onSubmit, tempTagRate, setTempTagRate }) => {
    return (
        <>
            <Dialog
                sx={{
                    '& .MuiDialog-paper': {
                        width: '500px',
                        maxWidth: 'none'
                    }
                }}
                open={openTagRateDialog != 0}
                onClose={handleCloseTagRateDialog}
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
                        id="name"
                        name="name"
                        margin="dense"
                        label="Tag name"
                        value={tempTagRate?.tagName || ''}
                        onChange={(e) => setTempTagRate({...tempTagRate, tagName: e.target.value})}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        id="description"
                        name="description"
                        label="Description"
                        multiline
                        rows={3}
                        value={tempTagRate?.description || ''}
                        onChange={(e) => setTempTagRate({...tempTagRate, description: e.target.value})}
                    />
                    <TextField
                        fullWidth
                        required
                        margin="dense"
                        id="rate"
                        name="rate"
                        label="Rate"
                        type="decimal"
                        inputProps={{ min: 0 }}
                        value={tempTagRate?.rate || ''}
                        onChange={(e) => setTempTagRate({...tempTagRate, rate: e.target.value})}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTagRateDialog}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
export default TagRateDialog;