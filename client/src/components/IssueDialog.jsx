import { Dialog, DialogActions, DialogContent, TextField } from "@mui/material";
import { 
  Button, 
} from 'react-bootstrap';

const IssueDialog = ({ open, handleClose, onSubmit, tempIssue, setTempIssue }) => {
  return (
    <Dialog
      sx={{
        '& .MuiDialog-paper': {
          width: '500px',
          maxWidth: 'none'
        }
      }}
      open={open}
      onClose={handleClose}
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
          id="title"
          name="title"
          margin="dense"
          label="Issue Title"
          value={tempIssue?.title || ''}
          onChange={(e) => setTempIssue({...tempIssue, title: e.target.value})}
        />
        <TextField
          fullWidth
          margin="dense"
          id="description"
          name="description"
          label="Description"
          multiline
          rows={5}
          value={tempIssue?.description || ''}
          onChange={(e) => setTempIssue({...tempIssue, description: e.target.value})}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Create Issue</Button>
      </DialogActions>
    </Dialog>
  );
};
export default IssueDialog;