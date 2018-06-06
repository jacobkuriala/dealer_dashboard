import React from "react";
import { connect } from "react-redux";
import * as actionCreators from '../../../store/actions/actions';
import {forEach, toNumber, get, capitalize } from "lodash";
import loading from '../../../middleware/Auth/Callback/loading.svg'
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

import PriceFormat from '../../../common/priceFormat'

class OrderDetails extends React.Component{
    constructor(props){
        super(props);

    }

    componentDidMount(){
        this._retrieveOrderDetails();
    }

    componentDidUpdate(prevProps, preState){
            this.props.setPageTitle(
                capitalize(this.props.ordersInfo.orderDetail.firstName) +
                " " + capitalize(this.props.ordersInfo.orderDetail.lastName));

    }

    render(){
        const style = {
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            height: '100vh',
            width: '100vw',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
        };
        console.log(this.props.ordersInfo.orderDetail);
        const orderDetail = this.props.ordersInfo.orderDetail;
        let renderHtml = orderDetail && orderDetail.id === toNumber(this.props.match.params.orderId) ? (
            <GridContainer>
                <ItemGrid xs={12} sm={6} md={6} lg={6}>
                    <HeaderCard cardTitle='Customer Information' content={this._getCustomerInfoCard(orderDetail)} >
                    </HeaderCard>
                </ItemGrid>
                <ItemGrid xs={12} sm={6} md={6} lg={6}>
                    <HeaderCard cardTitle='Purchase Information' content={this._getOrderVehicleCard(orderDetail)} >
                    </HeaderCard>
                </ItemGrid>
                <ItemGrid xs={12} sm={6} md={6} lg={6}>
                    <HeaderCard cardTitle='Order Receipt' content={this._getOrderFinanceCard(orderDetail)} >
                    </HeaderCard>
                </ItemGrid>
                {this._getUpgradesCard(orderDetail)}
                {this._getTradeInCard(orderDetail)}
            </GridContainer>
        ) : (
            <GridContainer>
                <ItemGrid xs={12}>
                    <div style={style}>
                        <img src={loading} alt="loading"/>
                    </div>
                </ItemGrid>
            </GridContainer>
        );

        return renderHtml;
    }

    _retrieveOrderDetails(){
        this.props.setSelectedOrderDetail(this.props.auth, this.props.match.params.orderId);
    }

    _getCustomerInfoCard(orderDetail){
        return (
            <div>
                <h4><small>Name: </small></h4>
                <h4>{orderDetail.firstName} {orderDetail.lastName}</h4>
                <h4><small>Address: </small></h4>
                <p>
                    {orderDetail.address} <br/>
                    {orderDetail.city} <br/>
                    {orderDetail.state} {orderDetail.zipcode} <br/>
                </p>
            </div>
        );
    }

    _getOrderVehicleCard(orderDetail){
        return (
            <div>
                <h4>{orderDetail.vehicle.style.year} {orderDetail.vehicle.make.name}
                    {orderDetail.vehicle.model.name} {orderDetail.vehicle.style.trim}</h4>
                <p>
                    <small>Vin:</small>    {orderDetail.vehicle.vin}
                </p>
                <p>
                    <small>Stock #:</small>    {orderDetail.vehicle.vin}
                </p>
                <p>
                    <small>Exterior Color:</small>    {orderDetail.vehicle.exteriorColor.mfgrName}
                </p>
                <p>
                    <small>Interior Color:</small>    {orderDetail.vehicle.interiorColor.mfgrName}
                </p>
                <p>
                    <small>Status:</small>    {orderDetail.vehicle.isNew ? 'New' : 'Old'}
                </p>
            </div>
        );
    }

    _getOrderFinanceCard(orderDetail){
        let title = "";
        switch(orderDetail.financeType.toLowerCase()){
            case "cash":
                title = (
                    <h4>
                        Full Cash Payment
                    </h4>
                );
                break;
            case "loan":
                title = (
                    <h4>
                        Loan Request
                    </h4>
                );
                break;
            case "lease":
                title = (
                    <h4>
                        Lease Request
                    </h4>
                );
                break;
            default:
                return (
                    <div>
                        Sorry, Something went wrong here. No finance information
                    </div>
                )
        }
        return (
            <div>
                {title}
                {this._getRetailPriceLine(orderDetail)}
                {this._getDiscountLine(orderDetail)}
                {this._getRebatesLine(orderDetail)}
                {this._getUpgradesLine(orderDetail)}
                {this._getTaxesAndFeesLine(orderDetail)}
                {this._getTotalPrice(orderDetail)}
                {this._getTradeInTotalLine(orderDetail)}
            </div>
        );
    }

    _getUpgradesCard(orderDetail){
        if(orderDetail.optionsCostCents){
            const data = orderDetail.options.map((option) => {
                return (
                    <div key={option.optionId}>
                        {option.option.name}: {PriceFormat.defaultCents(option.priceCents)}
                    </div>
                );
            });
            return (
                <ItemGrid xs={12} sm={6} md={6} lg={6}>
                    <HeaderCard cardTitle='Upgrades' content={data} >
                    </HeaderCard>
                </ItemGrid>
            )
        }else{
            return null;
        }
    }

    _getTradeInCard(orderDetail){
        const postOrder = get(orderDetail,'postOrder');
        const tradeInVehicle = get(orderDetail, 'meta.kbbVehicle');
        const tradeInDealerProvidedValue = !!get(orderDetail, 'tradeInDealerProvidedValue');
        const tradeInAmountOwed = PriceFormat.defaultCents(orderDetail.tradeInOwedCents || 0);
        const tradeVIN = get(postOrder, 'tradeVIN');

        if(get(tradeInVehicle, 'id')){
            const data = (<div>
                <h4>{tradeInVehicle.year} {tradeInVehicle.make.value}
                {tradeInVehicle.model.value} {tradeInVehicle.trim.value}</h4>
                <p>
                    <small>Condition:</small>    {capitalize(orderDetail.tradeInCondition)}
                </p>
                <p>
                    <small>Mileage:</small>    {orderDetail.tradeInMileage}
                </p>
                <p>
                    <small>Ownership:</small>    {orderDetail.tradeInOwnership}
                </p>
                <p>
                    <small>{tradeInDealerProvidedValue? 'Trade value:' : 'Kelley Blue Book value:'}:</small>
                    {PriceFormat.defaultCents((orderDetail.tradeInTotalCents || 0) + (orderDetail.tradeInOwedCents || 0))}
                </p>
                <p>
                    <small>Amount owed:</small>    {tradeInAmountOwed}
                </p>
                <p>
                    <small>Net value:</small>    {PriceFormat.defaultCents(orderDetail.tradeInTotalCents || 0)}
                </p>
                <p>
                    <small>VIN:</small>    {tradeVIN}
                </p>
            </div>);

            return (
                <ItemGrid xs={12} sm={6} md={6} lg={6}>
                    <HeaderCard cardTitle='Trade in' content={data} >
                    </HeaderCard>
                </ItemGrid>
            )
        } else {
            return null;
        }
    }

    _getRetailPriceLine(orderDetail){
        return orderDetail.priceVehicleDisplayCents ?
            (
                <p>
                    <small>Retail Price:</small>  {PriceFormat.defaultCents(orderDetail.priceVehicleDisplayCents)}
                </p>
            )
            :
            null;
    }

    _getDiscountLine(orderDetail){
        return orderDetail.discountCents ?
            (
                <p>
                    <small>Discount:</small>   ({PriceFormat.defaultCents(orderDetail.discountCents)})
                </p>
            )
            :
            null;
    }

    _getRebatesLine(orderDetail){
        return orderDetail.rebatesCents ?
            (
                <p>
                    <small>Incentives:</small>   ({PriceFormat.defaultCents(orderDetail.rebatesCents)})
                </p>
            )
            :
            null;
    }

    _getUpgradesLine(orderDetail){
        return orderDetail.optionsCostCents ?
            (
                <p>
                    <small>Upgrades:</small>   {PriceFormat.defaultCents(orderDetail.optionsCostCents)}
                </p>
            )
            :
            null;
    }

    _getTaxesAndFeesLine(orderDetail){
        const taxesandfeesCents = (orderDetail.taxCents || 0) + (orderDetail.feesCents || 0);
        return taxesandfeesCents ?
            (
                <p>
                    <small>Taxes and Fees:</small>   {PriceFormat.defaultCents(taxesandfeesCents)}
                </p>
            )
            :
            null;
    }

    _getTotalPrice(orderDetail){
        const total =
            (orderDetail.priceVehicleDisplayCents || 0) -
            (orderDetail.discountCents || 0) -
            (orderDetail.rebatesCents || 0) +
            (orderDetail.optionsCostCents || 0) +
            (orderDetail.taxCents || 0) +
            (orderDetail.feesCents || 0);
        return total ?
            (
                <p>
                    <small>Total:</small>   {PriceFormat.defaultCents(total)}
                </p>
            )
            :
            null;
    }

    _getTradeInTotalLine(orderDetail){

        if(orderDetail.tradeInTotalCents){
            if(orderDetail.tradeInTotalCents > 0) {
                return (
                    <p>
                        <small>Trade In:</small>   {PriceFormat.defaultCents(orderDetail.tradeInTotalCents)}
                    </p>
                )
            } else {
                let absoluteTradeInCents = -1 * orderDetail.tradeInTotalCents;
                return (
                    <p>
                        <small>Trade In:</small>   ({PriceFormat.defaultCents(absoluteTradeInCents)})
                    </p>
                )
            }
        }else{
            return null;
        }
    }

    // kept cuz there seemed to be a bug in the optionsCostCents value
    // couldint replicate the bug but retaining the function
    _getTotalOptionsCents(orderDetail){
        let total = 0;
        forEach(orderDetail.options, (value) =>{
            total = total + value.priceCents;
        });
        return total;
    }
}



const mapStateToProps = (state) => {
    return {
        ordersInfo: state.ordersInfo
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedOrderDetail : (auth, selectedOrderId) =>
            dispatch(actionCreators.fetchSelectedOrderDetail(auth, selectedOrderId)),
        setPageTitle: (title) =>
            dispatch(actionCreators.setPageTitle(title))
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(extendedFormsStyle)(OrderDetails));