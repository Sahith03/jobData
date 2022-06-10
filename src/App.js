import './App.css';
import { DataGrid } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid';
import React from 'react';
import axios from 'axios';
import apiUrlMapping from '../src/resources/apiMapping.json';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { Dialog, DialogContent, DialogActions, DialogTitle} from '@mui/material';
//import { useDemoData } from '@mui/x-data-grid-generator';
import { GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';


const geRowsWithId = (rows) => {
  let id = 0
  let completeRowListArray = []
  for (let row of rows) {
    const rowsWithId = {
      id: id,
      ...row
    }
    id++
    completeRowListArray.push(rowsWithId)
  }
  return completeRowListArray
}
export default function App() {

  const jobTable = 
  [
    {
      field: 'actions',
      type: 'actions',
      width : 190,
      getActions: (event) => [
        <GridActionsCellItem onClick={(e) => onClickOfEditButton(event)} icon={<EditIcon />} label="Edit"/>,
        <GridActionsCellItem onClick={(e) => deleteRecord(event.id)} icon={<DeleteIcon />} label="Delete"/>,
        <GridActionsCellItem onClick={(e)=> onClickOfViewButton(event)}icon={<PreviewIcon/>}label="View"/>
      ],
    },
    {
      field: 'jobID',
      headerName: 'Job ID',
      width : 190
    },
    {
      field: 'jobTitle',
      headerName: 'Job Title',
      width : 190
    },
    {
      field: 'minsalary',
      headerName: 'Min Salary',
      width : 190
    },
    {
      field: 'maxsalary',
      headerName: 'Max Salary',
      width : 190
    }
  ]

  const [rows, setRows] = React.useState([])
  const [addOrEdit, setAddOrEdit] = React.useState("")
  const [editId, setEditId] = React.useState("")
  const handleClickOpen = () => {setOpen(true);};
  const [open, setOpen] = React.useState(false);
  const [jobID, setJobID] = React.useState("");
 const [maxsalary, setMaxsalary] = React.useState("");
 const [jobTitle, setJobTitle] = React.useState("");
 const [minsalary, setMinsalary] = React.useState("");
 const handleClose = () => {
   setOpen(false);
   setJobID("")
   setMaxsalary("")
   setJobTitle("")
   setMinsalary("")
};
const [open1, setOpen1] = React.useState(false);
const handleClose1 = () => {
  setOpen1(false);
  setJobID("")
  setMaxsalary("")
  setJobTitle("")
  setMinsalary("")
};
const handleClickOpen1 = () => {setOpen1(true);};

  const getAllRecords=()=>
  {
    axios.get(apiUrlMapping.jobData.getAll).then(response =>
	{
    setRows(geRowsWithId(response.data))
    });
  }

  const onClickofSaveRecord = () => 
  {
    setAddOrEdit("Save")
    handleClickOpen()
  }

  useEffect(() => {getAllRecords()}, []);

  const addOrEditRecordAndClose = (type) => 
  {
    if (type === "Edit") {editRecordAndClose()}
    if (type === "Save") {addRecordAndClose() }
  }

  const addRecordAndClose = () => 
  {
    if (jobID !== undefined && maxsalary !== undefined && jobTitle !== undefined && minsalary !== undefined )
	{
      let payload = 
	  {
        "jobID": jobID,
        "jobTitle": jobTitle,
        "minsalary": minsalary,
        "maxsalary": maxsalary
      }
      console.log("The Data to DB is " + payload)
      axios.post(apiUrlMapping.jobData.post, payload).then(response => 
	  {
	  getAllRecords()
        handleClose()
        setJobID("")
        setMaxsalary("")
        setJobTitle("")
        setMinsalary("")
      })
    }
  }

  const onClickOfEditButton = (e) =>
  {
    setAddOrEdit("Edit");
    let editRecord = rows[e.id]
    setJobID(editRecord.jobID)
    setMaxsalary(editRecord.maxsalary)
    setJobTitle(editRecord.jobTitle)
    setMinsalary(editRecord.minsalary)
    setEditId(editRecord._id)
    handleClickOpen()
  }

  const editRecordAndClose = () => 
  {
    if (jobID !== undefined && maxsalary !== undefined && jobTitle !== undefined && minsalary !== undefined )
    {
      let payload = 
	  {
        "jobID": jobID,
        "jobTitle": jobTitle,
        "minsalary": minsalary,
        "maxsalary": maxsalary
      }
      axios.put(apiUrlMapping.jobData.put + "/" + editId, payload).then(response => 
        {
          getAllRecords()
          handleClose()
        })
    }
  }

  const deleteRecord = (index) => 
  { 
    let dataId = rows[index]._id;
    axios.delete(apiUrlMapping.jobData.delete + "/" + dataId).then(()=>{getAllRecords();});
  }
  
  const onClickOfViewButton = (e) =>
  {
    let viewRecord = rows[e.id]
    setJobID(viewRecord.jobID)
    setMaxsalary(viewRecord.maxsalary)
    setJobTitle(viewRecord.jobTitle)
    setMinsalary(viewRecord.minsalary)
    handleClickOpen1()
  }

  return (
    <div className="App">
      <div className="text-alligned">
        <h1>Job Data</h1>
      </div>
      <div style={{ height: "50vh", width: "100%" }}>
      <DataGrid
          rows = {rows}
          columns = {jobTable}
          components={{Toolbar: GridToolbar,}}
          componentsProps={{toolbar: { showQuickFilter: true }}}
          pageSize={3}
          rowsPerPageOptions={[3]}
          checkboxSelection
          disableSelectionOnClick
        />
  </div>
  <div className="center" >
          <Button variant="contained" onClick={onClickofSaveRecord} >Add Record</Button>
  </div>
  <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Job Data</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" id="jobid"  onChange={(e) => { setJobID(e.target.value) }}value={jobID}label="Job ID"type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="jobtitle" onChange={(e) => { setJobTitle(e.target.value) }}value={jobTitle} label="Job Title" type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="minsalary" onChange={(e) => { setMinsalary(e.target.value) }} value={minsalary} label="Min Salary" type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="maxsalary" onChange={(e) => { setMaxsalary(e.target.value) }} value={maxsalary} label="Max Salary" type="text" fullWidth/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => { addOrEditRecordAndClose(addOrEdit) }}>Save</Button>
        </DialogActions>
  </Dialog>


  <Dialog open={open1} onClose={handleClose1}>
        <DialogTitle>View Job Data</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" id="jobid"  value={jobID} label="Job ID" type="text" disabled fullWidth/>
          <TextField autoFocus margin="dense" id="jobtitle" value={jobTitle} label="Job Title" type="text" disabled fullWidth/>
          <TextField autoFocus margin="dense" id="minsalary" value={minsalary} label="Min Salary" type="text" disabled fullWidth/>
          <TextField autoFocus margin="dense" id="maxsalary" value={maxsalary} label="Max Salary" type="text" disabled fullWidth/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose1}>Cancel</Button>
        </DialogActions>
  </Dialog>
      
    </div>
  );
}