import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import RegistrationStatus from "./RegistrationStatus";
import FriendList from "./FriendList";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import MemorialHallViewMore from "./MemorialHallViewMore";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../redux/actions/userDataAction";
import Register from "../../modal/Register";


const MemorialHallStatus = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);
    const { userData } = useSelector((state: RootStateOrAny) => state.userData);
    const [activeBtn, setActiveBtn] = useState("Tour");
    const [registerOpen, setRegisterOpen] = useState<boolean>(false);

    useEffect(() => {
        if (is_loggedin) {
            dispatch(getUserData())
        }
    }, [activeBtn])

    const handleRegister = () => {
        if (!is_loggedin) {
            setRegisterOpen(true)
        } else {
            history.push("/memorialhall");
        }
    }
    const onHide = () => {
        setRegisterOpen(false)
    }

    const goToRegister = () => {
        history.push("/login");
    }
    return (
        <>
            <div className="bg-gray-trans">
                <div className="body-content">
                    <div className="body-content-inner ">
                        <div className="memorial-bg-img">
                            <div className="flower-overlay">
                                <div className="about-inner-content small-container" >
                                    <div className="d-md-flex">
                                        <div className="heading-content" >
                                            <div >
                                                <h1>{`${t("Memorial_Hall")}`}</h1>
                                            </div>
                                            <div className="tab-btns">
                                                <Button
                                                    onClick={() => { setActiveBtn("Tour") }}
                                                    className={activeBtn === "Tour" ? 'content-btn' : 'content-btn-2'}
                                                >
                                                    {`${t("Memorial_Hall_Status.Take_Tour")}`}
                                                </Button>
                                                {is_loggedin &&
                                                    <>
                                                        <Button
                                                            onClick={() => { setActiveBtn("Status") }}
                                                            className={activeBtn === "Status" ? 'content-btn memorail-btn-ml' : 'content-btn-2 memorail-btn-ml'}
                                                        >
                                                            {`${t("Memorial_Hall_Status.Registration_Status")}`}
                                                        </Button>
                                                        <Button
                                                            onClick={() => { setActiveBtn("FriendList") }}
                                                            className={activeBtn === "FriendList" ? 'content-btn memorail-btn-ml' : 'content-btn-2 memorail-btn-ml'}
                                                        >
                                                            {`${t("Memorial_Hall_Status.Friend_List")}`}
                                                        </Button>
                                                    </>
                                                }
                                            </div>

                                        </div>

                                        <div className="ml-auto">
                                            <Button
                                                onClick={() => { handleRegister() }}
                                                className="Register-btn"
                                            >
                                                {`${t("memorial_hall_register.Register")}`}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="custom-padding-cards small-container">
                            <div className="box-top">
                                {activeBtn === "Status" ? <RegistrationStatus /> : activeBtn === "FriendList" ? <FriendList userData={userData} /> : <MemorialHallViewMore />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {<Register show={registerOpen} onHide={onHide} goToRegister={goToRegister} />}
        </>
    );
};

export default MemorialHallStatus;
