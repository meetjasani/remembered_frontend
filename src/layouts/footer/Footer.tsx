import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer: React.FC<any> = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const bigfooterPath = ['/', '/memorialhallstatus', '/homepage']

  return (
    <>
      {bigfooterPath.includes(location.pathname)
        ?
        <div className="big-footer" >
          <div className="big-footer-container">
            <div className="footer-logo item4">
              <img src="../../img/footer-logo.png" alt="" />
            </div>
            <div className="item5">
              <div className="footer-link ">
                <Link to="/" className="link">{`${t("signup.Terms_of_use")}`}</Link>
                <Link to="/" className="link">{`${t("Footer.privacy_policy")}`}</Link>
                <Link to="/" className="link">{`${t("About_Remembered")}`}</Link>
                <Link to="/" className="link">{`${t("FAQ")}`}</Link>
                <Link to="/" className="link">{`${t("Footer.Contact_us")}`}</Link>
              </div>
            </div>
            <div className="footer-main-row item2">
              <div className="footer-info">
                <h3>(주)엠서클</h3>
              </div>
              <div>
                <div className="footer-info-row">
                  <div className="d-flex">
                    <h4>주소</h4>
                    <h6>서울시 강남구 봉은사로 114길 12, 7층</h6>
                  </div>
                  <div className="d-flex">
                    <h4>대표 </h4>
                    <h6>서종원</h6>
                  </div>
                  <div className="d-flex">
                    <h4>사업자 등록번호 </h4>
                    <h6>120-86-10499</h6>
                  </div>
                  <div className="d-flex">
                    <h4>통신판매업신고</h4>
                    <h6>2009-서울강남-00290</h6>
                  </div>
                  <div className="d-flex">
                    <h4>고객센터</h4>
                    <h6>02-550-8700</h6>
                  </div>
                  <div className="d-flex">
                    <h4>팩스</h4>
                    <h6>02-563-8398</h6>
                  </div>
                  <div className="d-flex">
                    <h4>상담가능시간</h4>
                    <h6>오전 9:00 - 오후 6:00</h6>
                  </div>
                </div>
                <div className="copyright-text">
                  <p>Copyright © Mcircle Corp. ALL RIGHTS RESERVED.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        // <div className="footer">
        //   <div className="container p-0">
        //     <div className="footer-logo">
        //       <img src={FooterLogo} alt=""></img>
        //     </div>
        //     <div className="footer-depth">
        //       <div className="footer-link">
        //         <a className="link">{`${t("signup.Terms_of_use")}`}</a>
        //         <a className="link">{`${t("Footer.privacy_policy")}`}</a>
        //         <a className="link">{`${t("About_Remembered")}`}</a>
        //         <a className="link">{`${t("FAQ")}`}</a>
        //         <a className="link">{`${t("Footer.Contact_us")}`}</a>
        //       </div>
        //       <div className="footer-details">
        //         <div className="left-title">{`${t("Footer.M_Circle")}`}</div>
        //         <div className="right">
        //           <div className="description">
        //             <div className="label">{`${t("PremiumFree.InquiryForm.Address")}`}</div>
        //             <div className="value">{`${t("Footer.Enter_Address")}`}</div>

        //             <div className="label">{`${t("Footer.Representative")}`}</div>
        //             <div className="value">{`${t("Footer.Name")}`}</div>

        //             <div className="label">{`${t("Footer.Company_Registration_Number")}`}</div>
        //             <div className="value">120-86-10499</div>

        //             <div className="label">{`${t("Footer.Mail_order_business_report")}`}</div>
        //             <div className="value">{`${t("Footer.Report_name")}`}</div>

        //             <div className="label">{`${t("Footer.Service_center")}`}</div>
        //             <div className="value">02-550-8700</div>

        //             <div className="label">{`${t("Footer.Fax")}`}</div>
        //             <div className="value">02-563-8398</div>

        //             <div className="label">{`${t("Footer.Consultation_time")}`}</div>
        //             <div className="value">{`${t("PremiumFree.Contact_Information_title2")}`}</div>
        //           </div>
        //           <div className="copyright">
        //             Copyright © Mcircle Corp. ALL RIGHTS RESERVED.
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>
        :
        <div className="footer-two">
          <div>
            <p>Copyright © Mcircle Corp. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      }
    </>
  );
};

export default Footer;
