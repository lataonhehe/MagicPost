import React, { useEffect, useState } from 'react';
import { StyledTable, StyledTableRow, ColorComingButton, ColorPendingButton, ColorSuccessButton, StyledBox } from './styles';

const headCells = [
  {
    id: 'shipment_id',
    numeric: false,
    disablePadding: true,
    label: 'ID',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: true,
    label: 'Trạng thái',
  },
  {
    id: 'DHCode',
    numeric: false,
    disablePadding: true,
    label: 'Mã bưu gửi',
  },
  {
    id: 'sender_address',
    numeric: false,
    disablePadding: true,
    label: 'Địa chỉ gửi',
  },
  {
    id: 'receiver_address',
    numeric: false,
    disablePadding: true,
    label: 'Địa chỉ nhận',
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: true,
    label: 'Phân loại',
  },
  {
    id: 'weight',
    numeric: false,
    disablePadding: true,
    label: 'Khối lượng',
  },
];
const commonCellStyle = {
  fontSize: '16px',
  padding: '5px',
};

const EnhancedTableHead = () => {
  return (
    <thead>
      <tr>
        {headCells.map((cell) => (
          <th key={cell.id} style={{ ...commonCellStyle, textAlign: 'right' }}>
            {cell.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const TableBody = ({ visibleRows, emptyRows }) => {
  return (
    <tbody>
      {visibleRows.map((shipment) => (
        <StyledTableRow key={shipment.shipment_id}>
          {headCells.map((cell) => (
            <td key={cell.id} style={{ ...commonCellStyle, textAlign: 'right' }}>
              {shipment[cell.id]}
            </td>
          ))}
          <td style={{ ...commonCellStyle, textAlign: 'right' }}>
            {/* Add action buttons or components related to each shipment */}
            {/* Example: <Button onClick={() => handleAction(shipment)}>Action</Button> */}
          </td>
        </StyledTableRow>
      ))}
      {emptyRows > 0 && (
        <tr>
          <td colSpan={headCells.length + 1} style={{ ...commonCellStyle }} />
        </tr>
      )}
    </tbody>
  );
};

const TransManagerStatics = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('coming'); // Default to 'coming'
  const dense = false; // Placeholder, replace with your logic

  const handleStatus = (status) => {
    // Placeholder for handleStatus function
    setStatus(status)
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('Token');
        const response = await fetch('http://127.0.0.1:8000/Transaction/list_shipment', {
          method: 'GET',
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'An error occurred while fetching data.');
      }
    };

    fetchData();
  }, []);

  // Filter shipments based on the selected status
  const visibleRows = data?.[`${status}_shipment`] || [];
  const emptyRows = 0; // Placeholder, replace with your logic

  return (
    <div>
      <h1>Thống kê đơn hàng</h1>
      <StyledBox>
        <ColorComingButton
          variant={status === 'coming' ? 'contained' : 'outlined'}
          onClick={() => handleStatus('coming')}
          sx={{ fontSize: '20px' }}
        >
          Hàng đã gửi
        </ColorComingButton>
        <ColorSuccessButton
          variant={status === 'success' ? 'contained' : 'outlined'}
          onClick={() => handleStatus('success')}
          sx={{ fontSize: '20px' }}
        >
          Hàng đã nhận
        </ColorSuccessButton>
        <ColorPendingButton
          variant={status === 'pending' ? 'contained' : 'outlined'}
          onClick={() => handleStatus('pending')}
          sx={{ fontSize: '20px' }}
        >
          Hàng đang vận chuyển
        </ColorPendingButton>
      </StyledBox>
      {data ? (
        <StyledTable sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
          <EnhancedTableHead />
          <TableBody visibleRows={visibleRows} emptyRows={emptyRows} />
        </StyledTable>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TransManagerStatics;
