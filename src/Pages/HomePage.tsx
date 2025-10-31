import React, { useState } from "react";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
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

function HomePage() {
  const [openExp, setExpOpen] = React.useState(false);
  const [openCat, setCatOpen] = React.useState(false);
  const [expenseValue, setExpenseValue] = React.useState("");
  const [budgetValue, setBudgetValue] = React.useState("");
  const [expCatDropVal, setExpCatDropVal] = React.useState("");
  const [expCatDropdownOpen, setExpDropDownOpen] = React.useState(false);
  const [budCatDropVal, setBudCatDropVal] = React.useState("");
  const [budCatDropdownOpen, setBudDropDownOpen] = React.useState(false);
  const [newCat, setNewCat] = React.useState("");
  const [newCatBudget, setNewCatBudget] = React.useState("");
  const [newExpenseDesc, setNewExpenseDesc] = React.useState("");

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

  const handleExpDropChange = (
    event: SelectChangeEvent<typeof expCatDropVal>
  ) => {
    setExpCatDropVal(event.target.value);
  };
  const handleExpDropClose = () => {
    setExpDropDownOpen(false);
  };
  const handleExpDropOpen = () => {
    setExpDropDownOpen(true);
  };

  const handleBudDropChange = (
    event: SelectChangeEvent<typeof budCatDropVal>
  ) => {
    setBudCatDropVal(event.target.value);
  };
  const handleBudDropClose = () => {
    setBudDropDownOpen(false);
  };
  const handleBudDropOpen = () => {
    setBudDropDownOpen(true);
  };

  const handleExpClickOpen = () => {
    setExpOpen(true);
  };
  const handleCatClickOpen = () => {
    setCatOpen(true);
  };

  const handleExpClose = () => {
    setExpOpen(false);
  };
  const handleCatClose = () => {
    setCatOpen(false);
  };

  const handleExpenseInput = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setExpenseValue(event.target.value);
    console.log(expenseValue);
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

  const handleNewExpenseDesc = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setNewExpenseDesc(event.target.value);
    console.log(newExpenseDesc);
  };

  const addExpense = () => {
    const newExpense = {
      id: rows.length + 1,
      date: getCurrentDateTime(),
      total: parseFloat(expenseValue) || 0,
      category: expCatDropVal,
      description: newExpenseDesc,
    };
    setRows([...rows, newExpense]);

    setCategories(
      categories.map((cat) => {
        if (cat.name === newExpense.category) {
          return {
            ...cat,
            current: cat.current + newExpense.total,
          };
        }
        return cat;
      })
    );

    console.log("expense added: " + expenseValue);
    handleExpClose();
  };

  const addToBudget = () => {
    setCategories(
      categories.map((cat) => {
        if (cat.name === budCatDropVal) {
          return {
            ...cat,
            max: cat.max + parseFloat(budgetValue),
          };
        }
        return cat;
      })
    );

    console.log("expense added: " + expenseValue);
    handleExpClose();
  };

  const addCategory = () => {
    const newCategory = {
      id: categories.length + 1,
      max: parseFloat(newCatBudget),
      current: 0,
      name: newCat,
    };
    setCategories([...categories, newCategory]);
    console.log(newCategory);
    handleCatClose();
  };

  const columns: GridColDef[] = [
    //{ field: "id", headerName: "ID", width: 90 },
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
      editable: true,
    },
    {
      field: "category",
      headerName: "Category",
      sortable: true,
      width: 160,
    },
    {
      field: "description",
      headerName: "Description",
      sortable: true,
      width: 160,
    },
  ];

  const getCurrentDateTime = (): string => {
    const now = new Date();
    return now.toLocaleString();
  };

  const actions = [
    {
      icon: <AddchartIcon />,
      name: "Add Category",
      onClick: handleCatClickOpen,
    },
    {
      icon: <AttachMoneyIcon />,
      name: "Add Expense",
      onClick: handleExpClickOpen,
    },
  ];

  const maxData = categories.map((cat) => cat.max);
  const catData = categories.map((cat) => cat.current);
  const diffData = maxData.map((data, index) => data - catData[index]);
  let balance = 0;

  let total = 0;

  for (let i = 0; i < catData.length; i++) {
    total += maxData[i] - catData[i];
  }

  const greenData = catData.map((data, index) =>
    diffData[index] > 0 ? data : null
  );

  const yellowData = diffData.map((data) => (data > 0 ? data : null));

  const redData = catData.map((data, index) =>
    diffData[index] <= 0 ? data : null
  );

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
                  Enter expense amount here.
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
                  Enter expense description here.
                </DialogContentText>
                <TextField
                  id="outlined-basic"
                  label="Expense Description"
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
                  onChange={handleNewExpenseDesc}
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

        <Dialog open={openCat} onClose={handleCatClose}>
          <DialogTitle>Add Category and Budget</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter expense details here.</DialogContentText>
            <TextField
              id="outlined-basic"
              label="Category Name"
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
              onChange={handleNewCatNameInput}
            />
            <DialogContent />
            <TextField
              id="outlined-basic"
              label="Budget Amount"
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
              onChange={handleNewCatMaxInput}
            />
          </DialogContent>
          <DialogActions>
            <button onClick={addCategory}>Add</button>
          </DialogActions>
        </Dialog>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 400,
            position: "relative",
          }}
        >
          <Box sx={{ width: "80%", height: 400 }}>
            <BarChart
              series={[
                {
                  data: greenData,
                  color: "darkgreen",
                  stack: "total",
                  label: "Money Spent",
                },
                {
                  data: yellowData,
                  color: "yellow",
                  stack: "total",
                  label: "Budget Cap",
                },
                {
                  data: redData,
                  color: "red",
                  stack: "total",
                  label: "Over Budget",
                },
              ]}
              xAxis={[
                {
                  scaleType: "band",
                  data: categories.map((categories) =>
                    categories.name.substring(0, 7)
                  ),
                  categoryGapRatio: 0.3,
                  barGapRatio: 0.1,
                },
              ]}
              yAxis={[{ min: 0, tickNumber: 10, tickMinStep: 100 }]}
              axisHighlight={{
                x: "none",
                y: "line",
              }}
              slotProps={{ tooltip: { trigger: "none" } }}
              grid={{ horizontal: true }}
            />
          </Box>

          <SpeedDial
            ariaLabel="SpeedDial"
            sx={{
              position: "flex",
              bottom: 16,
              right: 16,
              "& .MuiFab-primary": {
                backgroundColor: "green",
                "&:hover": {
                  backgroundColor: "darkgreen",
                },
              },
            }}
            icon={<SpeedDialIcon />}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                onClick={action.onClick}
                slotProps={{
                  tooltip: {
                    title: action.name,
                  },
                }}
              />
            ))}
          </SpeedDial>
        </Box>

        <Typography display={"flex"} justifyContent={"center"} variant="h5">
          ${total}
        </Typography>
        <Typography display={"flex"} justifyContent={"center"} variant="h5">
          Balance
        </Typography>

        <Box
          sx={{
            margin: "0 auto",
            width: "80%",
            marginTop: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 400,
            position: "relative",
          }}
        >
          <DataGrid
            rows={rows}
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
            slots={{
              noRowsOverlay: () => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  No expenses yet
                </Box>
              ),
            }}
          />
        </Box>
      </div>
    </>
  );
}

export default HomePage;
