import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import logo from '~/assets/logo-1@2x - Copy.png'

const cx = classNames.bind(styles);

function Header() {
     
    const username =JSON.parse(localStorage.getItem("username"));
    return (<header className= {cx('wrapper')} style={{background: '#001B42'}}>
        <nav className = {cx('inner-header')}>
            <ul>
                <li className = {cx('logo')}>
                    <img src = {logo} alt = 'MagicPost' href = '/' /></li>
                
                <li className = {cx('gioi-thieu')}><a href = '/'>Giới thiệu</a></li>
                <li className = {cx('tra-cuu')}><a href='/transactiontable'>Tra cứu</a></li>
                <li className = {cx('dich-vu')}><a href='/dichvu'>Dịch vụ</a></li>
                <li className = {cx('tin-tuc')}><a href='/tintuc'>Tin tức</a></li>
                <li className = {cx('canhan')}><p >Xin chào, lãnh đạo {username.username}</p></li>
                <li className= {cx('logout')}>
                    <a href='/login'>
                    <input
                    className={cx("inputButton")}
                    type="button"
                    value={"Đăng xuất"}
                    onClick={() => localStorage.clear()}
                    />
                    </a>
                </li>
            </ul>
                    
        </nav>
    </header>)
    
}

export default Header;