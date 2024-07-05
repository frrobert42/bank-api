import "./header.css";
import PropTypes from "prop-types";
import {logoutUser} from "../../store/userReducer";
import {useDispatch} from "react-redux";

export default function Header(props) {
    const dispatch = useDispatch();
    let isLoggedIn = false;
    if (props) {
        isLoggedIn = !!props.isLoggedIn;
    }

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <nav className="main-nav">
            <a className="main-nav-logo" href="/">
                <img
                    className="main-nav-logo-image"
                    src="/img/argentBankLogo.png"
                    alt="Argent Bank Logo"
                />
                <h1 className="sr-only">Argent Bank</h1>
            </a>
            {
                !isLoggedIn &&
                <div>
                    <a className="main-nav-item" href="/profile">
                        <i className="fa fa-user-circle"></i>Sign In
                    </a>
                </div>
            }
            {
                isLoggedIn &&
                <div>
                    <a className="main-nav-item" href="/profile">
                        <i className="fa fa-user-circle"></i>
                        {props.isLoggedIn}
                    </a>
                    <a className="main-nav-item" onClick={handleLogout} href={"#logout"}>
                        <i className="fa fa-sign-out"></i>Sign Out
                    </a>
                </div>
            }

        </nav>
    )
}

Header.propTypes = {
    isLoggedIn: PropTypes.string,
};
