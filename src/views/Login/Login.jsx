import React from "react";
import PropTypes from "prop-types";
import { withStyles, Grid } from "material-ui";
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";

import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle";

class Login extends React.Component {
  state = {
      privateMessage: '',
      publicMessage: ''
  };

    login() {
        // this.props.auth.login();
        this.props.auth.lock.show();
    }
  render() {
    return (
            <GridContainer>
                <ItemGrid>
                    <h4>
                        You are not logged in! Please{' '}
                        <a
                            style={{ cursor: 'pointer' }}
                            // onClick={this.login.bind(this)
                            onClick={this.login.bind(this)}
                        >
                            Log In
                        </a>
                        {' '}to continue.
                    </h4>
                </ItemGrid>
            </GridContainer>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Login);
