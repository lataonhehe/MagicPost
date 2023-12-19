import { Navigate } from "react-router-dom";

function Protected({role, department, path, children}) {
    console.log(`/${department == 0 ? 'trans' : 'consol'}${role == 0 ? 'staff' : 'manager'}`);
    console.log (department)
    console.log (path.includes(`/${department == 0 ? 'trans' : 'consol'}${role == 0 ? 'staff' : 'manager'}`))
    console.log (path)
    console.log (`/${department == 0 ? 'trans' : 'consol'}${role == 0 ? 'staff' : 'manager'}`)
    if (role == 2 && (path == '/leader' || path == '/leader/managestore' || path == "/leader/statistic" || path == "/leader/manageaccount")) 
        return children 
    else if (path.includes(`/${department == 0 ? 'trans' : 'consol'}${role == 0 ? 'staff' : 'manager'}`) )
    return (  
        children
    );
    else return ( <h1>Bạn không có quyền truy cập</h1>)
}

export default Protected;