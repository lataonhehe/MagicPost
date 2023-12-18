import Home from "../pages/Home"; 
import Login from "../pages/Login"
import Leader from "../pages/Leader";
import Bill from "../pages/Bill";

//import 5 pages, 5 vai trò
import ConsolidationManager from "../pages/ConsolidationPointManager";
import TransactionManager from "../pages/TransactionPointManager";
import ConsolidationStaff from "../pages/ConsolidationPointStaff";
import TransactionStaff from "../pages/TransactionPointStaff";
import TransactionTable from "~/pages/TransactionTable";

//import 5 Layout, 5 giao diện
import ConsolManagerLayout from "~/components/Layout/ConsolidationPointManager";
import ConsolStaffLayout from "~/components/Layout/ConsolidationPointStaff";
import LeaderLayout from "~/components/Layout/LeaderLayout";
import TransManagerLayout from "~/components/Layout/TransactionPointManager";
import TransStaffLayout from "~/components/Layout/TransactionPointStaff";

//Chức năng Leader
import ManagePoint from "../pages/Leader/ManagePoint";
import ManageAccountManager from "../pages/Leader/ManageAccountManager";
import Statistics from "~/pages/Leader/Statistics";

//Chức năng trưởng điểm giao dịch
import TransManagerStatics from "~/pages/TransactionPointManager/Statistics";
import TransManagerManageAccounts from "../pages/TransactionPointManager/ManageAccount";

//Chức năng trưởng điểm tập kết
import ConsolManagerManageAccounts from "~/pages/ConsolidationPointManager/ManageAccount";
import ConsolManagerStatistics from "~/pages/ConsolidationPointManager/Statistics";

//Chức năng nhân viên tập kết
import ConsolStaffAcceptConsolidation from "~/pages/ConsolidationPointStaff/Accept/ConsolidationPoint";
import ConsolStaffAcceptTransaction from "~/pages/ConsolidationPointStaff/Accept/TransactionPoint";
import ConsolStaffAddConsolidation from "~/pages/ConsolidationPointStaff/Add/SolidationPoint";
import ConsolStaffAddTransaction from "~/pages/ConsolidationPointStaff/Add/TransactionPoint";
import TransStaffStatistics from "~/pages/TransactionPointStaff/Statistics";
import FinishedTransaction from "~/pages/TransactionPointStaff/Add/Finished";
import NewTransaction from "~/pages/TransactionPointStaff/Add/New";
import TransStaffAcceptSolidation from "~/pages/TransactionPointStaff/Accept/SolidationPoint";
import TransStaffFinishedFail from "~/pages/TransactionPointStaff/Accept/Finished/Failed";
import TransStaffFinishedSuccess from "~/pages/TransactionPointStaff/Accept/Finished/Success";

//Chức năng nhân viên giao dịch

// Public pages, don't need account to access
const publicRoutes = [ 
    {path: '/', component: Home},
    {path: '/login', component: Login, layout: null},
    {path: '/bill', component: Bill, layout: null },
    {path: '/transactiontable', component: TransactionTable}
];
   


// Need account to access routes
const privateRoutes = [
    //5 vai trò, chức năng
    {path: '/leader', component: Leader, layout: LeaderLayout},
    {path: '/consolmanager', component: ConsolidationManager, layout: ConsolManagerLayout},
    {path: '/transmanager', component: TransactionManager, layout: TransManagerLayout},
    {path: '/consolstaff', component: ConsolidationStaff, layout: ConsolStaffLayout},
    {path: '/transstaff', component: TransactionStaff, layout: TransStaffLayout},

    //chức năng lãnh đạo
    {path: '/leader/managestore', component: ManagePoint, layout: LeaderLayout},
    {path: '/leader/manageaccount', component: ManageAccountManager, layout: LeaderLayout},
    {path: '/leader/statistic', component: Statistics, layout: LeaderLayout},

    //chức năng trưởng điểm giao dịch
    {path: '/transmanager/manageaccount', component: TransManagerManageAccounts, layout: TransManagerLayout},
    {path: '/transmanager/statistic', component: TransManagerStatics, layout: TransManagerLayout},
    
    //Chức năng trưởng điểm tập kết
    {path: '/consolmanager/manageaccount', component: ConsolManagerManageAccounts, layout: ConsolManagerLayout},
    {path: '/consolmanager/statistic', component: ConsolManagerStatistics, layout: ConsolManagerLayout},

    //Chức năng nhân viên giao dịch
    {path: '/transstaff/statistics', component: TransStaffStatistics, layout: TransStaffLayout},
    {path: '/transstaff/addfinish', component: FinishedTransaction, layout: TransStaffLayout},
    {path: '/transstaff/addnew', component: NewTransaction, layout: TransStaffLayout},
    {path: '/transstaff/acceptsolidation', component: TransStaffAcceptSolidation, layout: TransStaffLayout},
    {path: '/transstaff/acceptfail', component: TransStaffFinishedFail, layout: TransStaffLayout},
    {path: '/transstaff/acceptsuccess', component: TransStaffFinishedSuccess, layout: TransStaffLayout},

    //Chức năng nhân viên tập kết
    {path: '/consolstaff/acceptconsol', component: ConsolStaffAcceptConsolidation, layout: ConsolStaffLayout},
    {path: '/consolstaff/accepttrans', component: ConsolStaffAcceptTransaction, layout: ConsolStaffLayout},
    {path: '/consolstaff/addconsol', component: ConsolStaffAddConsolidation, layout: ConsolStaffLayout},
    {path: '/consolstaff/addtrans', component: ConsolStaffAddTransaction, layout: ConsolStaffLayout},

];

export {publicRoutes, privateRoutes};