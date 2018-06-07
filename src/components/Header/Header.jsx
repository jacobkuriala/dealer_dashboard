import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import cx from "classnames";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import Button from "material-ui/Button";
import Hidden from "material-ui/Hidden";

// material-ui icons
import Menu from "@material-ui/icons/Menu";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"

// core components
import CustomIconButton from "components/CustomButtons/IconButton.jsx";

import headerStyle from "assets/jss/material-dashboard-pro-react/components/headerStyle.jsx";

import history from '../../history';

import Fade from 'material-ui/transitions/Fade';
class Header extends React.Component {
    state = {
        titleChanged:false
    };

    constructor(props) {
        super(props);
    }

    goBack() {
        history.goBack();
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.pageInfo.pageTitle !== this.props.pageInfo.pageTitle){
            this.setState({
                titleChanged: false
            },() =>{
              this.setState({
                  titleChanged: true
              });
            });
        }
    }

    render() {
        const {classes, color, rtlActive} = this.props;
        const appBarClasses = cx({
            [" " + classes[color]]: color
        });
        const sidebarMinimize =
            classes.sidebarMinimize +
            " " +
            cx({
                [classes.sidebarMinimizeRTL]: rtlActive
            });
        return (
            <AppBar className={classes.appBar + appBarClasses}>
                <Toolbar className={classes.container}>
                    <div className={sidebarMinimize}>
                        <CustomIconButton color="white" onClick={this.goBack}>
                            <KeyboardArrowLeft className={classes.sidebarMiniIcon}/>
                        </CustomIconButton>
                    </div>
                    <div className={classes.flex}>
                        <Fade in={this.state.titleChanged}>
                            <Button href="#" className={classes.title}>
                                {this.props.pageInfo.pageTitle}
                            </Button>
                        </Fade>
                    </div>
                    <Hidden mdUp>
                        <IconButton
                            className={classes.appResponsive}
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.props.handleDrawerToggle}
                        >
                            <Menu/>
                        </IconButton>
                    </Hidden>
                </Toolbar>
            </AppBar>
        );
    }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  rtlActive: PropTypes.bool
};

const mapStateToProps = (state) => {
  return {
    pageInfo : state.pageInfo
  }
};

export default connect(mapStateToProps,null)(withStyles(headerStyle)(Header));
