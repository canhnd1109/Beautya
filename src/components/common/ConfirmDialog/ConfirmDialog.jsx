import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";

export default function ConfirmDialog({
  open,
  setOpen,
  onClickAgree,
  label,
  content,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickAgree = async () => {
    try {
      await onClickAgree();
      setOpen(false);
    } catch (err) {
      setOpen(false);
      throw err;
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{label}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            autoFocus
            onClick={handleClose}
            style={{
              backgroundColor: "var(--primary, #A10550)",
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleClickAgree}
            autoFocus
            style={{
              backgroundColor: "var(--primary, #A10550)",
            }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
