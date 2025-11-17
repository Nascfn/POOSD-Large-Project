import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from "@mui/material/IconButton";
import { grey, blue, red, orange, green } from '@mui/material/colors';

function HomePage() {
  const navigate = useNavigate();

  const [openAddCategory, setOpenAddCategory] = React.useState(false);
  const [openAddExpense, setOpenAddExpense] = React.useState(false);
  const [openEditBudget, setOpenEditBudget] = React.useState(false);
  const [openDeleteCategory, setOpenDeleteCategory] = React.useState(false);

  const [openEditTransaction, setOpenEditTransaction] = React.useState(false);
  const [editTxId, setEditTxId] = React.useState("");
  const [editTxValue, setEditTxValue] = React.useState("");
  const [editTxDesc, setEditTxDesc] = React.useState("");

  const [expenseValue, setExpenseValue] = React.useState("");
  const [budgetValue, setBudgetValue] = React.useState("");
  const [expCatDropVal, setExpCatDropVal] = React.useState("");
  const [budCatDropVal, setBudCatDropVal] = React.useState("");
  const [newCat, setNewCat] = React.useState("");
  const [newCatBudget, setNewCatBudget] = React.useState("");
  const [newExpenseDesc, setNewExpenseDesc] = React.useState("");
  const [categoryToDelete, setCategoryToDelete] = React.useState("");

  const [expCatDropdownOpen, setExpDropDownOpen] = React.useState(false);
  const [budCatDropdownOpen, setBudDropDownOpen] = React.useState(false);
  const [delCatDropdownOpen, setDelCatDropdownOpen] = React.useState(false);

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

  const fetchData = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const goalsRes = await fetch('/api/goals', { headers });
      const goalsData = await goalsRes.json();

      const txRes = await fetch('/api/transactions', { headers });
      const txData = await txRes.json();

      const spendMap: Record<string, number> = {};

      const formattedRows = txData.map((tx: any) => {
        const goal = tx.goalId;

        if (goal && goal._id) {
          spendMap[goal._id] = (spendMap[goal._id] || 0) + tx.amount;
        }

        return {
          id: tx._id,
          date: new Date(tx.date).toLocaleString(),
          total: tx.amount,
          category: goal ? goal.category : 'Uncategorized',
          description: tx.note,
        };
      });

      const formattedCategories = goalsData.map((goal: any) => ({
        id: goal._id,
        max: goal.amount,
        current: spendMap[goal._id] || 0,
        name: goal.category,
      }));

      setRows(formattedRows);
      setCategories(formattedCategories);

    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

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

  const handleOpenEditTransaction = (id: string, currentAmount: number, currentDesc: string) => {
    setEditTxId(id);
    setEditTxValue(currentAmount.toString());
    setEditTxDesc(currentDesc);
    setOpenEditTransaction(true);
  };

  const handleCloseEditTransaction = () => {
    setOpenEditTransaction(false);
    setEditTxId("");
    setEditTxValue("");
    setEditTxDesc("");
  };

  const handleEditTxValueInput = (event: React.ChangeEvent<HTMLInputElement>) => setEditTxValue(event.target.value);
  const handleEditTxDescInput = (event: React.ChangeEvent<HTMLInputElement>) => setEditTxDesc(event.target.value);

  const handleExpenseInput = (event: React.ChangeEvent<HTMLInputElement>) => setExpenseValue(event.target.value);
  const handleBudgetInput = (event: React.ChangeEvent<HTMLInputElement>) => setBudgetValue(event.target.value);
  const handleNewCatNameInput = (event: React.ChangeEvent<HTMLInputElement>) => setNewCat(event.target.value);
  const handleNewCatMaxInput = (event: React.ChangeEvent<HTMLInputElement>) => setNewCatBudget(event.target.value);
  const handleNewExpenseDesc = (event: React.ChangeEvent<HTMLInputElement>) => setNewExpenseDesc(event.target.value);

  const addExpense = async () => {
    if (!expCatDropVal || !expenseValue) {
      return;
    }

    const selectedCategory = categories.find(c => c.name === expCatDropVal);

    if (!selectedCategory) {
      console.error("Category not found");
      return;
    }

    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalId: selectedCategory.id,
          amount: parseFloat(expenseValue) || 0,
          note: newExpenseDesc || "Expense",
          date: new Date(),
        }),
      });

      if (response.ok) {
        fetchData();
        handleCloseAddExpense();
        setExpenseValue("");
        setNewExpenseDesc("");
        setExpCatDropVal("");
      } else {
        console.error("Failed to add expense");
      }
    } catch (err) {
      console.error("Error connecting to server", err);
    }
  };

  const editBudget = async () => {
    if (!budCatDropVal || !budgetValue) return;

    const selectedCategory = categories.find(c => c.name === budCatDropVal);
    if (!selectedCategory) return;

    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`/api/goals/${selectedCategory.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(budgetValue),
        }),
      });

      if (response.ok) {
        fetchData();
        handleCloseEditBudget();
        setBudgetValue("");
        setBudCatDropVal("");
      }
    } catch (err) {
      console.error("Error updating budget", err);
    }
  };

  const updateTransaction = async () => {
    if (!editTxId || !editTxValue) return;

    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`/api/transactions/${editTxId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(editTxValue),
          note: editTxDesc
        }),
      });

      if (response.ok) {
        fetchData();
        handleCloseEditTransaction();
      }
    } catch (err) {
      console.error("Error updating transaction", err);
    }
  };

  const addCategory = async () => {
    if (!newCat || !newCatBudget) return;

    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: newCat,
          amount: parseFloat(newCatBudget),
        }),
      });

      if (response.ok) {
        fetchData();
        handleCloseAddCategory();
        setNewCat("");
        setNewCatBudget("");
      } else {
        console.error("Failed to add category");
      }
    } catch (err) {
      console.error("Error connecting to server", err);
    }
  };

  const deleteCategory = async () => {
    if (!categoryToDelete) {
      alert("Please select a category to delete.");
      return;
    }

    const selectedCategory = categories.find(c => c.name === categoryToDelete);
    if (!selectedCategory) return;

    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`/api/goals/${selectedCategory.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchData();
        handleCloseDeleteCategory();
        setCategoryToDelete("");
      }
    } catch (err) {
      console.error("Error deleting category", err);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchData();
      } else {
        console.error("Failed to delete transaction");
      }
    } catch (err) {
      console.error("Error deleting transaction", err);
    }
  };

  const columns: GridColDef[] = [
    { field: "date", headerName: "Date", width: 200, editable: false },
    { field: "total", headerName: "Total", type: "number", width: 110, editable: false },
    { field: "category", headerName: "Category", sortable: true, width: 160 },
    { field: "description", headerName: "Description", sortable: true, flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="edit"
            color="primary"
            onClick={() => handleOpenEditTransaction(params.row.id, params.row.total, params.row.description)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            color="error"
            onClick={() => deleteTransaction(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

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
  const greenData = catData.map((data, index) => (diffData[index] >= 0 ? data : null));
  const yellowData = diffData.map((data) => (data > 0 ? data : null));
  const redData = catData.map((data, index) => (diffData[index] < 0 ? data : null));

  return (
    <>
      <Dialog open={openAddExpense} onClose={handleCloseAddExpense}>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter expense amount and description.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Expense Amount"
            type="number"
            fullWidth
            variant="outlined"
            onChange={handleExpenseInput}
            required
          />
          <TextField
            margin="dense"
            label="Expense Description"
            type="text"
            fullWidth
            variant="outlined"
            onChange={handleNewExpenseDesc}
            required
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="exp-categories-drop-down">Category</InputLabel>
            <Select
              labelId="exp-categories-drop-down"
              open={expCatDropdownOpen}
              onClose={handleExpDropClose}
              onOpen={handleExpDropOpen}
              value={expCatDropVal}
              label="Category"
              onChange={handleExpDropChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddExpense}>Cancel</Button>
          <Button onClick={addExpense} variant="contained">Add Expense</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditBudget} onClose={handleCloseEditBudget}>
        <DialogTitle>Edit Category Budget</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a category and set its new budget amount.
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="bud-categories-drop-down">Category</InputLabel>
            <Select
              labelId="bud-categories-drop-down"
              open={budCatDropdownOpen}
              onClose={handleBudDropClose}
              onOpen={handleBudDropOpen}
              value={budCatDropVal}
              label="Category"
              onChange={handleBudDropChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="New Budget Amount"
            type="number"
            fullWidth
            variant="outlined"
            onChange={handleBudgetInput}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditBudget}>Cancel</Button>
          <Button onClick={editBudget} variant="contained">Set Budget</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditTransaction} onClose={handleCloseEditTransaction}>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the amount or description for this transaction.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={editTxValue}
            onChange={handleEditTxValueInput}
            required
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={editTxDesc}
            onChange={handleEditTxDescInput}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditTransaction}>Cancel</Button>
          <Button onClick={updateTransaction} variant="contained">Save Changes</Button>
        </DialogActions>
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

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          mb: 3
        }}>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 0 } }}>
            <Box sx={{
              backgroundColor: 'primary.main',
              borderRadius: '50%',
              padding: '6px',
              display: 'inline-flex',
              marginRight: '12px'
            }}>
              <AttachMoneyIcon sx={{ color: 'primary.contrastText', fontSize: '24px' }} />
            </Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              FINANCE TRACKING APP
            </Typography>
          </Box>

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Log Out
          </Button>
        </Box>

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
                      color: green[300],
                      stack: "total",
                      label: "Remaining"
                    },
                    {
                      data: redData,
                      color: orange[600],
                      stack: "total",
                      label: "Over Budget"
                    },
                  ]} xAxis={[{
                    scaleType: "band",
                    data: categories.map((cat) => cat.name.substring(0, 10)),
                  }]}
                  yAxis={[{ min: 0, tickMinStep: 50 }]}
                  margin={{ top: 60, bottom: 50, left: 30, right: 70 }}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pl: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Recent Transactions
              </Typography>
              <Button
                variant="contained"
                startIcon={<AttachMoneyIcon />}
                onClick={handleOpenAddExpense}
                disabled={noCategoriesExist}
                size="small"
              >
                Add Expense
              </Button>
            </Box>

            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5]}
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