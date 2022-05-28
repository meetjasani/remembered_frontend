import React, { useCallback, useEffect, useState } from "react"
import { Nav } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import Buttons from "../../components/Buttons";
import InputField from "../../components/Inputfield";
import Register from "../../modal/Register";
import { setToggleMenu } from "../../redux/actions/toggleMenuAction";
import ReactHtmlParser from 'react-html-parser';
import { ApiGetNoAuth } from "../../helper/API/ApiData";

import debounce from 'lodash.debounce';
interface memorialHallDetail {
    id: string,
    image: string,
    name: string,
    date_of_death: string,
    date_of_birth: string,
    job_title: string,
    user_id: string,
    friend_list: Array<[]>
}

const Header: React.FC = () => {
    const pathName = ['/memorialhall', '/myaccount', '/faq', '/funeralnews', '/senddonation', '/donationreciept', '/Premiumfree', '/funeralnews', '/premiumfree', '/funeralDetails']
    const hideMobMenu = ['/memorialhall', '/myaccount', '/premiumfree', '/senddonation', '/donationreciept', '/memorialview', '/memorialprofile']
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login)
    const { is_toggleMenu } = useSelector((state: RootStateOrAny) => state.menuToggle);
    const bgLayerOpen = is_toggleMenu ? 'bg-layer-mob' : '';
    const [openSearch, setOpenSearch] = useState(false);
    const closeopenClass = is_toggleMenu ? 'HideMenu' : 'showHideMenu';
    const [memorialHallDetailCard, setMemorialHallDetailCard] = useState<memorialHallDetail[]>([])

    //i18n
    const { t } = useTranslation();

    //Homepage search filter
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchTermMob, setSearchTermMob] = useState<string>("");
    const [registerOpen, setRegisterOpen] = useState<boolean>(false);

    const handleRoute = (PageName: any) => {
        if (PageName === "_About_Remembered") {
            history.push("/aboutremembered");
        } else if (PageName === "_memorialHall_Status") {
            if (!is_loggedin) {
                setRegisterOpen(true)
            } else {
                history.push("/memorialhallstatus");
            }
        } else if (PageName === "_faq") {
            history.push("/faq")
        } else if (PageName === "_Funeral_News") {
            history.push("/funeralnews")
        } else if (PageName === "_Price_Guide") {
            history.push("/priceguide")
        }
    }

    const onHide = () => {
        setRegisterOpen(false)
    }

    const goToRegister = () => {
        history.push("/login");
    }

    const gotToHomePageSearch = (searchWord: string) => {
        history.push(`/homepage?search_term=${searchWord ? searchWord : ""}`)
    }

    const gotToHomePage = () => {
        history.push(`/homepage?search_term=${searchTerm ? searchTerm : ""}`)
    }

    const gotToHomePageByMob = (memorialHallName: string) => {
        history.push(`/homepage?search_term=${memorialHallName ? memorialHallName : ""}`)
        setOpenSearch(false);
    }

    const gotToHomePageByMobSearch = (searchWord: string) => {
        history.push(`/homepage?search_term=${searchWord ? searchWord : ""}`)
    }

    const removeAllMenu = () => {
        dispatch(setToggleMenu(false));
    }

    const openMobMenu = () => {
        if (is_toggleMenu) {
            dispatch(setToggleMenu(false));
        }
        else {
            dispatch(setToggleMenu(true));
        }
    }

    const openSearchpage = () => {
        setSearchTerm("")
        setOpenSearch(true);
    }

    const closeSearchpage = () => {
        setOpenSearch(false);
    }

    // const GetMemorialHalls = () => {
    //     ApiGet(`memorialHall/getMemorialHallAuth?search_term=${searchTerm ? searchTerm : ""}`).then((res: any) => {
    //         setMemorialHallDetailCard(res.data.memorials);
    //     });
    // }

    const GetMemorialHallsNoAuth = () => {
        ApiGetNoAuth(`memorialHall/memorialHalls?search_term=${searchTerm ? searchTerm : ""}`).then((res: any) => {
            setMemorialHallDetailCard(res.data.memorials);
        });
    }

    useEffect(() => {
        GetMemorialHallsNoAuth();
    }, []);

    const debouncedChangeHandler = useCallback(
        debounce(gotToHomePageSearch, 200)
        , []);

    const debouncedChangeHandlerMob = useCallback(
        debounce(gotToHomePageByMobSearch, 200)
        , []);

useEffect(()=>{

    if(is_toggleMenu){
        dispatch(setToggleMenu(false));
    }

},[location])
    
    return (
        <>

            <div className=" d-md-none d-block">
                <div className={hideMobMenu.includes(location.pathname) ? 'd-none' : 'mob-menu'}>
                    {/* <div className="mob-menu"> */}
                    <div className="menu-search-button">
                        <button className="menu-search-button" onClick={openSearchpage}>
                            <img src={pathName.includes(location.pathname) ? './img/black-search.svg' : './img/menu-mob.svg'} className="search-menu" alt="" />
                            {/* <img src="./img/menu-mob.svg" className="search-menu" /> */}
                        </button>
                    </div>
                    <div className="ml-auto menu-humberge-button">
                        <button onClick={openMobMenu} className="menu-humberge-button">
                            <img src={pathName.includes(location.pathname) ? './img/black-menu.svg' : './img/search-mob.svg'} className="humburge-menu" alt="" />
                            {/* <img src="./img/search-mob.svg" className="humburge-menu" /> */}
                        </button>
                    </div>
                </div>
                <div onClick={removeAllMenu} className={bgLayerOpen}></div>
            </div>

            <div className={`${closeopenClass} custom-container custom-nav`}>

                <div className="d-md-flex align-items-center nav-width header-top">
                    <div>
                        <Link to="/"><img src="./img/memorial-Frame.svg" className="nav-logo" alt="" /></Link>
                    </div>
                    <div className="d-md-flex align-items-center">
                        <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_About_Remembered") }}>{`${t("About_Remembered")}`}</Nav.Link>
                        <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_memorialHall_Status") }}>{`${t("Memorial_Hall")}`}</Nav.Link>
                        <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_Price_Guide") }}>{`${t("Price_Guide")}`}</Nav.Link>
                        <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_faq") }}>{`${t("FAQ")}`}</Nav.Link>
                        <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_Funeral_News") }}>{`${t("Funeral_News")}`}</Nav.Link>
                    </div>
                    <div className="ml-auto hide-mob">
                        <div className={location.pathname === '/' ? ' header-search' : pathName.includes(location.pathname) ? ' header-search-black' : ' header-search'}>
                            <InputField
                                label=""
                                fromrowStyleclass=""
                                name="serach"
                                value={searchTerm}
                                placeholder={`${t("Search")}`}
                                type="text"
                                lablestyleClass=""
                                InputstyleClass={location.pathname === '/' ? 'nav-search' : pathName.includes(location.pathname) ? 'nav-search-black' : 'nav-search'}
                                onChange={(e: any) => { 
                                    setSearchTerm(e.target.value) 
                                    debouncedChangeHandler(e.target.value) 
                                }}
                            />
                            <img
                                src={location.pathname === '/' ? './img/Ellipse.png' : pathName.includes(location.pathname) ? './img/blackelipse.png' : './img/Ellipse.png'}
                                className="p-absolute-img"
                                onClick={gotToHomePage}
                                alt=""
                            />
                        </div>
                    </div>
                    <div className="header-side-btn">
                        <Buttons
                            ButtonStyle="nav-login-btn"
                            onClick={() => { history.push("/login") }}
                            children={`${t("Login")}`}
                        />
                        <Buttons
                            ButtonStyle={location.pathname === '/' ? 'nav-btn' : pathName.includes(location.pathname) ? 'nav-btn-black' : 'nav-btn'}
                            onClick={() => { setRegisterOpen(true) }}
                            children={`${t("Register_Memorial_Hall")}`}
                        />
                    </div>
                </div>
            </div>
            {openSearch &&
                <div className="full-search-page d-md-none d-block">
                    <div className="my-page-head">
                        <img src="./img/back-arrow.svg" className="d-md-none d-block page-back-arrow" onClick={closeSearchpage} alt="" />
                        <h1>{`${t("Search")}`}</h1>
                    </div>
                    <div className="searchbar-row">
                        <InputField
                            label=""
                            fromrowStyleclass=""
                            name="serach"
                            value={searchTermMob}
                            placeholder={`${t("Home_Page.Enter_keyword")}`}
                            type="text"
                            lablestyleClass=""
                            InputstyleClass="full-serchbar"
                            onChange={(e: any) => {
                                setSearchTermMob(e.target.value)
                                debouncedChangeHandlerMob(e.target.value)
                            }}
                        />
                        < img
                            src='./img/blackelipse.png'
                            alt=""
                            className="full-search-img"
                            onClick={gotToHomePage}
                        />
                    </div>

                    {searchTermMob && memorialHallDetailCard?.filter(x => x.name.toLowerCase().includes(searchTermMob.toLowerCase()))
                        .map((items: any, i: number) => {
                            const simpletext = new RegExp("(" + searchTermMob + ")", "gi");
                            const memorialHallName = items?.name.replace(simpletext, `<span class="text-yellow">${searchTermMob}</span>`)
                            return (
                                <p onClick={() => { gotToHomePageByMob(items?.name) }}>{ReactHtmlParser(memorialHallName)}</p>

                            )
                        }
                        )}
                </div>
            }
            {<Register show={registerOpen} onHide={onHide} goToRegister={goToRegister} />}
        </>
    );
};

export default Header;

