import classNames from "classnames/bind";
import styles from './FunctionBar.module.scss';

const cx = classNames.bind(styles);

function FunctionBar() {
    return ( <aside className= {cx('wrapper')}>
        <h2>Function Bar</h2>
    </aside> );
}

export default FunctionBar;