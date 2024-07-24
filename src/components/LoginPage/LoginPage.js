import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loginUser} from "../../store/userReducer";
import {useNavigate} from "react-router-dom";
import Loading from "../Loading/loading";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const {error, isLoggedIn, isLoading } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) navigate('/profile');
    }, [isLoggedIn, navigate]);

    const handleLogin = () => {
        dispatch(loginUser({ email, password }));
        if (isLoggedIn) navigate('/profile');
    };

    return (
    <>
    <Header />
    <main className="main bg-dark">
        <section className="sign-in-content">
            <i className="fa fa-user-circle"></i>
            <h1>Sign In</h1>
            {!isLoading &&
                <form>
                    <div className="input-wrapper">
                        <label htmlFor="email">Username</label
                        ><input type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="password">Password</label
                        ><input type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                    />
                    </div>
                    <div className="input-remember">
                        <input type="checkbox" id="remember-me"/>
                        <label htmlFor="remember-me">Remember me</label>
                    </div>
                    <button onClick={handleLogin} className="sign-in-button" type={"button"}>Sign In</button>
                    {error && <p>Error: {error}</p>}
                </form>
            }
            {isLoading && <Loading/>}
        </section>
    </main>
        <Footer/>
    </>
    )
}
