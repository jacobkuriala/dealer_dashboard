import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";

// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
import Announcement from "@material-ui/icons/Announcement"

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import IconCard from "components/Cards/IconCard.jsx";
import IconButton from "components/CustomButtons/IconButton.jsx";

import { dataTable } from "variables/general.jsx";

import {EngineApi}  from './../../middleware/EngineAPI/Api';
var dateFormat = require('dateformat');

class Orders extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        privateMessage:null,
        publicMessage:null,
        dealerIds:null,
          data: null
    }
  }

    componentDidMount(){
        console.log('called full.js componentdidmount');
        EngineApi.getTestPublicApi( (message) =>{
            this.setState({ publicMessage:message });
        });
        EngineApi.getTestPrivateApi(this.props.auth, (message) => {
            this.setState({ privateMessage:message });
        });

        // get all order after getting dealer id
        this.props.auth.getProfile((error,user)=>{
            if(user["http://localhost:3013/user_metadata"].dealerIds){
                this.setState({
                    'dealerIds': user["http://localhost:3013/user_metadata"].dealerIds
                });
                EngineApi.getOrders(this.props.auth, user["http://localhost:3013/user_metadata"].dealerIds[0], (error,response) => {
                    if(error){
                        throw error;
                    }
                    // let ordersHeaders = [];
                    // if(response.data && response.data[0]){
                    //     forEach(keys(response.data[0]),(columnName)=>{
                    //         ordersHeaders.push(
                    //             columnName
                    //         );
                    //     });
                    // }
                    // console.log('ordersheaders');
                    // console.log(ordersHeaders);
                    this.setState({
                        'data': response.data,
                    });
                });
            }
        });
    }
  render(){
      console.log(this.state.data);
      let tableContent = this.state.data ? (
          <ReactTable
              data={this.state.data}
              defaultFilterMethod={(filter, row) =>
                  String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())}
              filterable
              columns={[
                  {
                      Header: "First Name",
                      accessor: "firstName",
                  },
                  {
                      Header: "Last Name",
                      accessor: "lastName"
                  },
                  {
                      Header:"Order Created",
                      id: "created",
                      accessor: (c) =>{
                            return dateFormat(c.created, "dddd, mmmm dS, yyyy, at h:MM:ss TT");
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
          <ItemGrid xs={12}>
              <IconCard
                  icon={Announcement}
                  title="Public Message"
                  content={
                      this.state.publicMessage
                  }
              />
          </ItemGrid>
          <ItemGrid xs={12}>
              <IconCard
                  icon={Announcement}
                  title="Private Message"
                  content={
                      this.state.privateMessage
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
}

export default Orders;
