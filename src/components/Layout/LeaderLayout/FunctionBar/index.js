import classNames from "classnames/bind";
import styles from './FunctionBar.module.scss';
import { Box} from "@mui/material";
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StoreIcon from '@mui/icons-material/Store';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useState } from "react";

const cx = classNames.bind(styles);

function FunctionBar() {
    const [selectedIndex, setSelectedIndex] = useState(1);

    const handleListItemClick = (event, index) => {
      setSelectedIndex(index);
    };
    return ( <Box className= {cx('wrapper')} sx={{ boxShadow: 1 }} p={2}>
        <h2 style={{paddingLeft:'16px'}}>Lãnh Đạo</h2>
        <Divider/>
        <List >
            <ListItemButton
                
                component="a" href="/leader/managestore"
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
                >
                <ListItemIcon>
                    <StoreIcon fontSize="large" />
                </ListItemIcon>
                <ListItemText primary="Quản lí điểm" primaryTypographyProps={{fontSize: 'medium'}}  />
            </ListItemButton>
            <ListItemButton
                
                component="a" href="/leader/manageaccount"
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
                >
                <ListItemIcon>
                    <ManageAccountsIcon fontSize="large" />
                </ListItemIcon>
                <ListItemText primary="Quản lí tài khoản" primaryTypographyProps={{fontSize: 'medium'}}  />
            </ListItemButton>
            <ListItemButton
                
                component="a" href="/leader/statistic"
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
                >
                <ListItemIcon>
                    <ListAltIcon fontSize="large" />
                </ListItemIcon>
                <ListItemText primary="Thống kê" primaryTypographyProps={{fontSize: 'medium'}}  />
            </ListItemButton>
        </List>
    </Box> );
}

export default FunctionBar;