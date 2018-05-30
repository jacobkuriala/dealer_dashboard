import React from "react";
import { withRouter } from "react-router-dom";
// react component for creating dynamic tables
import ReactTable from "react-table";
// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from "react-datetime";
import moment from "moment";
import momentz from "moment-timezone";
import { map, find } from 'lodash';

// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";

// material-ui/components
import FormControl from "material-ui/Form/FormControl";
import InputLabel from "material-ui/Input/InputLabel";
import Select from "material-ui/Select";
import MenuItem from "material-ui/Menu/MenuItem";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import IconCard from "components/Cards/IconCard.jsx";

import {EngineApi}  from '../../../middleware/EngineAPI/Api';
import DateRange from "@material-ui/icons/DateRange";
import DirectionsCar from "@material-ui/icons/DirectionsCar";
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
          dealerIds: null,
          fromDate: fromDateMoment,
          toDate: toDateMoment,
          orders: null,
          dealers: null,
          selectedDealerId: ''
      }
  }

    componentDidMount(){
        // get all order after getting dealer id
        this.props.auth.getProfile((error,user)=> {
            const dealerIds = user["http://localhost:3013/user_metadata"].dealerIds;
            if(dealerIds){
                this.setState({
                    'dealerIds': user["http://localhost:3013/user_metadata"].dealerIds,
                    'selectedDealerId': user["http://localhost:3013/user_metadata"].dealerIds[0]
                }, () => {
                    console.log('re retrieving data');
                    this._retrieveDealers();
                    this._retrieveOrders();
                });

            }
        });
    }

    onFromDateChanged(momentObj){
      this.setState({
          fromDate: momentObj
      },()=>{
          this._retrieveOrders();
      });
    }

    onToDateChanged(momentObj){
        this.setState({
            toDate: momentObj
        },()=>{
            this._retrieveOrders();
        });
    }

    onGetOrdersClicked(){
        this._retrieveOrders();
    }

    onDealerChanged(e){
      this.setState({
          'selectedDealerId': e.target.value
      },()=>{
          this._retrieveOrders();
      });
    }

  render(){
      console.log('render called');
      const { classes } = this.props;
      let tableContent = this.state.orders ? (
          <ReactTable
              data={this.state.orders}
              defaultFilterMethod={(filter, row) =>
                  String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())}
              filterable
              getTrProps={(state, rowInfo, column, instance) => ({
                  onClick: (e) => {
                      console.log('A row was clicked!');
                      console.log(rowInfo.row.orderId);
                      this.props.history.push(`/orderdetails/${rowInfo.row.orderId}`);
                  }
              })
              }
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
                      Header:"Ordered on",
                      id: "created",
                      accessor: (c) =>{
                          let created = moment.utc(c.or.created);
                          // converted from utc to dealer_timezone
                          created = created.tz(DEALER_TIMEZONE);
                          return created.format("MMM DD YYYY, hh:mm a z");
                      }
                  },
                  {
                      Header:"Vehicle information",
                      id:"vehicle_basic",
                      accessor: (c) =>{
                          let vehicleString = c.s.year + " " + c.vma.name + " " + c.vmo.name + " " + c.s.trim;
                          // let orderMeta = JSON.parse(c.orme.json);
                          // console.log(orderMeta);
                          return vehicleString;
                      }
                  },
                  {
                      Header:"Finance",
                      id:"financetype",
                      accessor: (c) =>{
                          return c.or.financeType;
                      }
                  },
                  {
                      Header:"Trade in",
                      id:"trade_in",
                      accessor: (c) =>{
                          return c.or.tradeInKbbVehicleId ? 'Yes': 'No';
                      }
                  },
                  {
                      Header:"Source",
                      id:"source",
                      accessor: (c) =>{
                          return c.or.sourceCode;
                      }
                  }
              ]}
              defaultPageSize={10}
              showPaginationTop={false}
              showPaginationBottom={true}
              className="-striped -highlight"
          />
      ):null;
      let dealer = this._getSelectedDealer();
      let title = dealer ? 'Orders for ' + dealer.name : 'Orders';
    return (
      <GridContainer>
          <ItemGrid xs={12} sm={6} md={6} lg={6}>
              <IconCard
                  icon={DirectionsCar}
                  title=""
                  content={
                      <FormControl
                          fullWidth
                          className={classes.selectFormControl}
                      >
                          <InputLabel
                              htmlFor="simple-select"
                              className={classes.selectLabel}
                          >
                              Choose Dealer
                          </InputLabel>
                          <Select
                              MenuProps={{
                                  className: classes.selectMenu
                              }}
                              classes={{
                                  select: classes.select
                              }}
                              value={this.state.selectedDealerId}
                              onChange={this.onDealerChanged.bind(this)}
                              inputProps={{
                                  name: "selectedDealerId",
                                  id: "dealer-select"
                              }}
                          >
                              <MenuItem
                                  disabled
                                  classes={{
                                      root: classes.selectMenuItem
                                  }}
                              >
                                  Choose Dealer
                              </MenuItem>
                              {this._createMenuItems()}
                          </Select>
                      </FormControl>
                  }
              />

          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={6} lg={6}>
              <IconCard
                  icon={DateRange}
                  title=""
                  content={
                      <div>
                          <br />
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
                      </div>
                  }
              />
          </ItemGrid>
        <ItemGrid xs={12}>
          <IconCard
            icon={Assignment}
            title={title}
            content={
                tableContent
            }
          />
        </ItemGrid>
      </GridContainer>
    );
  }

  _createMenuItems(){
      const { classes } = this.props;
        const menuItems = map(this.state.dealers, (d) =>{
            return (
                  <MenuItem
                      classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                      }}
                      value={d.id}
                      key = {d.id}
                      displayname = {d.name}
                  >
                      {d.name}
                  </MenuItem>
            );
        });
        console.log(this.state.dealers);
        console.log(menuItems);
        console.log(this);
        return menuItems;
  }

  _retrieveOrders() {
      // converting from dealer_timezone to utc
      const fromDateUTC = new Date(this.state.fromDate.tz('utc').format('YYYY-MM-DD HH:mm:ss'));
      const toDateUTC = new Date(this.state.toDate.tz('utc').format('YYYY-MM-DD HH:mm:ss'));
      EngineApi.getOrders(this.props.auth, this.state.selectedDealerId, fromDateUTC, toDateUTC, (error, response) => {
          if (error) {
              this.setState({
                 'orders': []
              });
              return;
              // throw error;
          }
          this.setState({
              'orders': response.data,
          });
      });
  }

    _retrieveDealers() {
        // converting from dealer_timezone to utc
        EngineApi.getDealers(this.props.auth, this.state.dealerIds, (error, response) => {
            if (error) {
                this.setState({
                    'dealers': []
                });
                return;
                // throw error;
            }

            this.setState({
                'dealers': response.data,
            });
        });
    }

    _getSelectedDealer(){
      let dealer = find(this.state.dealers, (d) => {
          return d.id === this.state.selectedDealerId;
      });
      return dealer;
    }
}

export default withStyles(extendedFormsStyle)(Orders);
