import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from "react-datetime";
import moment from "moment";
import momentz from "moment-timezone";

// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";

// material-ui/components
import FormControl from "material-ui/Form/FormControl";
import InputLabel from "material-ui/Input/InputLabel";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import IconCard from "components/Cards/IconCard.jsx";
import Button from 'components/CustomButtons/Button.jsx';

import { dataTable } from "variables/general.jsx";

import {EngineApi}  from './../../middleware/EngineAPI/Api';
import DateRange from "@material-ui/icons/DateRange";
import withStyles from "material-ui/styles/withStyles";

import extendedFormsStyle from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";

const DEALER_TIMEZONE = 'America/Los_Angeles';

class Orders extends React.Component{
  constructor(props) {
      super(props);
      // console.log(moment.tz.names());
      // moment.tz.setDefault('utc');
      const fromDate = new Date();
      const toDate = new Date();
      fromDate.setDate(toDate.getDate() - 31);
      let fromDateMoment = moment.tz(fromDate, DEALER_TIMEZONE);
      let toDateMoment = moment.tz(toDate, DEALER_TIMEZONE);
      this.state = {
          privateMessage: null,
          publicMessage: null,
          dealerIds: null,
          fromDate: fromDateMoment,
          toDate: toDateMoment,
          data: null
      }
  }

    componentDidMount(){
        // get all order after getting dealer id
        this.props.auth.getProfile((error,user)=>{
            const dealerIds = user["http://localhost:3013/user_metadata"].dealerIds;
            if(dealerIds){
                this.setState({
                    'dealerIds': user["http://localhost:3013/user_metadata"].dealerIds
                }, () =>{
                    this._retrieveOrders();
                });

            }
        });
    }

    onFromDateChanged(momentObj){
      this.setState({
          fromDate: momentObj
      });
    }

    onToDateChanged(momentObj){
        this.setState({
            toDate: momentObj
        });
    }

    onGetOrdersClicked(){
        this._retrieveOrders();
    }

  render(){
      const { classes } = this.props;
      let tableContent = this.state.data ? (
          <ReactTable
              data={this.state.data}
              defaultFilterMethod={(filter, row) =>
                  String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())}
              filterable
              columns={[
                  {
                      Header: "Id",
                      id: "orderId",
                      accessor: (c) =>{
                          return c.or.id;
                      },
                  },
                  {
                      Header: "Name",
                      id: "name",
                      accessor: (c) =>{
                          return c.or.firstName + ' ' + c.or.lastName;
                      },
                  },
                  {
                      Header: "Email",
                      id: "email",
                      accessor: "or.email",
                  },
                  {
                      Header: "Phone",
                      id: "or.phone",
                      accessor: (c) =>{
                          return c.or.phone;
                      },
                  },
                  {
                      Header:"Order Created",
                      id: "created",
                      accessor: (c) =>{
                          let created = moment.utc(c.or.created);
                          // converted from utc to dealer_timezone
                          created = created.tz(DEALER_TIMEZONE);
                          return created.format("MMM DD YYYY, hh:mm a z");
                      }
                  }
              ]}
              defaultPageSize={10}
              showPaginationTop={false}
              showPaginationBottom={true}
              className="-striped -highlight"
          />
      ):null;
    return (
      <GridContainer>
          <ItemGrid xs={12} sm={12} md={8}>
              <IconCard
                  icon={DateRange}
                  title="Orders"
                  content={
                      <div>
                          <InputLabel className={classes.label}>From</InputLabel>
                          <br />
                          <FormControl fullWidth>
                              <Datetime
                                  onChange={this.onFromDateChanged.bind(this)}
                                  closeOnSelect={true}
                                  defaultValue={this.state.fromDate}
                                  value={this.state.fromDate}
                                  inputProps={{ placeholder: "Choose From Date" }}
                              />
                          </FormControl>
                          <InputLabel className={classes.label}>To</InputLabel>
                          <br />
                          <FormControl fullWidth>
                              <Datetime
                                  onChange={this.onToDateChanged.bind(this)}
                                  closeOnSelect={true}
                                  defaultValue={this.state.toDate}
                                  value={this.state.toDate}
                                  inputProps={{ placeholder: "Choose To Date" }}
                              />
                          </FormControl>
                          <Button color="primary" onClick={this.onGetOrdersClicked.bind(this)} >Get Orders</Button>
                      </div>
                  }
              />
          </ItemGrid>
        <ItemGrid xs={12}>
          <IconCard
            icon={Assignment}
            title="Orders"
            content={
                tableContent
            }
          />
        </ItemGrid>
      </GridContainer>
    );
  }

  _retrieveOrders() {
      // converting from dealer_timezone to utc
      const fromDateUTC = new Date(this.state.fromDate.tz('utc').format('YYYY-MM-DD HH:mm:ss'));
      const toDateUTC = new Date(this.state.toDate.tz('utc').format('YYYY-MM-DD HH:mm:ss'));
      EngineApi.getOrders(this.props.auth, this.state.dealerIds[0], fromDateUTC, toDateUTC, (error, response) => {
          if (error) {
              this.setState({
                 'data': []
              });
              return;
              // throw error;
          }
          this.setState({
              'data': response.data,
          });
      });
  }
}

export default withStyles(extendedFormsStyle)(Orders);
