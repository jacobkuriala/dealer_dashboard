import React from "react";
import { withRouter } from "react-router-dom";
// react component for creating dynamic tables
import ReactTable from "react-table";
// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from "react-datetime";
import moment from "moment";
import momentz from "moment-timezone";
import { map, find } from 'lodash';
import * as actionCreators from '../../../store/actions/actions';
import { connect } from 'react-redux';

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

import DateRange from "@material-ui/icons/DateRange";
import DirectionsCar from "@material-ui/icons/DirectionsCar";
import withStyles from "material-ui/styles/withStyles";

import extendedFormsStyle from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";

const DEALER_TIMEZONE = 'America/Los_Angeles';

class Orders extends React.Component{
  constructor(props) {
      super(props);
      if(!this.props.dealerInfo.selectedDealerId) {
          this.props.setAuthorizedDealerIds(this.props.auth);
      }
  }

    componentWillReceiveProps(nextProps){
      if(this.props.dealerInfo.selectedDealerId !== nextProps.dealerInfo.selectedDealerId){
          this._retrieveOrders(nextProps.dealerInfo.selectedDealerId,
              this.props.ordersInfo.ordersList_Selected_FromDate,
              this.props.ordersInfo.ordersList_Selected_ToDate);
      }
    }

    componentDidMount(){
        this._retrieveOrders(this.props.dealerInfo.selectedDealerId,
            this.props.ordersInfo.ordersList_Selected_FromDate,
            this.props.ordersInfo.ordersList_Selected_ToDate);
    }

    onFromDateChanged(momentObj){
        if(moment.isMoment(momentObj)){
            this.props.setOrdersListSelectedFromDate(momentObj);
            this._retrieveOrders(this.props.dealerInfo.selectedDealerId,
                momentObj,
                this.props.ordersInfo.ordersList_Selected_ToDate);
        }
    }


    onToDateChanged(momentObj){
        if(moment.isMoment(momentObj)){
            this.props.setOrdersListSelectedToDate(momentObj);
            this._retrieveOrders(this.props.dealerInfo.selectedDealerId,
                this.props.ordersInfo.ordersList_Selected_FromDate,
                momentObj);
        }

    }

    onDealerChanged(e){
        this.props.setSelectedAuthorizedDealerId(e.target.value);
    }

  render(){
      const { classes } = this.props;
      let tableContent = this.props.ordersInfo.ordersList ? (
          <ReactTable
              data={this.props.ordersInfo.ordersList}
              defaultFilterMethod={(filter, row) =>
                  String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())}
              filterable
              getTrProps={(state, rowInfo, column, instance) => ({
                  onClick: (e) => {
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
                      width:50
                  },
                  {
                      Header: "Name",
                      id: "name",
                      accessor: (c) =>{
                          return c.or.firstName + ' ' + c.or.lastName;
                      },
                      width: 100
                  },
                  {
                      Header: "Email",
                      id: "email",
                      accessor: "or.email",
                      width: 180
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
                      },
                      width: 180
                  },
                  {
                      Header:"Vehicle information",
                      id:"vehicle_basic",
                      accessor: (c) =>{
                          let vehicleString = c.s.year + " " + c.vma.name + " " + c.vmo.name + " " + c.s.trim;
                          // let orderMeta = JSON.parse(c.orme.json);
                          // console.log(orderMeta);
                          return vehicleString;
                      },
                      width: 250
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
              defaultSorted={[
                  {
                      id: "id",
                      desc: true
                  }
                  ]}
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
                              value={this.props.dealerInfo.selectedDealerId}
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
                                  defaultValue={this.props.ordersInfo.ordersList_Selected_FromDate}
                                  value={this.props.ordersInfo.ordersList_Selected_FromDate}
                                  inputProps={{ placeholder: "Choose From Date" }}
                              />
                          </FormControl>
                          <InputLabel className={classes.label}>To</InputLabel>
                          <br />
                          <FormControl fullWidth>
                              <Datetime
                                  onChange={this.onToDateChanged.bind(this)}
                                  closeOnSelect={true}
                                  defaultValue={this.props.ordersInfo.ordersList_Selected_ToDate}
                                  value={this.props.ordersInfo.ordersList_Selected_ToDate}
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
        const menuItems = map(this.props.dealerInfo.authorizedDealers, (d) =>{
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
        return menuItems;
  }

  _retrieveOrders(selectedDealerId, selectedFromDateM, selectedToDateM) {

      // converting from dealer_timezone to utc
      const fromDateUTC = new Date(selectedFromDateM.clone().tz('utc').format('YYYY-MM-DD HH:mm:ss'));
      const toDateUTC = new Date(selectedToDateM.clone().tz('utc').format('YYYY-MM-DD HH:mm:ss'));
      this.props.setOrderList(this.props.auth, selectedDealerId,
          fromDateUTC, toDateUTC);
  }

    _getSelectedDealer(){
      let dealer = find(this.props.dealerInfo.authorizedDealers, (d) => {
          return d.id === this.props.dealerInfo.selectedDealerId;
      });
      return dealer;
    }
}

const mapStateToProps = (state) => {
  return {
      dealerInfo: state.dealerInfo,
      ordersInfo: state.ordersInfo
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
      setAuthorizedDealerIds : (auth) =>
          dispatch(actionCreators.fetchAuthorizedDealerIds(auth)),
      setOrderList: (auth,dealerId, fromDateUTC, toDateUTC) =>
          dispatch(actionCreators.fetchOrdersList(auth, dealerId, fromDateUTC, toDateUTC)),
      setSelectedAuthorizedDealerId : (selectedDealerId) =>
          dispatch(actionCreators.setSelectedAuthorizedDealerId(selectedDealerId)),
      setOrdersListSelectedFromDate: (fromDate) =>
          dispatch(actionCreators.setOrdersListSelectedFromDate(fromDate)),
      setOrdersListSelectedToDate: (toDate) =>
          dispatch(actionCreators.setOrdersListSelectedToDate(toDate))
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(extendedFormsStyle)(Orders));
