import classNames from 'classnames/bind';
import styles from './TransactionTable.module.scss';
import { TableContainer,Table, TableBody,TableRow,TableCell,Paper, TableHead, Box, } from '@mui/material';
import { alpha, styled, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

const cx = classNames.bind(styles);

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    margin:'64px',
    padding:0,
    borderRadius: theme.shape.borderRadius,
    borderRadius: '4px',
    backgroundColor: alpha('#6495ed', 0.15),
    '&:hover': {
      backgroundColor: alpha('#6495ed', 0.25),
    },
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    position: 'absolute',
    padding: theme.spacing(0, 2),
    
    height: '100%',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    width: '100%',
    fontSize: '19px',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    //   transition: theme.transitions.create('width'),
    //   [theme.breakpoints.up('sm')]: {
    //     width: '25ch',
    //     '&:focus': {
    //       width: '32ch',
    //     },
    //   },
    },
    }
    ));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
      // hide last border
      '&:last-child td, &:last-child th': {
        border: 0,
      },
    }));

// const [data, setData] = useState([]); // Dữ liệu của bạn (mảng các dòng)
//   const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

//   // Số dòng hiển thị trên mỗi trang
//   const rowsPerPage = 10;

//   // Tính chỉ số của dòng đầu tiên và dòng cuối cùng trên trang hiện tại
//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;

//   // Lấy các dòng hiển thị trên trang hiện tại
//   const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

//   // Hàm xử lý khi người dùng chuyển đến trang khác
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

function TransactionTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

    return (
    <div className={cx('container')}>
        <div className= {cx('btn-page')}>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon fontSize='large' />
                </SearchIconWrapper>
                <StyledInputBase
                placeholder="Nhập mã bưu gửi..."
                inputProps={{ 'aria-label': 'search' }}
                />
            </Search>
        </div>
        <div className={cx('information')}>
          <h2 style={{color:'#0072BC'}}>Thông tin kiện hàng</h2>
          <Box sx={{
            borderTopLeftRadius:'8px', 
            borderTopRightRadius:'8px', 
            color: 'white', 
            display:'flex',
            alignItems:'stretch',
            flexWrap:'wrap',
            padding:'10px 30px',
            backgroundColor: 'primary.main', '&:hover' : {
            backgroundColor:'primary.light'
          }}}>
            <div className={cx('infor-container')}>
              <div className= {cx('header-i-container')}>Mã bưu gửi</div>
              <p className={cx('infor-p')}>abcd</p>
            </div>
            <div className={cx('infor-container')}>
              <div className= {cx('header-i-container')}>Trạng thái</div>
              <p className={cx('infor-p')}>abcd</p>
            </div>
            <div className={cx('infor-container-right')}>
              <div className= {cx('header-i-container')}>Khối lượng</div>
              <p className={cx('infor-p')}>abcd</p>
            </div>           
          </Box>
          <Box sx={{
            '&:nth-of-type(odd)': {
              backgroundColor: alpha('#6495ed', 0.15),
              '&:hover': {
                backgroundColor: alpha('#6495ed', 0.25),
              }
            },}}>
            <div className={cx('infor-container-inside')}>
              <div className= {cx('header-i-inside')}>Trạng thái:</div>
              <p className={cx('infor-p-inside')}>abcd</p>
            </div>
            <div className={cx('infor-container-inside')}>
              <div className= {cx('header-i-inside')}>Nơi gửi:</div>
              <p className={cx('infor-p-inside')}>abcd</p>
            </div>
            <div className={cx('infor-container-inside')}>
              <div className= {cx('header-i-inside')}>Nơi nhận:</div> 
              <p className={cx('infor-p-inside')}>abcd</p>
            </div>
          </Box>

        </div>  
        <div className= {cx('content')}><TableContainer component={Paper}>
            <Table aria-label = 'simple table' className={cx('table')}>
                <TableHead className= {cx('thead')}>
                    <TableCell className= {cx('head-cell')}>STT</TableCell>
                    <TableCell className= {cx('head-cell')}>Ngày</TableCell>
                    <TableCell className= {cx('head-cell')}>Trạng thái</TableCell>
                    <TableCell className= {cx('head-cell')}>Vị trí</TableCell>
                </TableHead>
                <TableBody className= {cx('tbody')}>
                    {   tableData.map((row) => (
                            <StyledTableRow className= {cx('row')}>
                                  <TableCell className= {cx('cell')}>{row.id}</TableCell>
                                  <TableCell className= {cx('cell')}>{row.first_name}</TableCell>
                                  <TableCell className= {cx('cell')}>{row.last_name}</TableCell>
                                  <TableCell className= {cx('cell')}>{row.email}</TableCell>
                            </StyledTableRow>
                    ))
                    }
                </TableBody>
            </Table>
        </TableContainer></div>
        
    </div>
    );
}

const tableData = [{
    "id": 1,
    "first_name": "Dwight",
    "last_name": "Sweed",
    "email": "dsweed0@examiner.com",
    "gender": "Male",
    "ip_address": "250.161.168.119"
  }, {
    "id": 2,
    "first_name": "Jean",
    "last_name": "Hinkley",
    "email": "jhinkley1@desdev.cn",
    "gender": "Female",
    "ip_address": "99.8.199.19"
  }, {
    "id": 3,
    "first_name": "Emmalynne",
    "last_name": "Ivashintsov",
    "email": "eivashintsov2@hc360.com",
    "gender": "Female",
    "ip_address": "234.140.198.137"
  }, {
    "id": 4,
    "first_name": "Gerhard",
    "last_name": "Scough",
    "email": "gscough3@digg.com",
    "gender": "Male",
    "ip_address": "73.172.173.188"
  }, {
    "id": 5,
    "first_name": "Berty",
    "last_name": "Rodliff",
    "email": "brodliff4@patch.com",
    "gender": "Female",
    "ip_address": "117.34.72.86"
  }, {
    "id": 6,
    "first_name": "Rochette",
    "last_name": "Duerden",
    "email": "rduerden5@sciencedirect.com",
    "gender": "Non-binary",
    "ip_address": "222.99.234.254"
  }, {
    "id": 7,
    "first_name": "Shayna",
    "last_name": "Ccomini",
    "email": "sccomini6@china.com.cn",
    "gender": "Female",
    "ip_address": "129.172.32.8"
  }, {
    "id": 8,
    "first_name": "Jolee",
    "last_name": "Zanotti",
    "email": "jzanotti7@wiley.com",
    "gender": "Female",
    "ip_address": "49.37.173.156"
  }, {
    "id": 9,
    "first_name": "Bev",
    "last_name": "Dawney",
    "email": "bdawney8@freewebs.com",
    "gender": "Male",
    "ip_address": "233.107.67.219"
  }, {
    "id": 10,
    "first_name": "Raimondo",
    "last_name": "Corneil",
    "email": "rcorneil9@netvibes.com",
    "gender": "Male",
    "ip_address": "152.9.228.130"
  }]

export default TransactionTable;