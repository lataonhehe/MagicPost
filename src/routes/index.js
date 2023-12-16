import Home from "../pages/Home"; 
import Login from "../pages/Login"
import Leader from "../pages/Leader";
import ConsolidationManager from "../pages/ConsolidationPointManager";
import TransactionManager from "../pages/TransactionPointManager";
import ConsolidationStaff from "../pages/ConsolidationPointStaff";
import TransactionStaff from "../pages/TransactionPointStaff";
import Bill from "../pages/Bill";
import TransactionTable from "~/pages/TransactionTable";

// Public pages, don't need account to access
const publicRoutes = [ 
    {path: '/', component: Home},
    {path: '/bill', component: Bill, layout: null },
    {path: '/login', component: Login, layout: null},
    {path: '/transactiontable', component: TransactionTable}
];
   


// Need account to access routes
const privateRoutes = [
    {path: '/leader', component: Leader},
    {path: '/consolmanager', component: ConsolidationManager},
    {path: '/transmanager', component: TransactionManager},
    {path: '/consolstaff', component: ConsolidationStaff},
    {path: '/transstaff', component: TransactionStaff},


];

export {publicRoutes, privateRoutes};