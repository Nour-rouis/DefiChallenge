import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";


const CustomDataGrid = ({ name, allowAdd = true, columns, elements, onClickButton}) => {

    return (
        <Box sx={{ height: 400, width: "48%" }}>

            {allowAdd ? <Button
                variant="contained"
                color="primary"
                onClick={onClickButton}
                style={{ marginBottom: 16 }}
            >
                Ajouter {name.toLowerCase()}
            </Button> : null}
            <DataGrid
                rows={elements}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>

    )

};

export default CustomDataGrid;