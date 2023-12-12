import styles from './DefaultLayout.module.scss';
import classNames from 'classnames/bind';
import Header from './Header';
import FunctionBar from './FunctionBar';

const cx = classNames.bind(styles);

function DefaultLayout({children})
 {
    return ( <div>
        <div className={cx('wrapper')}>
            <Header/>
            <div class= {cx('container')}>
                <FunctionBar/>
                <div className= {cx('content')}>{children}</div>
            </div>
        </div>
    </div> );
}

export default DefaultLayout;
