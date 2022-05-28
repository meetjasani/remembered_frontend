import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { ApiGet } from '../../helper/API/ApiData';
import UserImage from "../../img/user.svg";


function RegistrationStatus() {
  const history = useHistory()
  const [details, setDetails] = useState([]);
  const { innerWidth } = window

  const goToHallView = (id: string) => {
    if (innerWidth > 767) {
      history.push('/memorialview?id=' + id)
    }else{
      history.push('/memorialprofile?id=' + id)
    }
   
  }
  useEffect(() => {
    ApiGet("memorialHall/memorialHallSByUser").then((res: any) => {
      setDetails(res.data ?? []);
    });
  }, [])
  return (
    <>
      <div className="d-flex flex-wrap memorial-hall-status">
        {details.map((detail: any) => (
          // <div className="boxs cursor-pointer">
          // <div className="main-boxes-memorial">
            <div className="boxs cursor-pointer" onClick={() => goToHallView(detail.id)} key={detail?.id}>
              <div className="profile-img ">
                <img src={detail?.image ? detail?.image : UserImage || "./img/Avatar.png"} alt="" onError={(e: any)=>{e.target.onerror = null; e.target.src="./img/Avatar.png"}}  />
              </div>
              <div className="box-content">
                <h2>{(detail?.name).length >= 10 ? (detail?.name).slice(0, 10) + '...' : detail?.name}</h2>
                <p>{detail?.date_of_death}</p>
                <h3>{(detail?.job_title).length >= 20 ? (detail?.job_title).slice(0, 20) + '...' : detail?.job_title}</h3>
              </div>
            </div>
          // </div>
        ))
        }
      </div>
    </>
  )
}

export default RegistrationStatus
