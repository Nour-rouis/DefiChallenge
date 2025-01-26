import { Box, Button, InputLabel, Modal, Typography } from "@mui/material";

const CustomModal = ({ title, open, onClose, onValid, textFields, isEditing=false}) => {

    const textFieldsMapped = textFields.map((element) => (
        <Box sx={{ marginBottom: 2 }} key={element.props.id}>
            <InputLabel>{String(element.props.id).charAt(0).toUpperCase() + String(element.props.id).slice(1)}</InputLabel>
            {element}
        </Box>
    ));

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    minWidth: 400,
                }}>

                <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
                    {(isEditing?"Modifier ":"Ajouter ")+title.toLowerCase()}
                </Typography>
                <Box component="form" noValidate autoComplete="off">
                    {textFieldsMapped}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Button onClick={onClose} color="inherit">
                        Annuler
                    </Button>
                    <Button onClick={onValid} color="primary" variant="contained">
                        {isEditing?"Modifier":"Ajouter"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CustomModal;