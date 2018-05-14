import React from "react";

import Dashboard from "views/Dashboard/Dashboard.jsx";
import RegularTables from "views/Tables/RegularTables.jsx";
import ExtendedTables from "views/Tables/ExtendedTables.jsx";
import ReactTables from "views/Tables/ReactTables.jsx";
import UserProfile from "views/Pages/UserProfile.jsx";
import TimelinePage from "views/Pages/Timeline.jsx";
import RTLSupport from "views/Pages/RTLSupport.jsx";
import Orders from "views/Orders/Orders.jsx";


import pagesRoutes from "./pages.jsx";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import Assignment from "@material-ui/icons/Assignment";
import GridOn from "@material-ui/icons/GridOn";

var pages = [
  {
    path: "/timeline-page",
    name: "Timeline Page",
    mini: "TP",
    component: TimelinePage
  },
  {
    path: "/user-page",
    name: "User Profile",
    mini: "UP",
    component: UserProfile
  },
  {
    path: "/rtl/rtl-support-page",
    name: "RTL Support",
    mini: "RS",
    component: RTLSupport
  }
].concat(pagesRoutes);

class dashRoutesWrapper {
    constructor(auth){
        this.auth = auth;
        this.dashRoutes = [
            {
                path: "/dashboard",
                name: "Dashboard",
                icon: DashboardIcon,
                component: Dashboard
            },
            {
                path: "/orders",
                name: "Orders",
                icon: Assignment,
                render: ((props) => {
                    return (<Orders auth={auth} {...props} />)
                })
            },
            {
                collapse: true,
                path: "/tables",
                name: "Tables",
                state: "openTables",
                icon: GridOn,
                views: [
                    {
                        path: "/tables/regular-tables",
                        name: "Regular Tables",
                        mini: "RT",
                        component: RegularTables
                    },
                    {
                        path: "/tables/extended-tables",
                        name: "Extended Tables",
                        mini: "ET",
                        component: ExtendedTables
                    },
                    {
                        path: "/tables/react-tables",
                        name: "React Tables",
                        mini: "RT",
                        component: ReactTables
                    }
                ]
            },
            { redirect: true, path: "/", pathTo: "/dashboard", name: "Dashboard" }
        ];
    }
}

export default dashRoutesWrapper;
