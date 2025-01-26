import { useState } from "react";

export function useHandleActions(defaultRow, prefix="") {  // permet de gérer les actions de la page de gestion des utilisateurs /!\ il doit forcément y avoir un id dans defaultRow (ce qui est logique mais pas spécifié)

    const [rows, setRows] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentRow, setCurrentRow] = useState(defaultRow);
    const [isEditing, setIsEditing] = useState(false);

    function handleOpenDialog()  {
        setOpenDialog(true);
    };

    function handleCloseDialog() {
        setOpenDialog(false);
        setIsEditing(false);
        setCurrentRow(defaultRow);
    };

    function handleEdit(row) {
        setCurrentRow(row);
        setIsEditing(true);
        handleOpenDialog();
    };

    function handleDelete(id) {
        const updatedRows = rows.filter((row) => row.id !== id);
        setRows(updatedRows);
    };

    function handleSave() {
        if (isEditing) {
            setRows((prev) =>
                prev.map((row) => (row.id === currentRow.id ? currentRow : row))
            );
        } else {
            setRows((prev) => [
                ...prev,
                { ...currentRow, id: `${prefix + (prev.length + 1)}` },
            ]);
        }
        handleCloseDialog();
    };

    const inputsProps = {
        currentRow,
        setCurrentRow,
        openDialog,
        handleEdit,
        handleDelete,
        handleSave,
        handleOpenDialog,
        handleCloseDialog,
        rows,
    }
    
    return inputsProps;
}