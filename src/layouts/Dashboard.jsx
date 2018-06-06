import React from "react";
import {connect} from 'react-redux';
import cx from "classnames";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// material-ui components
import withStyles from "material-ui/styles/withStyles";

// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";

import dashRoutesWrapper from "routes/dashboard.jsx";

import appStyle from "assets/jss/material-dashboard-pro-react/layouts/dashboardStyle.jsx";

import image from "assets/img/sidebar-2.jpg";
import logo from "assets/img/logo-white.svg";
import * as actionCreators from "../store/actions/actions";



var ps;

class Dashboard extends React.Component {

  constructor(props){
    super(props);
    this.dashboardRoutesWrapper = new dashRoutesWrapper(props.auth);
    this.state = {
        mobileOpen: false,
        miniActive: false,
        switchRoutes: null
    };
  }
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  getRoute() {
    return this.props.location.pathname !== "/maps/full-screen-maps";
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      // eslint-disable-next-line
      ps = new PerfectScrollbar(this.refs.mainPanel, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }
    // sent auth to children
      if(this.props.auth){
      this.dashboardRoutesWrapper = new dashRoutesWrapper(this.props.auth);
          let switchRoutes = (
              <Switch>
                  {this.dashboardRoutesWrapper.dashRoutes.map((prop, key) => {
                      if (prop.redirect)
                          return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
                      if (prop.collapse)
                          return prop.views.map((prop, key) => {
                              return (
                                  <Route path={prop.path} component={prop.component} key={key} render={prop.render} />
                              );
                          });
                      return <Route path={prop.path} component={prop.component} key={key} render={prop.render}/>;
                  })}
              </Switch>
          );
          this.setState({
              switchRoutes: switchRoutes
          });
      }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
    }
  }
  sidebarMinimize() {
    this.setState({ miniActive: !this.state.miniActive });
  }
  render() {
    const { classes, ...rest } = this.props;
    const mainPanel =
      classes.mainPanel +
      " " +
      cx({
        [classes.mainPanelSidebarMini]: this.state.miniActive,
        [classes.mainPanelWithPerfectScrollbar]:
          navigator.platform.indexOf("Win") > -1
      });
    return (
        this.dashboardRoutesWrapper ? (<div className={classes.wrapper}>
        <Sidebar
          routes={this.dashboardRoutesWrapper.dashRoutes}
          logoText={"drive"}
          logo={logo}
          image={image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color="blue"
          bgColor="black"
          miniActive={this.state.miniActive}
          {...rest}
        />
        <div className={mainPanel} ref="mainPanel">
          <Header
            sidebarMinimize={this.sidebarMinimize.bind(this)}
            miniActive={this.state.miniActive}
            routes={this.dashboardRoutesWrapper.dashRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          {/* On the /maps/full-screen-maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          {this.getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{this.state.switchRoutes}</div>
            </div>
          ) : (
            <div className={classes.map}>{this.state.switchRoutes}</div>
          )}
          {this.getRoute() ? <Footer fluid /> : null}
        </div>
      </div>):null
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(appStyle)(Dashboard);
