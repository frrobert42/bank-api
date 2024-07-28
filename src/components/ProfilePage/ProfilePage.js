import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {useDispatch, useSelector} from 'react-redux';
import {getUserInfo, updateUserInfo} from "../../store/userReducer";
import {useEffect, useState} from "react";
import "./ProfilePage.css";
import {useNavigate} from "react-router-dom";
import Loading from "../Loading/loading";

export default function ProfilePage() {

    const [editName, setEditName] = useState(false);
    const {userInfo, isLoggedIn, isLoading} = useSelector((state) => state?.user);
    const [firstName, setFirstName] = useState(userInfo?.firstName);
    const [lastName, setLastName] = useState(userInfo?.lastName);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // show edit form
    const setEditMode = () => {
        setEditName(true);
        setFirstName(userInfo?.firstName);
        setLastName(userInfo?.lastName);
    }

    // update user name
    const updateName = (e) => {
        e.preventDefault();
        dispatch(updateUserInfo({firstName, lastName}));
        setEditName(!editName);
    }

    useEffect(() => {
        dispatch(getUserInfo());
        if (!localStorage.getItem('token')) navigate('/');
    }, [dispatch, isLoggedIn, navigate]);

    return (
        <>
            <Header isLoggedIn={"true"}/>
            <main className="main bg-dark">
                <div className="header">
                    <h1>
                        Welcome back<br />
                        {userInfo && !isLoading && <>{userInfo?.firstName} {userInfo?.lastName}!</>}
                        {isLoading && <Loading />}
                    </h1>
                    {editName === true &&
                        <form onSubmit={updateName}>
                            <input type="text" id="firstName" name="firstName" value={firstName}
                                   onChange={(e) => setFirstName(e.target.value)}/>
                            <input type="text" id="lastName" name="lastName" value={lastName}
                                   onChange={(e) => setLastName(e.target.value)}/>
                            <div className="edit-name-buttons">
                                <button className="submit-button" type="submit">Submit</button>
                                <button className="submit-button" type="button" onClick={updateName}>Cancel</button>
                            </div>
                        </form>
                    }
                    {!editName &&
                        <button className="edit-button" onClick={setEditMode}>Edit Name</button>
                    }
                </div>
                <h2 className="sr-only">Accounts</h2>
                <section className="account">
                    <div className="account-content-wrapper">
                        <h3 className="account-title">Argent Bank Checking (x8349)</h3>
                        <p className="account-amount">$2,082.79</p>
                        <p className="account-amount-description">Available Balance</p>
                    </div>
                    <div className="account-content-wrapper cta">
                        <button className="transaction-button">View transactions</button>
                    </div>
                </section>
                <section className="account">
                    <div className="account-content-wrapper">
                        <h3 className="account-title">Argent Bank Savings (x6712)</h3>
                        <p className="account-amount">$10,928.42</p>
                        <p className="account-amount-description">Available Balance</p>
                    </div>
                    <div className="account-content-wrapper cta">
                        <button className="transaction-button">View transactions</button>
                    </div>
                </section>
                <section className="account">
                    <div className="account-content-wrapper">
                        <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
                        <p className="account-amount">$184.30</p>
                        <p className="account-amount-description">Current Balance</p>
                    </div>
                    <div className="account-content-wrapper cta">
                        <button className="transaction-button">View transactions</button>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
