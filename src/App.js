import React, { useState, useEffect } from 'react';
import './App.css';
import { forwardRef } from 'react';
import Avatar from 'react-avatar';
import Grid from '@material-ui/core/Grid'

import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios'
import Alert from '@material-ui/lab/Alert';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { Button, TextField, Paper } from "@material-ui/core";
import MyDialog from "./MyDialog.js";
import { Switch } from '@material-ui/core';


const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  VisibilityIcon: forwardRef((props, ref) => <VisibilityIcon {...props} ref={ref} />)
};

const api = axios.create({
  baseURL: `https://xortkgd63b.execute-api.us-east-1.amazonaws.com/`
})

function App() {

  var columns = [
    {title: "id", field: "id", hidden: true},
    {title: "Device ID", field: "DeviceId"},
    {title: "Table ID", field: "TableId"},
    {title: "Tabls Status", field: "TableStatus", render: (data, id) => <Switch
    checked={data.TableStatus ? true : false}

  />}
  ]
  const [originalData, setData] = useState([]); //table data
  const [data, setFilteredData] = useState([]); //table data

  //for error handling
  const [iserror, setIserror] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])
  const [dialogId, setDialogId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogWord, setDialogWord] = useState("");
  const handleDialogClose = event => {
    setIsDialogOpen(false);
  };

  const handleId = event => {
    setDialogId(event.target.value);
  };

  const handleSearch = event => {

    console.log(event.target.value, data)
    const result= [...originalData].filter(item=> item.DeviceId == event.target.value || item.TableId == event.target.value);
    setFilteredData(result);
    if(!event.target.value){
      setFilteredData([...originalData])
    }
  };
  useEffect(() => { 
    api.get("Prod/table/Test147e1ce90")
        .then(res => {              
          setData(res.data)
          setFilteredData(res.data)
         })
         .catch(error=>{
             console.log("Error"+ error);
         })

         if (!isDialogOpen) {
          setDialogId("");
          setDialogWord("");
        }
  }, [isDialogOpen])

  return (
    <div className="App">
          <TextField
              onChange={e => handleSearch(e)}
              label="Search Here"
            />
            <hr />
      <Grid container spacing={1}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
          <div>
            {iserror && 
              <Alert severity="error">
                  {errorMessages.map((msg, i) => {
                      return <div key={i}>{msg}</div>
                  })}
              </Alert>
            }       
          </div>
            <MaterialTable
              title="Device data list"
              columns={columns}
              data={data}
              icons={tableIcons}
              actions={[
        {
          icon: tableIcons.VisibilityIcon,
          tooltip: 'View Detail',
          onClick: (event, data) => {
         // setIsDialogOpen(true);
      }
        }
      ]}/>

<MyDialog 
        title="Device Detail"
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
      >
              <Paper style={{ padding: "2em" }}>
          <div>
          {isDialogOpen}

            <TextField
              defaultValue={dialogId}
              value={dialogId}
              onInput={handleId}
              label="Id"
            />
          </div>
        </Paper>
      </MyDialog>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
    </div>
  );
}

export default App;