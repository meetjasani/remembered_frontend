import { Nav } from "react-bootstrap";
import Buttons from "../../components/Buttons";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { setToggleMenu } from '../../redux/actions/toggleMenuAction';
import { Link, useHistory } from "react-router-dom";
import { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import {
  getUserData,
} from "../../redux/actions/userDataAction";
import { getCookie } from "../../helper/utils";
import InputField from "../../components/Inputfield";
import Logout from "../../modal/Logout";
import { ApiGet } from "../../helper/API/ApiData";
import ReactHtmlParser from 'react-html-parser';
import debounce from 'lodash.debounce';
registerLocale("ko", ko);

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

const AuthHeader: React.FC = () => {
  const pathName = ['/memorialhall', '/myaccount', '/faq', '/funeralnews', '/senddonation', '/donationreciept', '/Premiumfree', '/funeralnews', '/premiumfree', '/funeralDetails']
  const hideMobMenu = ['/memorialhall', '/myaccount', '/premiumfree', '/senddonation', '/donationreciept', '/memorialview', '/memorialprofile']
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const { is_toggleMenu } = useSelector((state: RootStateOrAny) => state.menuToggle);
  const closeopenClass = is_toggleMenu ? 'HideMenu' : 'showHideMenu';
  const bgLayerOpen = is_toggleMenu ? 'bg-layer-mob' : '';
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTermMob, setSearchTermMob] = useState<string>("");
  const [IsLogout, setIsLogout] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const { userData } = useSelector((state: RootStateOrAny) => state.userData);
  const [temp, setTemp] = useState(false);
  const [memorialHallDetailCard, setMemorialHallDetailCard] = useState<memorialHallDetail[]>([])
  const { innerWidth } = window
  const [StaticImage, setStaticImage] = useState("");

  useEffect(() => {
    if (innerWidth > 767) {
      // StaticImage = "../img/transuser.png".
      setStaticImage("../img/transuser.png")
    } else {
      // StaticImage = "../img/Avatar.png"
      setStaticImage("../img/Avatar.png")
    }
  }, [innerWidth])



  useEffect(() => {
    let getLangLocal = localStorage.getItem("i18nextLng");
    let getLangCookie = getCookie("i18next");
    let getLangTag = document.documentElement.lang;

    if (
      getLangLocal === "en" ||
      getLangCookie === "en" ||
      getLangTag === "en"
    ) {
      changeLanguage("en", "English(EN)");
    } else {
      changeLanguage("ko", "한국어(KR)");
    }

    dispatch(getUserData());
    GetMemorialHalls();
  }, []);


  const changeLanguage = (lang: string, name: string) => {
    i18next.changeLanguage(lang);
    if (temp) {
      let currentPath = location.pathname + location.search;
      window.location.href = currentPath;
    }
    setTemp(true);
  };

  const LogOut = () => {
    setIsLogout(true)
  };

  const closeModal = () => {
    setIsLogout(false)
  }

  const handleRoute = (PageName: any) => {
    if (PageName === "_About_Remembered") {
      history.push("/aboutremembered");
    } else if (PageName === "_memorialHall_Status") {
      history.push("/memorialhallstatus");
    } else if (PageName === "_faq") {
      history.push("/faq");
    } else if (PageName === "_Funeral_News") {
      history.push("/funeralnews");
    } else if (PageName === "_Priceguide") {
      history.push("/priceguide");
    }
  }

  const openMobMenu = () => {
    if (is_toggleMenu) {
      dispatch(setToggleMenu(false));
    }
    else {
      dispatch(setToggleMenu(true));
    }
  }

  const removeAllMenu = () => {
    dispatch(setToggleMenu(false));
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

  const openSearchpage = () => {
    setSearchTerm("")
    setOpenSearch(true);
  }

  const closeSearchpage = () => {
    setOpenSearch(false);
  }

  // const GetMemorialHallsNoAuth = () => {
  //   ApiGetNoAuth(`memorialHall/memorialHalls?search_term=${searchTerm ? searchTerm : ""}`).then((res: any) => {
  //     setMemorialHallDetailCard(res.data.memorials);
  //   });
  // }

  const GetMemorialHalls = () => {
    ApiGet(`memorialHall/getMemorialHallAuth?search_term=${searchTerm ? searchTerm : ""}`).then((res: any) => {
      setMemorialHallDetailCard(res.data.memorials);
    });
  }

  const debouncedChangeHandler = useCallback(
    debounce((value) => gotToHomePageSearch(value), 200)
    , []); 

  const debouncedChangeHandlerMob = useCallback(
    debounce((value) => gotToHomePageByMobSearch(value), 200)
    , []);

  useEffect(() => {

    if (is_toggleMenu) {
      dispatch(setToggleMenu(false));
    } 

  }, [location])


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

      <div className={`${closeopenClass} ml-auto`}>
        <div className="custom-container custom-nav">

          <div className="d-md-flex  nav-width header-top">
            <div className="item1">
              <Link to="/"><img src="./img/memorial-Frame.svg" className="nav-logo" alt="" /> </Link>
            </div>
            <div className="d-md-flex align-items-center mob-menu-links item2">
              <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_About_Remembered") }}>{`${t("About_Remembered")}`}</Nav.Link>
              <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_memorialHall_Status") }}>{`${t("Memorial_Hall")}`}</Nav.Link>
              <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_Priceguide") }} >{`${t("Price_Guide")}`}</Nav.Link>
              <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_faq") }} >{`${t("FAQ")}`}</Nav.Link>
              <Nav.Link className={location.pathname === '/' ? 'nav-links' : pathName.includes(location.pathname) ? 'nav-links-black' : 'nav-links'} onClick={() => { handleRoute("_Funeral_News") }}>{`${t("Funeral_News")}`}</Nav.Link>
            </div>
            <div className="ml-auto hide-mob item3">
              <div className={location.pathname === '/' ? ' header-search' : pathName.includes(location.pathname) ? ' header-search-black' : ' header-search'}>
                {/* <InputField
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
                  }}
                /> */}
                <input
                  name="serach"
                  value={searchTerm}
                  placeholder={`${t("Search")}`}
                  type="text"
                  className={location.pathname === '/' ? 'nav-search' : pathName.includes(location.pathname) ? 'nav-search-black' : 'nav-search'}
                  // onChange={(e: any) => {
                  //   setSearchTerm(e.target.value)
                  // }}
                  onChange={(e: any) => {
                    setSearchTerm(e.target.value)
                    // gotToHomePageSearch(e.target.value)
                    debouncedChangeHandler(e.target.value)
                  }}
                />
                < img
                  src={location.pathname === '/' ? './img/Ellipse.png' : pathName.includes(location.pathname) ? './img/blackelipse.png' : './img/Ellipse.png'}
                  alt=""
                  className="p-absolute-img"
                  onClick={gotToHomePage}
                />
              </div>
            </div>
            <div className="d-md-flex align-items-center item4" >
              <div className="d-md-flex  nav-profile-section">
                <img src={location.pathname === '/' ? userData?.avatar ? userData?.avatar : StaticImage :
                  pathName.includes(location.pathname) ? userData?.avatar ? userData?.avatar : "../img/navimg.png" : userData?.avatar ? userData?.avatar : StaticImage} alt="" className="nav-user-img cursor-pointer item2" onClick={() => { history.push("/myaccount") }} 
                  // onError={(e: any)=>{e.target.onerror = null;pathName.includes(location.pathname) ? e.target.src="./img/navimg.png" : e.target.src="./img/transuser.png"}} 
                  />


                <p className={location.pathname === '/' ? 'nav-user-name cursor-pointer item4' : pathName.includes(location.pathname) ? 'nav-user-name-black cursor-pointer item4' : 'nav-user-name cursor-pointer item4'} onClick={() => { history.push("/myaccount") }}> {userData?.name > 7
                  ? userData?.name.slice(0, 7) + "..."
                  : userData?.name}</p>
              </div>
              <div>
                <Buttons
                  ButtonStyle={location.pathname === '/' ? 'nav-btn' : pathName.includes(location.pathname) ? 'nav-btn-black' : 'nav-btn'}
                  onClick={LogOut}
                  children={`${t("signup.Log_out")}`}
                />
              </div>
            </div>
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

      {IsLogout && <Logout show={IsLogout} onHide={closeModal} />}
    </>
  );
};

export default AuthHeader;
