import Home from "../pages/Home"; 
import Login from "../pages/Login"
import Transaction from "../pages/Transaction";
import Manager from "../pages/Manager";
import Leader from "../pages/Leader";
import Staff from "../pages/Staff";
import Bill from "../pages/Bill";
import TransactionTable from "~/pages/TransactionTable";

// Public pages, don't need account to access
const publicRoutes = [ 
    {path: '/', component: Home},
    {path: '/transaction', component: Transaction},
    {path: '/bill', component: Bill, layout: null },
    {path: '/login', component: Login, layout: null},
    {path: '/transactiontable', component: TransactionTable}
];
   


// Need account to access routes
const privateRoutes = [{path: '/manager', component: Manager},
    {path: '/leader', component: Leader},
    {path: '/staff', component: Staff},

];

export {publicRoutes, privateRoutes};