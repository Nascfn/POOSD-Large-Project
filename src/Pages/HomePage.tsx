import React, { useState } from "react";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddchartIcon from "@mui/icons-material/Addchart";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { grey, blue, red } from '@mui/material/colors';

function HomePage() {
  const [openAddCategory, setOpenAddCategory] = React.useState(false);
  const [openAddExpense, setOpenAddExpense] = React.useState(false);
  const [openEditBudget, setOpenEditBudget] = React.useState(false);
  const [openDeleteCategory, setOpenDeleteCategory] = React.useState(false);

  const [expenseValue, setExpenseValue] = React.useState("");
  const [budgetValue, setBudgetValue] = React.useState("");
  const [expCatDropVal, setExpCatDropVal] = React.useState("");
  const [budCatDropVal, setBudCatDropVal] = React.useState("");
  const [newCat, setNewCat] = React.useState("");
  const [newCatBudget, setNewCatBudget] = React.useState("");

  const [rows, setRows] = useState<
    Array<{
      id: number;
      date: string;
      total: number;
      category: string;
      description: string;
    }>
  >([]);

  const [categories, setCategories] = useState<
    Array<{
      id: number;
      max: number;
      current: number;
      name: string;
    }>
  >([]);

  const noCategoriesExist = categories.length === 0;

  const handleExpDropChange = (event: SelectChangeEvent<typeof expCatDropVal>) => setExpCatDropVal(event.target.value);
  const handleExpDropClose = () => setExpDropDownOpen(false);
  const handleExpDropOpen = () => setExpDropDownOpen(true);

  const handleBudDropChange = (event: SelectChangeEvent<typeof budCatDropVal>) => setBudCatDropVal(event.target.value);
  const handleBudDropClose = () => setBudDropDownOpen(false);
  const handleBudDropOpen = () => setBudDropDownOpen(true);

  const handleDelCatDropChange = (event: SelectChangeEvent<typeof categoryToDelete>) => setCategoryToDelete(event.target.value);
  const handleDelCatDropClose = () => setDelCatDropdownOpen(false);
  const handleDelCatDropOpen = () => setDelCatDropdownOpen(true);

  const handleOpenAddCategory = () => setOpenAddCategory(true);
  const handleCloseAddCategory = () => setOpenAddCategory(false);

  const handleOpenAddExpense = () => {
    if (noCategoriesExist) return;
    setOpenAddExpense(true);
  };
  const handleCloseAddExpense = () => setOpenAddExpense(false);

  const handleOpenEditBudget = () => {
    if (noCategoriesExist) return;
    setOpenEditBudget(true);
  };
  const handleCloseEditBudget = () => setOpenEditBudget(false);

  const handleOpenDeleteCategory = () => {
    if (noCategoriesExist) return;
    setOpenDeleteCategory(true);
  };
  const handleCloseDeleteCategory = () => {
    setOpenDeleteCategory(false);
    setCategoryToDelete("");
  };

  const handleBudgetInput = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setBudgetValue(event.target.value);
    console.log(budgetValue);
  };

  const handleNewCatNameInput = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setNewCat(event.target.value);
    console.log(newCat);
  };

  const handleNewCatMaxInput = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setNewCatBudget(event.target.value);
    console.log(newCatBudget);
  };

  const addExpense = () => {
    if (!expCatDropVal) {
      return;
    }
    const newExpense = {
      id: rows.length + 1,
      date: getCurrentDateTime(),
      total: parseFloat(expenseValue) || 0,
      category: expCatDropVal,
      description: newExpenseDesc,
    };
    setRows([...rows, newExpense]);
    setCategories(
      categories.map((cat) => (cat.name === newExpense.category ? { ...cat, current: cat.current + newExpense.total } : cat))
    );
    handleCloseAddExpense();
  };

  const editBudget = () => {
    if (!budCatDropVal) {
      return;
    }
    setCategories(
      categories.map((cat) => {
        if (cat.name === budCatDropVal) {
          return { ...cat, max: parseFloat(budgetValue) || 0 };
        }
        return cat;
      })
    );
    handleCloseEditBudget();
  };

  const addCategory = () => {
    if (!newCat || !newCatBudget) {
      return;
    }
    const newCategory = {
      id: categories.length + 1,
      max: parseFloat(newCatBudget) || 0,
      current: 0,
      name: newCat,
    };
    setCategories([...categories, newCategory]);
    handleCloseAddCategory();
  };

  const deleteCategory = () => {
    if (!categoryToDelete) {
      alert("Please select a category to delete.");
      return;
    }
    setCategories(categories.filter(cat => cat.name !== categoryToDelete));
    setRows(rows.filter(row => row.category !== categoryToDelete));
    handleCloseDeleteCategory();
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "date",
      headerName: "Date",
      width: 200,
      editable: false,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      width: 110,
      editable: false,
    },
    {
      field: "category",
      headerName: "Category",
      sortable: true,
      width: 160,
    },
  ];

  const getCurrentDateTime = (): string => new Date().toLocaleString();

  const actions = [
    {
      icon: <AddchartIcon />,
      name: "Add Category",
      onClick: handleOpenAddCategory,
      disabled: false
    },
    {
      icon: <EditIcon />,
      name: "Edit Budget",
      onClick: handleOpenEditBudget,
      disabled: noCategoriesExist
    },
    {
      icon: <AttachMoneyIcon />,
      name: "Add Expense",
      onClick: handleOpenAddExpense,
      disabled: noCategoriesExist
    },
    {
      icon: <DeleteIcon />,
      name: "Remove Category",
      onClick: handleOpenDeleteCategory,
      disabled: noCategoriesExist
    }
  ];

  const maxData = categories.map((cat) => cat.max);
  const catData = categories.map((cat) => cat.current);
  const diffData = maxData.map((data, index) => data - catData[index]);
  let total = 0;
  for (let i = 0; i < maxData.length; i++) {
    total += (maxData[i] || 0) - (catData[i] || 0);
  }
  const greenData = catData.map((data, index) => (diffData[index] > 0 ? data : null));
  const yellowData = diffData.map((data) => (data > 0 ? data : null));
  const redData = catData.map((data, index) => (diffData[index] <= 0 ? data : null));

  return (
    <>
      <div>
        <Dialog open={openExp} onClose={handleExpClose}>
          {categories.length === 0 ? (
            <DialogTitle>Must Add a Category First</DialogTitle>
          ) : (
            <>
              <DialogTitle>Add Expense</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Enter expense details here.
                </DialogContentText>
                <TextField
                  id="outlined-basic"
                  label="Expense Amount"
                  margin="dense"
                  variant="outlined"
                  InputLabelProps={{
                    style: { color: "black" },
                  }}
                  sx={{
                    input: { color: "black" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black",
                      },
                      "&:hover fieldset": {
                        borderColor: "black",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                  }}
                  required={true}
                  onChange={handleExpenseInput}
                />
                <DialogContentText>
                  Select category of expense.
                </DialogContentText>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <InputLabel id="categories-drop-down">Category</InputLabel>
                  <Select
                    labelId="categories-drop-down"
                    id="controlled-categories-drop-down"
                    open={expCatDropdownOpen}
                    onClose={handleExpDropClose}
                    onOpen={handleExpDropOpen}
                    value={expCatDropVal}
                    label="Category"
                    onChange={handleExpDropChange}
                  >
                    {categories.map((category) => (
                      <MenuItem value={category.name}>{category.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <button onClick={addExpense}>Add</button>
              </DialogActions>
              <DialogTitle>Add to Budget</DialogTitle>
              <DialogContent>
                <DialogContentText>Enter amount to add.</DialogContentText>
                <TextField
                  id="outlined-basic"
                  label="Expense Amount"
                  margin="dense"
                  variant="outlined"
                  InputLabelProps={{
                    style: { color: "black" },
                  }}
                  sx={{
                    input: { color: "black" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black",
                      },
                      "&:hover fieldset": {
                        borderColor: "black",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                  }}
                  required={true}
                  onChange={handleBudgetInput}
                />
                <DialogContentText>
                  Select category to add to.
                </DialogContentText>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <InputLabel id="categories-drop-down">Category</InputLabel>
                  <Select
                    labelId="categories-drop-down"
                    id="controlled-categories-drop-down"
                    open={budCatDropdownOpen}
                    onClose={handleBudDropClose}
                    onOpen={handleBudDropOpen}
                    value={budCatDropVal}
                    label="Category"
                    onChange={handleBudDropChange}
                  >
                    {categories.map((category) => (
                      <MenuItem value={category.name}>{category.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <button onClick={addToBudget}>Add</button>
              </DialogActions>
            </>
          )}
        </Dialog>

      <Dialog open={openAddCategory} onClose={handleCloseAddCategory}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create a new budget category and set its monthly limit.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            onChange={handleNewCatNameInput}
            required
          />
          <TextField
            margin="dense"
            label="Budget Amount"
            type="number"
            fullWidth
            variant="outlined"
            onChange={handleNewCatMaxInput}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddCategory}>Cancel</Button>
          <Button onClick={addCategory} variant="contained">Add Category</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteCategory} onClose={handleCloseDeleteCategory}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a category to delete. This will also remove all associated transactions. This action cannot be undone.
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="del-categories-drop-down">Category</InputLabel>
            <Select
              labelId="del-categories-drop-down"
              open={delCatDropdownOpen}
              onClose={handleDelCatDropClose}
              onOpen={handleDelCatDropOpen}
              value={categoryToDelete}
              label="Category"
              onChange={handleDelCatDropChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteCategory}>Cancel</Button>
          <Button onClick={deleteCategory} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        <Stack spacing={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: (theme) => theme.shape.borderRadius,
              backgroundColor: 'background.paper',
              position: 'relative',
            }}
          >
            <Typography variant="h6" gutterBottom align="left" sx={{ pl: 1, fontWeight: 'bold' }}>
              Budget Overview
            </Typography>
            <Box sx={{ width: "100%", height: 350 }}>
              {categories.length > 0 ? (
                <BarChart
                  series={[
                    {
                      data: greenData,
                      color: blue[600],
                      stack: "total",
                      label: "Money Spent"
                    },
                    {
                      data: yellowData,
                      color: grey[300],
                      stack: "total",
                      label: "Remaining"
                    },
                    {
                      data: redData,
                      color: red[600],
                      stack: "total",
                      label: "Over Budget"
                    },
                  ]} xAxis={[{
                    scaleType: "band",
                    data: categories.map((cat) => cat.name.substring(0, 10)),
                  }]}
                  yAxis={[{ min: 0, tickMinStep: 50 }]}
                  margin={{ top: 60, bottom: 30, left: 50, right: 20 }}
                  grid={{ horizontal: true }}
                  slotProps={{
                    legend: {
                      position: { vertical: 'top', horizontal: 'center' }
                    }
                  }}
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'text.secondary' }}>
                  No budget categories created yet.
                </Box>
              )}

            </Box>

            <SpeedDial
              ariaLabel="SpeedDial"
              sx={{
                position: "absolute",
                bottom: 16,
                right: 16,
              }}
              icon={<SpeedDialIcon />}
            >
              {actions.map((action) => (
                <SpeedDialAction
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.name}
                  onClick={action.disabled ? undefined : action.onClick}
                  sx={{
                    opacity: action.disabled ? 0.38 : 1,
                    bgcolor: action.disabled ? 'rgba(0, 0, 0, 0.12)' : undefined,
                    '&:hover': {
                      bgcolor: action.disabled ? 'rgba(0, 0, 0, 0.12)' : undefined,
                      cursor: action.disabled ? 'not-allowed' : 'pointer'
                    }
                  }}
                  FabProps={{
                    disabled: action.disabled
                  }}
                />
              ))}

            </SpeedDial>
          </Paper>

          <Paper
            elevation={3}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: (theme) => theme.shape.borderRadius,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Total Remaining Balance
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: total >= 0 ? 'primary.main' : 'error.main' }}>
              ${total.toFixed(2)}
            </Typography>
          </Paper>

          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: (theme) => theme.shape.borderRadius,
              backgroundColor: 'background.paper',
              width: '100%'
            }}
          >
            <Typography variant="h6" gutterBottom align="left" sx={{ pl: 1, fontWeight: 'bold' }}>
              Recent Transactions
            </Typography>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
                slots={{
                  noRowsOverlay: () => (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      No expenses yet
                    </Box>
                  ),
                }}
                sx={{
                  border: 0,
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: grey[100],
                  }
                }}
              />
            </Box>
          </Paper>

        </Stack>
      </Box>
    </>
  );
}

export default HomePage;
