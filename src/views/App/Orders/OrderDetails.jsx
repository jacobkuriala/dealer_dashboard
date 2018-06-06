import React from "react";
import { connect } from "react-redux";
import * as actionCreators from '../../../store/actions/actions';
import {forEach, toNumber, get, capitalize, isNil } from "lodash";
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
                {this._getCustomerInfoCard(orderDetail)}
                {this._getOrderVehicleCard(orderDetail)}
                {this._getOrderReceiptCard(orderDetail)}
                {this._getOrderFinanceCard(orderDetail)}
                {this._getUpgradesCard(orderDetail)}
                {this._getTradeInCard(orderDetail)}
                {this._getDeliveryCard(orderDetail)}
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
        const content = (
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
        return this._createCard('Customer', content);
    }

    _getOrderVehicleCard(orderDetail){
        const data = (
            <div>
                <h4>{orderDetail.vehicle.style.year} {orderDetail.vehicle.make.name} {orderDetail.vehicle.model.name} {orderDetail.vehicle.style.trim}</h4>
                <p>
                    <small>Vin:</small>    {orderDetail.vehicle.vin}
                </p>
                <p>
                    <small>Stock #:</small>    {orderDetail.vehicle.dealerStockCode}
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
        return this._createCard('Purchase', data);
    }

    _getOrderReceiptCard(orderDetail){
        const content = (
            <div>
                {this._getRetailPriceLine(orderDetail)}
                {this._getDiscountLine(orderDetail)}
                {this._getRebatesLine(orderDetail)}
                {this._getUpgradesLine(orderDetail)}
                {this._getTaxesAndFeesLine(orderDetail)}
                {this._getTotalPrice(orderDetail)}
                {this._getTradeInTotalLine(orderDetail)}
            </div>
        );
        return this._createCard('Order Receipt', content);
    }

    _getUpgradesCard(orderDetail){
        if(orderDetail.optionsCostCents){
            const content = orderDetail.options.map((option) => {
                return (
                    <div key={option.optionId}>
                        <p>
                            <small>{option.option.name}:</small> {PriceFormat.defaultCents(option.priceCents)}
                        </p>
                    </div>
                );
            });
            return this._createCard('Upgrades', content);
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
        const tradeInVINLine = tradeVIN ? (
            <p>
                <small>VIN:</small>    {tradeVIN}
            </p>
        ): null;

        const kbbValue = (orderDetail.tradeInTotalCents || 0) + (orderDetail.tradeInOwedCents || 0);
        const kbbOrTradeValueLine = ! (capitalize(orderDetail.tradeInOwnership) === 'Lease') ? (
            <p>
                <small>{tradeInDealerProvidedValue ? 'Trade value' : 'Kelley Blue Book value'}:</small>
                {kbbValue > 0 && orderDetail.tradeInTotalCents ? PriceFormat.defaultCents(kbbValue): ' Dealer to confirm'}
            </p>
        ): null;

        if(get(tradeInVehicle, 'id')){
            const content = (<div>
                <h4>{tradeInVehicle.year} {tradeInVehicle.make.value} {tradeInVehicle.model.value} {tradeInVehicle.trim.value}</h4>
                <p>
                    <small>Condition:</small>    {capitalize(orderDetail.tradeInCondition)}
                </p>
                <p>
                    <small>Mileage:</small>    {orderDetail.tradeInMileage}
                </p>
                <p>
                    <small>Ownership:</small>    {capitalize(orderDetail.tradeInOwnership)}
                </p>
                {kbbOrTradeValueLine}
                <p>
                    <small>Amount owed:</small>    {tradeInAmountOwed}
                </p>
                {this._getTradeInTotalLine(orderDetail)}
                {tradeInVINLine}
            </div>);

            return this._createCard('Trade in', content);
        } else {
            return this._createCard('Trade in',
                (
                <div>
                    No Trade in Information
                </div>
                )
            );
        }
    }

    _getOrderFinanceCard(orderDetail){
        let pageTitle = 'Finance';
        let content = '';
        switch(orderDetail.financeType.toLowerCase()){
            case "cash":
                return this._createCard(pageTitle,(<h4>
                    Full Cash Payment
                </h4>));
            case "loan":
                const lenderRateValue = get(orderDetail, 'meta.rate.lenderRate');
                const displayRateValue = get(orderDetail, 'meta.rate.rate');
                content = (
                    <div>
                        <h4>
                            Loan Request
                        </h4>
                        <p>
                            <small>Down Payment:</small> {PriceFormat.defaultCents(orderDetail.downPaymentCents)}
                        </p>
                        <p>
                            <small>Monthly Payment:</small> { orderDetail.monthlyTotalCents ?
                            PriceFormat.defaultCents(orderDetail.monthlyTotalCents): 'Dealer to confirm'}
                        </p>
                        <p>
                            <small>Term:</small> { orderDetail.term } months
                        </p>
                        <p>
                            <small>Displayed Rate:</small>    {displayRateValue >= 0 ?
                            displayRateValue + '%' : 'Dealer to confirm'}
                        </p>
                        <p>
                            <small>Lender Rate:</small>    {lenderRateValue && lenderRateValue >= 0 ?
                            lenderRateValue + '%' :
                            'Dealer to confirm'}
                        </p>
                        <p>
                            <small>Lender:</small> {get(orderDetail, 'meta.rate.lenderName') || 'Dealer to confirm'}
                        </p>
                        <p>
                            <small>Order ID:</small> {get(orderDetail, 'id')}
                        </p>
                    </div>
                );
                break;
            case "lease":
                const lenderMoneyFactor = get(orderDetail,'meta.rate.bestTerm.SellRate');
                content = (
                    <div>
                        <h4>
                            Lease Request
                        </h4>
                        <p>
                            <small>Down Payment:</small> {PriceFormat.defaultCents(orderDetail.downPaymentCents)}
                        </p>
                        <p>
                            <small>Monthly Payment:</small> {orderDetail.monthlyTotalCents ?
                            PriceFormat.defaultCents(orderDetail.monthlyTotalCents): 'Dealer to confirm'}
                        </p>
                        <p>
                            <small>Term:</small> { orderDetail.term } months
                        </p>
                        <p>
                            <small>Miles:</small> { orderDetail.mileage }
                        </p>
                        <p>
                            <small>Displayed Money Factor:</small> { lenderMoneyFactor >= 0 ?
                            lenderMoneyFactor :
                            'Dealer to confirm'}
                        </p>
                        <p>
                            <small>Lender Money Factor:</small> { lenderMoneyFactor >= 0 ?
                            lenderMoneyFactor :
                            'Dealer to confirm'}
                        </p>
                        <p>
                            <small>Lender:</small> {get(orderDetail, 'meta.rate.lenderName') || 'Dealer to confirm'}
                        </p>
                        <p>
                            <small>Order ID:</small> {get(orderDetail, 'id')}
                        </p>
                    </div>
                );
                break;
            default:
                return this._createCard(pageTitle,(
                    <div>
                        Sorry, Something went wrong here. No finance information
                    </div>
                ));
        }
        return this._createCard(pageTitle, content);
    }

    _getDeliveryCard(orderDetail){
        const postOrder = get(orderDetail,'postOrder');
        const deliveryType = get(postOrder, 'deliveryType');
        const deliveryDate = get(postOrder, 'deliveryDate');
        const deliveryTime = get(postOrder, 'deliveryTime');
        const deliveryLabel = isNil(deliveryType)? 'Delivery/Pickup' : capitalize(deliveryType);
        const deliveryAddress = get(postOrder, 'addressLine');
        // deliveryType // deliveryDate // deliveryTime
        const content = !isNil(deliveryType) ? (
            <div>
                <h4>{capitalize(deliveryType)}</h4>
                <p>
                    <small>{deliveryLabel} Date:</small>    {deliveryDate && deliveryDate.split(' ')[0]}
                </p>
                <p>
                    <small>{deliveryLabel} Time:</small>    {deliveryTime}
                </p>
                { deliveryType === 'DELIVERY' &&
                <p>
                    <small>Delivery Address:</small>    {deliveryAddress}
                </p>
                }
            </div>
        ): (
            <div>
                No Pickup/Delivery Information
            </div>
        );
        return this._createCard('Pickup/Delivery', content);
    }

    _createCard(cardTitle, cardContent){
        return (
            <ItemGrid xs={12} sm={6} md={6} lg={6}>
                <HeaderCard cardTitle={cardTitle} content={cardContent} >
                </HeaderCard>
            </ItemGrid>
        );
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
                    <small>AddOns Total:</small>   {PriceFormat.defaultCents(orderDetail.optionsCostCents)}
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
        let absoluteTradeInCents = orderDetail.tradeInTotalCents < 0 ?
            '('+PriceFormat.defaultCents((-1 * orderDetail.tradeInTotalCents))+ ')' :
            PriceFormat.defaultCents(orderDetail.tradeInTotalCents || 0);

                return (
                    <p>
                        <small>Trade in net value:</small>   {
                        orderDetail.tradeInTotalCents ||
                    capitalize(orderDetail.tradeInOwnership) === 'Lease' ?
                        absoluteTradeInCents: 'Dealer to confirm'}
                    </p>
                )
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