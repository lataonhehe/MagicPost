import Header from './Header';
import TransactionTable from './TransactionTable';

function DefaultLayout({children})
 {
    return ( <div>
        <Header/>
        <div class= 'Container'>
            <TransactionTable/>
            <div className='content'>
                {children}
            </div>
        </div>
    </div> );
}

export default DefaultLayout;
