import "./header.css";
import PropTypes from "prop-types";
import {logoutUser} from "../../store/userReducer";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";

export default function Header(props) {
    const {userInfo, isLoggedIn} = useSelector((state) => state?.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    return (
        <nav className="main-nav">
            <Link className="main-nav-logo" to="/">
                <img
                    className="main-nav-logo-image"
                    src="/img/argentBankLogo.png"
                    alt="Argent Bank Logo"
                />
                <h1 className="sr-only">Argent Bank</h1>
            </Link>
            {
                !isLoggedIn &&
                <div>
                    <Link className="main-nav-item" to="/login">
                        <i className="fa fa-user-circle"></i>Sign In
                    </Link>
                </div>
            }
            {
                isLoggedIn &&
                <div>
                    <Link to="/profile" className="main-nav-item">
                        <i className="fa fa-user-circle"></i>
                        {userInfo?.firstName}
                    </Link>
                    <button className="main-nav-item" onClick={handleLogout}>
                        <i className="fa fa-sign-out"></i>Sign Out
                    </button>
                </div>
            }

        </nav>
    )
}

Header.propTypes = {
    isLoggedIn: PropTypes.string,
};
