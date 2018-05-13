import Pages from "layouts/Pages.jsx";
import RTL from "layouts/RTL.jsx";
import Dashboard from "layouts/Dashboard.jsx";

import Login from '../views/Login/Login.jsx';
import React from 'react';

import Callback from '../middleware/Auth/Callback/Callback';
import Auth from '../middleware/Auth/Auth';

const auth = new Auth();

const handleAuthentication = ({location}) => {
    if (/access_token|id_token|error/.test(location.hash)) {
        auth.handleAuthentication();
    }
};

var indexRoutes = [
  // { path: "/rtl", name: "RTL", component: RTL },
  // { path: "/pages", name: "Pages", component: Pages },
  // { path: "/", name: "Home", component: Dashboard }
    {
        path: '/callback', render: ((props) => {
            handleAuthentication(props);
            return <Callback {...props} />
        })
    },
    {
        path: "/", render: ((props) => {
            if (auth.isAuthenticated()) {
                return (<Dashboard auth={auth} {...props} />)
            } else {
                return (<Login auth={auth} {...props} />)
            }
        })
    }
];

export default indexRoutes;
