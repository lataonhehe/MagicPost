import styles from './DefaultLayout.module.scss';
import classNames from 'classnames/bind';
import Header from './Header';

const cx = classNames.bind(styles);

function DefaultLayout({children})
 {
    return ( <div>
        <div className={cx('wrapper')}>
            <Header/>
            <div style={{height: '69px', width:'1250px', backgroundColor: '#001B42'}}></div>
            <div class= {cx('container')}>
                <div className= {cx('content')}>{children}</div>
            </div>
        </div>
    </div> );
}

export default DefaultLayout;
