import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
interface Props {
    onHide: () => void
    addressData: string,
    funaralHallName: string
}

declare global {
    interface Window {
        kakao: any;
    }
}


const MemorialDirectionPopup: React.FC<Props> = ({ onHide, funaralHallName, addressData }) => {
    const { t } = useTranslation();
    const [splitAddress, setSplitAddress] = useState("");

    useEffect(() => {

        const script = document.createElement('script');

        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=c38ef9667188c5012eda6562f4403007&autoload=false&libraries=services`;
        document.head.appendChild(script);

        script.onload = () => {
            window?.kakao.maps.load(() => {
                let container = document.getElementById('map');
                let options = {
                    center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                    level: 3,
                };

                let tmpMap = new window.kakao.maps.Map(container, options);

                // 주소-좌표 변환 객체를 생성합니다
                var geocoder = new window.kakao.maps.services.Geocoder();
                // 주소로 좌표를 검색합니다
                let splitAddress = addressData.split(",");
                setSplitAddress(splitAddress[2]);
                geocoder.addressSearch(splitAddress[2], function (result: any, status: any) {
                    // 정상적으로 검색이 완료됐으면 
                    var coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                    tmpMap.setCenter(coords);
                });
            });
        };

        return () => script.remove();

    }, []);

    return (
        <>
            <div className="memorial-dialog-popup">
                <div className="title">
                    <h1>{`${t("MemorialDirectionPopup.Directions")}`}</h1>
                    <img src="../../img/close-btn-img.svg" alt="" className="close-btn cursor-pointer" onClick={onHide} />
                </div>
                <div className="body">
                    <h1>{funaralHallName}</h1>
                    <h2>{addressData.split(",")[2]}</h2>

                </div>
                <div className="map-loaction">
                    <div id="map" style={{ width: "450px", height: "200px" }} />
                    {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.950848182919!2d72.86072345076448!3d21.233797586053004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f2fd3e0c681%3A0x6e91a2940224bd39!2sCodexive%20Solutions!5e0!3m2!1sen!2sin!4v1631870064525!5m2!1sen!2sin" width="450" height="190" style={{border:0}} title=""></iframe> */}
                </div>
                <div className="popup-footer">
                    <CopyToClipboard text={addressData.split(",")[2]}>
                        <button className="copy-address-btn">{`${t("MemorialDirectionPopup.Copy_the_address")}`}</button>
                    </CopyToClipboard>
                </div>
            </div>
        </>
    )
}

export default MemorialDirectionPopup
