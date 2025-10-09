import { DialogTitle, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SearchDialog = ({openSearchDialog, setOpenSearchDialog, isMyProject}) => {
    const navigate = useNavigate();
    const onSubmit = (e) => {
        e.preventDefault();
        let validSearch = false;
        const formData = new FormData(e.target);
        const formJson = Object.fromEntries(formData.entries());
        let searchUrl = `/user/${isMyProject ? 'my-projects' : 'joined-projects'}`;
        if (formJson.name!= "") {
            searchUrl += "?name=" + formJson.name;
            validSearch = true;
        }
        if (!isMyProject && formJson.owner != "") {
            searchUrl += validSearch == true ? '&' : '?';
            validSearch = true;
            searchUrl += "owner=" + formJson.owner;
        }
        if (formJson.status != "ALL") {
            searchUrl += validSearch == true ? '&' : '?';
            validSearch = true;
            searchUrl += "status="+formJson.status;
        }
        navigate(searchUrl);
        setOpenSearchDialog(false);
    }
    return (
        <>
            <Dialog
                sx={{
                    '& .MuiDialog-paper': {
                        width: '500px',
                        maxWidth: 'none'
                    }
                }}
                open={openSearchDialog == true}
                onClose={() => setOpenSearchDialog(false)}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: onSubmit
                    },
                }}
            >
                <DialogTitle>Find what you're looking for</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        id="name"
                        name="name"
                        margin="dense"
                        label="Project name"
                    />
                    {!isMyProject && <TextField
                        fullWidth
                        id="owner"
                        name="owner"
                        margin="dense"
                        label="Owner's username"
                    />}
                    <div style={{position:'relative'}} className="mt-2">
                        <div className="dialog_input_label_container">
                            <span className="dialog_input_label">Status</span>
                        </div>
                        <select
                            id="status-select"
                            name="status"
                            className="w-100 py-3 px-2 rounded-1 dialog_input"
                        >
                            <option value="ALL">All</option>
                            <option value="PLANNING">Planning</option>
                            <option value="IN_PROGRESS">In progress</option>
                            <option value="DONE">Done</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSearchDialog(false)}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
export default SearchDialog;