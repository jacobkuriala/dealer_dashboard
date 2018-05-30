import React from "react";

// @material-ui/icons
import ErrorOutline from "@material-ui/icons/ErrorOutline";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import HeaderCard from "components/Cards/HeaderCard.jsx"
import IconCard from "components/Cards/IconCard.jsx"

import extendedFormsStyle from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import withStyles from "material-ui/styles/withStyles";
import {EngineApi} from "../../../middleware/EngineAPI/Api";

class OrderDetails extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedOrderId: ''
        }
    }

    componentDidMount(){
          if(this.props.match.params.orderId){
              this.setState({
                  selectedOrderId: this.props.match.params.orderId,
                  orderDetails: null
              }, () =>{
                  this._retrieveOrderDetails();
              });
          }
    }

    render(){
        console.log(this.props.match);
        console.log(this.state.orderDetails);
        let renderHtml = this.state.orderDetails ? (
            <GridContainer>
                <ItemGrid xs={12} sm={6} md={6} lg={6}>
                    <HeaderCard cardTitle='Customer Information' content={<div>
                        <h4>{this.state.orderDetails.firstName} {this.state.orderDetails.lastName} </h4>
                        <p>
                            {this.state.orderDetails.address} <br/>
                            {this.state.orderDetails.city} <br/>
                            {this.state.orderDetails.state} {this.state.orderDetails.zipcode} <br/>
                        </p>
                    </div>} >
                    </HeaderCard>
                </ItemGrid>
                <ItemGrid xs={12} sm={6} md={6} lg={6}>
                    <HeaderCard cardTitle='Order Information' content={<div>
                        <h4>{this.state.orderDetails.firstName} {this.state.orderDetails.lastName}</h4>
                        <p>
                            {this.state.orderDetails.address} <br/>
                            {this.state.orderDetails.city} <br/>
                            {this.state.orderDetails.state} {this.state.orderDetails.zipcode} <br/>
                        </p>
                    </div>} >
                    </HeaderCard>
                </ItemGrid>
            </GridContainer>
        ) : (
            <GridContainer>
                <ItemGrid xs={12}>
                    <IconCard
                        icon={ErrorOutline}
                        content='No order information'
                    >

                    </IconCard>
                </ItemGrid>
            </GridContainer>
        );

        return renderHtml;
    }

    _retrieveOrderDetails(){
        if(this.state.selectedOrderId){
            EngineApi.getOrderDetails(this.props.auth, this.state.selectedOrderId,(error, response)=>{
                if(error){
                    console.log('error');
                    console.log(error);
                    return;
                }
                this.setState({
                    orderDetails: response.data
                });
            });
        }
    }
}

export default withStyles(extendedFormsStyle)(OrderDetails);