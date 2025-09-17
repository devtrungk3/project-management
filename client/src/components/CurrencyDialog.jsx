import { Dialog, DialogActions, DialogContent, TextField } from "@mui/material";
import { Button } from "react-bootstrap";

const CurrencyDialog = ({ openCurrencyDialog, handleCloseCurrencyDialog, onSubmit, tempCurrency, setTempCurrency }) => {
    return (
        <>
        <Dialog
            sx={{
                '& .MuiDialog-paper': {
                    width: '500px',
                    maxWidth: 'none'
                }
            }}
            open={openCurrencyDialog != 0}
            onClose={handleCloseCurrencyDialog}
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
                    label="Currency name"
                    value={tempCurrency?.name || ''}
                    onChange={(e) => setTempCurrency({...tempCurrency, name: e.target.value})}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseCurrencyDialog}>Cancel</Button>
                <Button type="submit">Save</Button>
            </DialogActions>
        </Dialog>
        </>
    );
}
export default CurrencyDialog;