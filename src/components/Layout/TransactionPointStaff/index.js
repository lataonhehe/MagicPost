import styles from './Staff.module.scss';
import classNames from 'classnames/bind';
import Header from './Header';
import FunctionBar from './FunctionBar';

const cx = classNames.bind(styles);

function Staff({children})
 {
    return ( <div>
        <div className={cx('wrapper')}>
            <Header/>
            <div style={{height: '69px', width:'1250px', backgroundColor: '#001B42'}}></div>
            <div class= {cx('container')}>
                <FunctionBar/>
                <div className= {cx('content')}>{children}</div>
            </div>
        </div>
    </div> );
}

export default Staff;
