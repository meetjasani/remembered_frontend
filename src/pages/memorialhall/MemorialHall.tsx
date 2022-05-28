import React, { useCallback, useEffect, useRef, useState } from "react";
import Buttons from "../../components/Buttons";
import InputField from "../../components/Inputfield";
import { useTranslation } from "react-i18next";
import { Form } from "react-bootstrap";
import { RelationShip_en, RelationShip_ko, ServiceDuration_en, ServiceDuration_ko } from "../../helper/Constant";
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import moment from "moment";
import { ApiGet, ApiPatch, ApiPost, ApiPut } from "../../helper/API/ApiData";
import MemorialHallStatus from "../../modal/MemorialHallStatus";
import { useHistory, useLocation } from "react-router";
import AuthStorage from "../../helper/AuthStorage";
import ReactHtmlParser from 'react-html-parser';
import NumberInput from "../../components/NumberInput";
import Select from 'react-select';
import RequiredInfo from "../../modal/RequiredInfo";
import debounce from 'lodash.debounce';

registerLocale("ko", ko);
const MemorialHall = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation()
  const { innerWidth } = window
  const queryParams = new URLSearchParams(window.location.search);
  const hallID = queryParams.get('id')?.toString();
  const relationShip = AuthStorage.getLang() === "ko" ? RelationShip_ko : RelationShip_en;
  const serviceDuration = AuthStorage.getLang() === "ko" ? ServiceDuration_ko : ServiceDuration_en;
  const [imgSrc, setImgSrc] = useState("");
  const [imgSrcName, setImgSrcName] = useState("");
  const [oldDonationOrg, setOldDonationOrg] = useState("");
  const [oldDonationField, setOldDonationField] = useState("");
  const [isSave, setIsSave] = useState(false);
  const [addressSuggestion, setAddressSuggestion] = useState(false);
  const [requiredInfoOpen, setRequiredInfoOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [dateOfDeath, setDateOfDeath] = useState<Date | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [dateOfCarryingCofinOut, setDateOfCarryingCofinOut] = useState<Date | null>(null);

  const [
    memorialMoneyAccountGuideSerives,
    setmemorialMoneyAccountGuideSerives,
  ] = useState(false);
  const [donationMoneyService, setDonationMoneyService] = useState(false);
  const relationShipDropDown = [
    { label: relationShip.daughter, value: "Daughter" },
    { label: relationShip.son, value: "Son" },
    { label: relationShip.other, value: "Other" },
  ];

  const serviceDurationDropDown = [
    { label: serviceDuration.days, value: "1 of 3 days" },
    { label: serviceDuration.week, value: "1 week" },
    { label: serviceDuration.month, value: "1 month" },
  ];

  const [registerer, setRegisterer] = useState([
    {
      name: "",
      relationship: "",
      relationship_name: ""
    },
  ]);

  const [inviteFamilyMembers, setInviteFamilyMembers] = useState([
    {
      name: "",
      email: "",
      relationship: "",
      relationship_name: ""
    },
  ]);

  const [moneyAccount, setMoneyAccount] = useState([
    {
      name: "",
      bank_name: "",
      ac_number: "",
    },
  ]);

  const [donationSerives, setDonationSerives] = useState([
    {
      donation_field: "",
      bank_name: "",
      recipient_organization: "",
      ac_number: "",
      Introduction: "",
      service_duration: "",
    },
  ]);

  const selectOption = (label: string, dropDownName: string) => {

    let list: any = []
    if (dropDownName === "bank_name") {
      list = KoreanBank
    }
    if (dropDownName === "donation_field") {
      list = donationFieldData
    }
    if (dropDownName === "relationship") {
      list = relationShipDropDown
    }
    if (dropDownName === "service_duration") {
      list = serviceDurationDropDown
    }
    if (dropDownName === "hourOfDeath" || dropDownName === "hourOfCarryingCofinOut") {
      list = selecthour
    }
    if (dropDownName === "deathMinutes" || dropDownName === "minuteOfCarryingCofinOut") {
      list = selectminute
    }

    let findData = list.find((data: any) => data?.value === label)
    let dataObj = undefined
    if (findData?.value) {
      dataObj = {
        label: findData?.label,
        value: findData?.value,
      }
    }
    return dataObj;
  }

  const [hallRegData, setHallRegData] = useState({
    name: "",
    job_title: "",
    date_of_death: "",
    year: "",
    date_of_carrying_the_coffin_out: "",
    funeral_Address: "",
    room_number: "",
    burial_plot: "",
    Introduction: "",
    memorial_hall_status: "",
    registerer: [],
    inviteFamilyMembers: [],
    moneyAccount: [],
    donationSerives: [],
  });

  const resetFormError = {
    nameError: "",
    job_titleError: "",
    date_of_deathError: "",
    registerername: "",
    registererRelation: "",
    selectedFileError: "",
    date_of_carrying_the_coffin_outError: "",
    funeral_AddressError: "",
    room_numberError: "",
    burial_plotError: "",
    IntroductionError: "",
    dateOfBirthError: ""
  };
  const [formError, setFormError] = useState(resetFormError);
  const [isRegisterd, setIsRegisterd] = useState(false);
  const [hourOfDeath, setHourOfDeath] = useState("");
  const [minuteOfDeath, setMinuteOfDeath] = useState("");
  const [hourOfCarryingCofinOut, setHourOfCarryingCofinOut] = useState("");
  const [minuteOfCarryingCofinOut, setMinuteOfCarryingCofinOut] = useState("");
  const [selectedAddressID, setSelectedAddressID] = useState("");
  const [koreanBank, setKoreanBank] = useState([
    { value: "", label: "" },
  ]);
  const [donationField, setDonationField] = useState([
    { value: "", label: "" },
  ]);

  const [funeralList, setFuneralList] = useState<any[]>([]);

  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const observer = useRef<any>();
  const [hasMore, setHasMore] = useState(false);

  const DonationIntroductionPlaceholder = `고인은 생전 (기부 분야 예: 미혼모 복지_①) 에 대한 관심과 애정으로 평소 정성스런 마음과 물질을 나누셨습니다.\n유족들은 고인의 유지를 잇기 위해 (단체 이름과 Web site_②) 기부단체에 계속 지원하기로 하였습니다.`

  const selecthour = [
    { value: "01", label: "01" },
    { value: "02", label: "02" },
    { value: "03", label: "03" },
    { value: "04", label: "04" },
    { value: "05", label: "05" },
    { value: "06", label: "06" },
    { value: "07", label: "07" },
    { value: "08", label: "08" },
    { value: "09", label: "09" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "13", label: "13" },
    { value: "14", label: "14" },
    { value: "15", label: "15" },
    { value: "16", label: "16" },
    { value: "17", label: "17" },
    { value: "18", label: "18" },
    { value: "19", label: "19" },
    { value: "20", label: "20" },
    { value: "21", label: "21" },
    { value: "22", label: "22" },
    { value: "23", label: "23" },
    { value: "24", label: "24" },
  ];

  const selectminute = [
    { value: "00", label: "00" },
    { value: "01", label: "01" },
    { value: "02", label: "02" },
    { value: "03", label: "03" },
    { value: "04", label: "04" },
    { value: "05", label: "05" },
    { value: "06", label: "06" },
    { value: "07", label: "07" },
    { value: "08", label: "08" },
    { value: "09", label: "09" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "13", label: "13" },
    { value: "14", label: "14" },
    { value: "15", label: "15" },
    { value: "16", label: "16" },
    { value: "17", label: "17" },
    { value: "18", label: "18" },
    { value: "19", label: "19" },
    { value: "20", label: "20" },
    { value: "21", label: "21" },
    { value: "22", label: "22" },
    { value: "23", label: "23" },
    { value: "24", label: "24" },
    { value: "25", label: "25" },
    { value: "26", label: "26" },
    { value: "27", label: "27" },
    { value: "28", label: "28" },
    { value: "29", label: "29" },
    { value: "30", label: "30" },
    { value: "31", label: "31" },
    { value: "32", label: "32" },
    { value: "33", label: "33" },
    { value: "34", label: "34" },
    { value: "35", label: "35" },
    { value: "36", label: "36" },
    { value: "37", label: "37" },
    { value: "38", label: "38" },
    { value: "39", label: "39" },
    { value: "40", label: "40" },
    { value: "41", label: "41" },
    { value: "42", label: "42" },
    { value: "43", label: "43" },
    { value: "44", label: "44" },
    { value: "45", label: "45" },
    { value: "46", label: "46" },
    { value: "47", label: "47" },
    { value: "48", label: "48" },
    { value: "49", label: "49" },
    { value: "50", label: "50" },
    { value: "51", label: "51" },
    { value: "52", label: "52" },
    { value: "53", label: "53" },
    { value: "54", label: "54" },
    { value: "55", label: "55" },
    { value: "56", label: "56" },
    { value: "57", label: "57" },
    { value: "58", label: "58" },
    { value: "59", label: "59" },
  ];

  const KoreanBank = [
    { value: "국민은행", label: "국민은행" },
    { value: "우리은행", label: "우리은행" },
    { value: "신한은행", label: "신한은행" },
    { value: "하나은행", label: "하나은행" },
    { value: "농협은행", label: "농협은행" },
    { value: "기업은행", label: "기업은행" },
    { value: "케이뱅크", label: "케이뱅크" },
    { value: "새마을금고", label: "새마을금고" },
    { value: "대구은행", label: "대구은행" },
    { value: "부산은행", label: "부산은행" },
    { value: "SC은행", label: "SC은행" },
    { value: "광주은행", label: "광주은행" },
    { value: "신협", label: "신협" },
    { value: "전북은행", label: "전북은행" },
    { value: "수협", label: "수협" },
    { value: "산업은행", label: "산업은행" },
    { value: "제주은행", label: "제주은행" },
    { value: "카카오뱅크", label: "카카오뱅크" },
  ]

  const donationFieldData = [
    { value: "생명 살림, 건강한 가정", label: "생명 살림, 건강한 가정" },
    { value: "어린이 청년 지원, 장학 사업", label: "어린이 청년 지원, 장학 사업 " },
    { value: "여성 인권 복지, 성평등", label: "여성 인권 복지, 성평등" },
    { value: "노인 복지 웰다잉", label: "노인 복지 웰다잉" },
    { value: "장애인 인권 복지", label: "장애인 인권 복지" },
    { value: "생태 환경, 생협, 공동체 지원", label: "생태 환경, 생협, 공동체 지원" },
    { value: "경제 정의, 빈민층 지원", label: "경제 정의, 빈민층 지원" },
  ]

  const validateForm = () => {
    let errors = {
      nameError: "",
      job_titleError: "",
      date_of_deathError: "",
      date_of_carrying_the_coffin_outError: "",
      funeral_AddressError: "",
      room_numberError: "",
      // imageError: "",
      selectedFileError: "",
      burial_plotError: "",
      IntroductionError: "",
      registerername: "",
      registererRelation: "",
      dateOfBirthError: ""
    };
    if (!hallRegData.name) {
      errors.nameError = `${t(
        "memorial_hall_register.Errors.This_is_required_information"
      )}`;
    }
    if (!hallRegData.job_title) {
      errors.job_titleError = `${t(
        "memorial_hall_register.Errors.This_is_required_information"
      )}`;
    }

    if (
      !dateOfDeath ||
      !hourOfDeath ||
      !minuteOfDeath

    ) {
      errors.date_of_deathError = `${t(
        "memorial_hall_register.Errors.This_is_required_information"

      )}`;
    }

    if (
      !dateOfCarryingCofinOut ||
      !hourOfCarryingCofinOut ||
      !minuteOfCarryingCofinOut
    ) {
      errors.date_of_carrying_the_coffin_outError = `${t(
        "memorial_hall_register.Errors.This_is_required_information"
      )}`;
    }

    if (registerer.length === 1 && !registerer[0].name) {
      errors.registerername = `${t(
        "memorial_hall_register.Errors.This_is_required_information"
      )}`;
    }
    if (registerer.length === 1 && !registerer[0].relationship) {
      errors.registererRelation = `${t(
        "memorial_hall_register.Errors.This_is_required_information"
      )}`;
    }

    if (!hallRegData.funeral_Address) {
      errors.funeral_AddressError = `${t(
        "memorial_hall_register.Errors.This_is_required_information"
      )}`;
    }
    if (!hallRegData.room_number) {
      errors.room_numberError = `${t(
        "memorial_hall_register.Errors.This_is_required_information"
      )}`;
    }
    if (!imgSrc) {
      errors.selectedFileError = `${t(
        "memorial_hall_register.Errors.This_is_required_information"
      )}`;
    }
    if (!hallRegData.burial_plot) {
      errors.burial_plotError = `${t(
        "memorial_hall_register.Errors.This_is_required_information"
      )}`;
    }
    if (!hallRegData.Introduction) {
      errors.IntroductionError = `${t(
        "memorial_hall_register.Errors.This_is_required_information"
      )}`;
    }
    if (!dateOfBirth) {
      errors.dateOfBirthError = `${t(
        "memorial_hall_register.Errors.This_is_required_information"
      )}`;
    }

    if (
      !hallRegData.name ||
      !hallRegData.job_title ||
      // !hallRegData.funeral_Address ||
      !dateOfDeath ||
      !hourOfDeath ||
      !minuteOfDeath ||
      !dateOfCarryingCofinOut ||
      !hourOfCarryingCofinOut ||
      !minuteOfCarryingCofinOut ||
      !hallRegData.room_number ||
      !hallRegData.burial_plot ||
      !hallRegData.Introduction ||
      !dateOfBirth ||
      !imgSrc
    ) {
      setFormError(errors);
      return true;
    }
    if (
      registerer.length === 1 &&
      !registerer[0].name &&
      registerer.length === 1 &&
      !registerer[0].relationship
    ) {
      setFormError(errors);
      return true;
    }
    setFormError(errors);
    return false;
  };

  const getFuneralAddress = (event: any) => {
    let val: any
    if (event === "") {
      val = ""
    } else {
      val = event
      setFuneralList([])
    }
    ApiGet(`memorialHall/getFuneralAddress?funeral_term=${val.toString()}&per_page=10&page_number=${page}`).then((res: any) => {
      setFuneralList((prev: any[]) => {
        return [...prev, ...res?.data.funeralList];
      });

      setHasMore(res.data.funeralList.length > 0);
      setLoading(false);

      if (val) {
        setAddressSuggestion(true)
      }
    });
  }

  const debouncedChangeHandler = useCallback(
    debounce(getFuneralAddress, 300)
    , []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  useEffect(() => {
    if (isRegisterd) {
      validateForm();
    }
  }, [hallRegData, isRegisterd]);

  const handleAddRegistererFields = () => {
    const values = [...registerer];
    values.push({
      name: "",
      relationship: "",
      relationship_name: ""
    });
    setRegisterer(values);
  };

  const handleRemoveRegistererFields = (index: number) => {
    if (registerer.length > 1) {
      const values = [...registerer];
      values.splice(index, 1);
      setRegisterer(values);
    }
  };

  const handleInputChangeRegisterer = (
    index: number,
    event: any,
    inputName: string
  ) => {

    const values = [...registerer];
    if (inputName === "relationship") {
      values[index].relationship = event.value;
    }
    if (inputName === "name") {
      values[index].name = event.target.value;
    }
    if (inputName === "relationship_name") {
      values[index].relationship_name = event.target.value;
    }
    setRegisterer(values);
  };

  const handleAddInvitaionFamilyFields = () => {
    const values = [...inviteFamilyMembers];
    values.push({
      name: "",
      email: "",
      relationship: "",
      relationship_name: ""
    });
    setInviteFamilyMembers(values);
  };

  const handleRemoveinviteFamilyMembersFields = (index: number) => {
    if (inviteFamilyMembers.length > 1) {
      const values = [...inviteFamilyMembers];
      values.splice(index, 1);
      setInviteFamilyMembers(values);
    }
  };

  const handleInputChangeInvitaionFamily = (
    index: number,
    event: any,
    inputName: string
  ) => {
    const values = [...inviteFamilyMembers];
    if (inputName === "relationship") {
      values[index].relationship = event.value
    }
    if (inputName === "relationship_name") {
      values[index].relationship_name = event.target.value
    }
    if (inputName === "name") {
      values[index].name = event.target.value;
    }
    if (inputName === "email") {
      values[index].email = event.target.value;
    }
    setInviteFamilyMembers(values);
  };


  const handleAddApplicantFields = () => {
    const values = [...moneyAccount];
    values.push({
      name: "",
      bank_name: "",
      ac_number: "",
    });
    setMoneyAccount(values);
  };

  const handleRemoveApplicantFields = (index: number) => {
    if (moneyAccount.length > 1) {
      const values = [...moneyAccount];
      values.splice(index, 1);
      setMoneyAccount(values);
    }
  };

  const handleInputChangeApplicant = (
    index: number,
    event: any,
    inputName: string
  ) => {
    const values = [...moneyAccount];
    if (inputName === "bank_name") {
      values[index].bank_name = event.value;
    }
    if (inputName === "name") {
      values[index].name = event.target.value;
    }
    if (inputName === "ac_number") {
      const re = /^[0-9\b]+$/;

      if (!event.target.value || event.target.value === "" || re.test(event.target.value)) {
        values[index].ac_number = event.target.value;
      }
    }
    setMoneyAccount(values);
  };

  const handleChnageEvent = (e: any) => {
    setHallRegData({
      ...hallRegData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChnageEventDonationSerives = (
    index: number,
    event: any,
    inputName: string
  ) => {


    const values = [...donationSerives];
    if (inputName === "donation_field") {
      values[index].donation_field = event.value;
    }
    if (inputName === "recipient_organization") {
      values[index].recipient_organization = event.target.value;
    }
    if (inputName === "bank_name") {
      values[index].bank_name = event.value;
    }
    if (inputName === "ac_number") {

      const re = /^[0-9\b]+$/;

      if (!event.target.value || event.target.value === "" || re.test(event.target.value)) {
        values[index].ac_number = event.target.value;
      }

    }
    if (inputName === "Introduction") {
      values[index].Introduction = event.target.value;
    }
    if (inputName === "service_duration") {
      values[index].service_duration = event.value;
    }

    setDonationSerives(values);
  };

  const attechImage = () => {
    document.getElementById("attechImage")?.click();
  };

  const openModal = () => {
    setIsRegisterd(true);
    if (validateForm()) {
      setIsSave(false);
      setRequiredInfoOpen(true)
    } else {
      setIsSave(true);
    }
  };

  const createHall = (type: string) => {

    const deathDateTime =
      moment(dateOfDeath).format("YYYY-MM-DD") +
      " " +
      hourOfDeath +
      ":" +
      minuteOfDeath;

    const CarryingCofinOutDateTime =
      moment(dateOfCarryingCofinOut).format("YYYY-MM-DD") +
      " " +
      hourOfCarryingCofinOut +
      ":" +
      minuteOfCarryingCofinOut;

    const finalDeathDateTime = moment(deathDateTime).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const finalCarryingCofinOutDateTime = moment(
      CarryingCofinOutDateTime
    ).format("YYYY-MM-DD HH:mm:ss");

    if (hallID) {
      ApiPut(`memorialHall/editMemorialHall/${hallID}`, {
        name: hallRegData.name,
        date_of_birth: moment(dateOfBirth).format("YYYY-MM-DD"),
        job_title: hallRegData.job_title,
        date_of_death: finalDeathDateTime,
        date_of_carrying_the_coffin_out: finalCarryingCofinOutDateTime,
        // funeral_Address: hallRegData.funeral_Address,
        funeral_Address: selectedAddressID.toString(),
        room_number: hallRegData.room_number.toString(),
        burial_plot: hallRegData.burial_plot,
        Introduction: hallRegData.Introduction,
        memorial_hall_status: type,
        is_condolences: memorialMoneyAccountGuideSerives,
        is_donation: donationMoneyService,
        registerer: registerer.map((data: any) => {
          return {
            ...data,
            relationship: data?.relationship,
          };
        }),
        inviteFamilyMembers: inviteFamilyMembers.map((data: any) => {
          return {
            ...data,
            relationship: data?.relationship,
          };
        }),
        moneyAccount: moneyAccount.map((data: any) => {
          return {
            ...data,
            bank_name: data?.bank_name,
          };
        }),
        donationSerives: donationSerives.map((data: any) => {
          return {
            ...data,
            service_duration: data?.service_duration,
            bank_name: data?.bank_name,
            donation_field: data?.donation_field,
          };
        }),
      })
        .then((res: any) => {
          if (res.status === 200) {
            memorialHallImage(res.data.data.id)
          }
        })
        .catch((error) => {

        });

    }
    else {
      ApiPost("memorialHall/memorialHallRegistration", {
        name: hallRegData.name,
        // age: hallRegData.age,
        date_of_birth: moment(dateOfBirth).format("YYYY-MM-DD"),
        job_title: hallRegData.job_title,
        date_of_death: finalDeathDateTime,
        date_of_carrying_the_coffin_out: finalCarryingCofinOutDateTime,
        // funeral_Address: hallRegData.funeral_Address,
        funeral_Address: selectedAddressID.toString(),
        room_number: hallRegData.room_number.toString(),
        burial_plot: hallRegData.burial_plot,
        Introduction: hallRegData.Introduction,
        memorial_hall_status: type,
        is_condolences: memorialMoneyAccountGuideSerives,
        is_donation: donationMoneyService,
        registerer: registerer.map((data: any) => {
          return {
            ...data,
            relationship: data?.relationship,
          };
        }),
        inviteFamilyMembers: inviteFamilyMembers.map((data: any) => {
          return {
            ...data,
            relationship: data?.relationship,
          };
        }),
        moneyAccount: moneyAccount.map((data: any) => {
          return {
            ...data,
            bank_name: data?.bank_name,
          };
        }),
        donationSerives: donationSerives.map((data: any) => {
          return {
            ...data,
            service_duration: data?.service_duration,
            bank_name: data?.bank_name,
            donation_field: data?.donation_field,
          };
        }),
      })
        .then((res: any) => {
          if (res.status === 200) {
            memorialHallImage(res.data.id)
          }
        })
        .catch((error) => {

        });
    }


  };

  const memorialHallImage = (memorial_id: any) => {
    let formData = new FormData();
    if (selectedFile) {
      formData.append('id', memorial_id);
      formData.append('image', selectedFile);
      ApiPatch("memorialHall/memorialHallImage", formData)
        .then((res) => {
          // history.push('/memorialview?id=' + memorial_id + '&isFromHallReg=true')

          if (innerWidth > 767) {
            history.push('/memorialview?id=' + memorial_id + '&isFromHallReg=true')
          } else {
            history.push('/memorialprofile?id=' + memorial_id + '&isFromHallReg=true')
          }

        }).catch((error) => {
          history.push('/memorialview?id=' + memorial_id)
        })
    } else {
      if (innerWidth > 767) {
        history.push('/memorialview?id=' + memorial_id + '&isFromHallReg=true')
      } else {
        history.push('/memorialprofile?id=' + memorial_id + '&isFromHallReg=true')
      }
      // history.push('/memorialview?id=' + memorial_id + '&isFromHallReg=true')
    }
  }

  const openDropDownOnIconOrTextByID = (id: string) => {
    document.getElementById(id)?.click()
  }

  const getAddressById = (aid: string) => {
    if (funeralList.length > 0) {
      const findone: any = funeralList.find((data: any) => data.id === parseInt(aid))
      return findone?.address
    }
    return ""
  }

  useEffect(() => {
    if (funeralList.length > 0) {
      setHallRegData({
        ...hallRegData,
        funeral_Address: getAddressById(selectedAddressID),
      })
    }
  }, [funeralList])

  useEffect(() => {
    getFuneralAddress("");
    if (hallID) {
      ApiGet(
        `memorialHall/getMemorialHallByid/${hallID}`
      ).then((res: any) => {
        setHallRegData({
          date_of_death: "",
          date_of_carrying_the_coffin_out: "",
          year: "",
          name: res?.data?.name,
          job_title: res?.data?.job_title,
          funeral_Address: getAddressById(res?.data?.funeral_Address),
          room_number: res?.data?.room_number,
          burial_plot: res?.data?.burial_plot,
          Introduction: res?.data?.Introduction,
          memorial_hall_status: res?.data?.memorial_hall_status,
          registerer: [],
          inviteFamilyMembers: [],
          moneyAccount: [],
          donationSerives: [],
        })
        setSelectedAddressID(res?.data?.funeral_Address)
        setDateOfBirth(new Date(res?.data?.date_of_birth))
        setDateOfDeath(new Date(moment(res?.data?.date_of_death).format("YYYY-MM-DD")))
        setDateOfCarryingCofinOut(new Date(moment(res?.data?.date_of_carrying_the_coffin_out).format("YYYY-MM-DD")))
        setHourOfDeath(moment(res?.data?.date_of_death).format("hh"))
        setMinuteOfDeath(moment(res?.data?.date_of_death).format("mm"))
        setHourOfCarryingCofinOut(moment(res?.data?.date_of_carrying_the_coffin_out).format("hh"))
        setMinuteOfCarryingCofinOut(moment(res?.data?.date_of_carrying_the_coffin_out).format("mm"))
        setImgSrc(res?.data?.image)
        if (res?.data?.registerer.length > 0) {
          setRegisterer(res?.data?.registerer)
        } else {
          setRegisterer([
            {
              name: "",
              relationship: "",
              relationship_name: ""
            },
          ])
        }

        if (res?.data?.inviteFamilyMembers.length > 0) {
          setInviteFamilyMembers(res?.data?.inviteFamilyMembers)
        } else {
          setInviteFamilyMembers([
            {
              name: "",
              email: "",
              relationship: "",
              relationship_name: ""
            },
          ])
        }

        if (res?.data?.moneyAccount.length > 0) {
          setMoneyAccount(res?.data?.moneyAccount)
        } else {
          setMoneyAccount([
            {
              name: "",
              bank_name: "",
              ac_number: "",
            },
          ])
        }
        setImgSrcName(((res?.data?.image).split('/')[(res?.data?.image).split('/').length - 1]).split('?')[0] ?? "")
        if (res?.data?.donationSerives.length > 0) {
          setDonationSerives(res?.data?.donationSerives.map((data: any) => {
            setOldDonationOrg(data?.recipient_organization)
            setOldDonationField(data?.donation_field)
            return {
              donation_field: data?.donation_field,
              bank_name: data?.bank_name,
              recipient_organization: data?.recipient_organization,
              ac_number: data?.ac_number,
              Introduction: data?.Introduction,
              service_duration: data?.service_duration,
            }

          }))
        } else {
          setDonationSerives([
            {
              donation_field: "",
              bank_name: "",
              recipient_organization: "",
              ac_number: "",
              Introduction: "",
              service_duration: "",
            },
          ])
        }

        if (res?.data?.is_condolences) {
          setmemorialMoneyAccountGuideSerives(true)
        } else {
          setmemorialMoneyAccountGuideSerives(false)
        }
        if (res?.data?.is_donation) {
          setDonationMoneyService(true)
        } else {
          setDonationMoneyService(false)
        }

      });
    }

    setKoreanBank(KoreanBank)
    setDonationField(donationFieldData)

  }, [])

  useEffect(() => {
    if (donationSerives[0]?.donation_field && donationSerives[0]?.recipient_organization) {

      let DonationIntroduction = ""

      if (hallID) {
        DonationIntroduction = `${donationSerives[0]?.Introduction}`.replace(oldDonationField, `${donationSerives[0]?.donation_field}`).replace(oldDonationOrg, `${donationSerives[0]?.recipient_organization}`)
      } else {
        DonationIntroduction = `고인은 생전 ${donationSerives[0]?.donation_field} 에 대한 관심과 애정으로 평소 정성스런 마음과 물질을 나누셨습니다.\n유족들은 고인의 유지를 잇기 위해 ${donationSerives[0]?.recipient_organization} 기부단체에 계속 지원하기로 하였습니다. \n`
      }


      const val = donationSerives[0]
      const newVal = {
        ...val,
        Introduction: DonationIntroduction
      }
      setDonationSerives([newVal])
      if (hallID) {
        setOldDonationOrg(donationSerives[0]?.recipient_organization)
        setOldDonationField(donationSerives[0]?.donation_field)
      }
    }
  }, [donationSerives[0]?.donation_field, donationSerives[0]?.recipient_organization])

  useEffect(() => {
    if (!selectedFile) {
      return;
    }
    setImgSrcName(selectedFile?.name)
    const objectUrl = URL.createObjectURL(selectedFile);
    setImgSrc(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const closeSuggestions = () => {
    setPage(1);
    setAddressSuggestion(!addressSuggestion)
  }

  const selectAddress = (item: any) => {
    setSelectedAddressID(item.id)
    setHallRegData({
      ...hallRegData,
      funeral_Address: item.address
    })
    setAddressSuggestion(false)
  }

  const backMemorailHall = () => {
    history.push('/memorialhallstatus')
  }

  const customStyles = {
    option: (provided: any, state: { isSelected: any; }) => ({
      ...provided,
      borderBottom: '1px solid #CACACA',
      color: '#010100',
      paddingTop: 30,
      paddingBottom: 30,
      paddingLeft: 0,
      paddingRight: 0,
      marginLeft: 30,
      marginRight: 30,
      maxWidth: 601,
      width: 'auto',
      fontSize: 16,
      cursor: 'pointer',

    }),
    menuList: () => ({
      border: '1px solid #CACACA',
      borderRadius: 6,
      backgroundColor: '#fff',
      boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)',
      paddingTop: 20,
      paddingBottom: 20,
      maxHeight: 200,
      height: '100%',
      overflow: 'auto',
    }),

  }

  const customStylesmall = {
    option: (provided: any, state: { isSelected: any; }) => ({
      ...provided,
      borderBottom: '1px solid #CACACA',
      color: '#010100',
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 0,
      paddingRight: 0,
      marginLeft: 30,
      marginRight: 30,
      maxWidth: 601,
      width: 'auto',
      fontSize: 16,
      cursor: 'pointer',

    }),
    menuList: () => ({
      border: '1px solid #CACACA',
      borderRadius: 6,
      backgroundColor: '#fff',
      boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)',
      paddingTop: 20,
      paddingBottom: 20,
      maxHeight: 200,
      height: '100%',
      overflow: 'auto',
      zIndex: 111
    }),

  }

  const lastTourListRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    getFuneralAddress("")
  }, [page, location]);

  useEffect(() => {
    setPage(1);
  }, [location])

  useEffect(() => {
    if (dateOfDeath) {
      let we = moment(dateOfDeath).add(3, 'd').format('YYYY/MM/DD HH:mm:ss')
      setDateOfCarryingCofinOut(new Date(we))
    }
  }, [dateOfDeath])

  useEffect(() => {

    const date_of_death = moment(dateOfDeath, 'YYYY-MM-DD');
    const date_of_carrying_cofin_out = moment(dateOfCarryingCofinOut, 'YYYY-MM-DD');
    const dayDiff = date_of_carrying_cofin_out.diff(date_of_death, 'days');

    const values = [...donationSerives];
    if (dayDiff <= 3) {
      values[0].service_duration = "1 of 3 days"
    } else if (3 < dayDiff && dayDiff <= 7) {
      values[0].service_duration = "1 week"
    } else if (dayDiff > 7) {
      values[0].service_duration = "1 month"
    } else {
      values[0].service_duration = ""
    }

    setDonationSerives(values);

  }, [dateOfCarryingCofinOut])



  return (
    <div className="bg-gray">
      <div className="my-page login-form memorialhall-form ">
        <div className="my-page-head">
          <img src="./img/back-arrow.svg" className="d-md-none d-block page-back-arrow" onClick={backMemorailHall} alt="" />
          <h1>{t("memorial_hall_register.Register")}</h1>
        </div>
        <div className="my-account">
          <div className="">
            <div className="memorialhall-popup-head-ditail">
              <h2>{t("memorial_hall_register.pouptitle")}</h2>
            </div>
          </div>
          <div className="login-form">
            <InputField
              label={t("memorial_hall_register.Name")}
              fromrowStyleclass=""
              name="name"
              value={hallRegData.name}
              placeholder={t("memorial_hall_register.Placeholder.Enter_name")}
              type="text"
              lablestyleClass="login-label"
              InputstyleClass="login-input form-input"
              required="*"
              requiredClass="color-yellow"
              onChange={(event) => {
                handleChnageEvent(event);
              }}

            />
            {isRegisterd && formError.nameError && (
              <div className="position-relative">
                <p className="log-error">{formError.nameError}</p>
              </div>
            )}
            <label className="login-label">{t("memorial_hall_register.Date_Of_Birth")}<span className="color-yellow">*</span></label>
            <div className="position-relative  full-w-datepicker">
              <DatePicker
                className="login-input form-input"
                id="dateOfBirth"
                selected={dateOfBirth}
                onChange={(date: Date | null) => setDateOfBirth(date)}
                isClearable
                dateFormat="yyyy.MM.dd"
                placeholderText={t("memorial_hall_register.Placeholder.Date")}
                locale="ko"
                maxDate={new Date()}
              />
              <span className="color-yellow-span cursor-pointer" onClick={() => openDropDownOnIconOrTextByID('dateOfBirth')}>{t("memorial_hall_register.Select")}</span>
            </div>
            {isRegisterd && formError.dateOfBirthError && (
              <div className="position-relative">
                <p className="log-error">{formError.dateOfBirthError}</p>
              </div>
            )}
            <InputField
              label={t("memorial_hall_register.Job_Title")}
              fromrowStyleclass=""
              name="job_title"
              value={hallRegData.job_title}
              placeholder={t(
                "memorial_hall_register.Placeholder.Enter_job_title"
              )}
              type="text"
              lablestyleClass="login-label"
              InputstyleClass="login-input form-input"
              required="*"
              requiredClass="color-yellow"
              onChange={(event) => {
                handleChnageEvent(event);
              }}
            />
            {isRegisterd && formError.job_titleError && (
              <div className="position-relative">
                <p className="log-error">{formError.job_titleError}</p>
              </div>
            )}
            <div className="align-items-center ">
              <div className="profile-page-label procpass ">
                <h6 className="date-update">
                  {t("memorial_hall_register.Date_of_Death")} <span className="color-yellow">*</span>
                </h6>

              </div>

              <div className="d-flex date-note">

                <div className="position-relative  adjust-row">
                  <DatePicker
                    id="dateOfDeath"
                    selected={dateOfDeath}
                    onChange={(date: Date | null) => {
                      setDateOfDeath(date)
                    }}
                    isClearable
                    dateFormat="yyyy.MM.dd"
                    placeholderText={t("memorial_hall_register.Placeholder.Date")}
                    locale="ko"
                    maxDate={new Date()}
                  />
                  <span className="color-yellow-span cursor-pointer" onClick={() => openDropDownOnIconOrTextByID('dateOfDeath')}>{t("memorial_hall_register.Select")}</span>
                </div>

                <div className="position-relative selector-set-main  adjust-row">
                  {/* <select
                    className={hourOfDeath === "" ? 'selector-set minimal' : 'selector-set-gray minimal'}
                    id="deathHour"
                    name="user_information"
                    value={hourOfDeath}
                    onChange={(event: any) => {
                      setHourOfDeath(event.target.value);
                    }}
                  >

                    <option selected>시간</option>
                    {selecthour.map(({ value, label }) =>

                      <option className="redText" value={value} >{label}</option>
                    )}
                  </select> */}

                  <Select
                    styles={customStylesmall}
                    options={selecthour}
                    placeholder={t(
                      "memorial_hall_register.Placeholder.Hour"
                    )}
                    touchUi={true}
                    name="user_information"
                    // value={donationSerivesAccount.donation_field}
                    select={hourOfDeath}
                    value={selectOption(hourOfDeath, "hourOfDeath")}
                    onChange={(event: any) => {
                      setHourOfDeath(event.value)
                    }}
                    className="w-100"
                    theme={(theme) => ({
                      ...theme,

                      colors: {
                        ...theme.colors,
                        primary25: '#fff',
                        primary: '#fff',
                      },
                    })}
                  />


                  <div className="react-select-down"> <img src="img/arrows.png" alt="" /> </div>

                </div>

                <div className="position-relative selector-set-main  adjust-row">
                  {/* <select
                    className={minuteOfDeath === "" ? 'selector-set minimal' : 'selector-set-gray minimal'}
                    id="deathMinutes"
                    name="user_information"
                    value={minuteOfDeath}
                    onChange={(event: any) => {
                      setMinuteOfDeath(event.target.value);
                    }}
                  >

                    <option selected>분</option>
                    {selectminute.map(({ value, label }) =>

                      <option className="redText" value={value} >{label}</option>
                    )}
                  </select>
                  <div className="down-arrow"> <img src="img/arrows.png" alt="" /> </div> */}

                  <Select
                    styles={customStylesmall}
                    options={selectminute}
                    placeholder={t(
                      "memorial_hall_register.Placeholder.Minute"
                    )}
                    name="deathMinutes"
                    // value={donationSerivesAccount.donation_field}
                    select={minuteOfDeath}
                    value={selectOption(minuteOfDeath, "deathMinutes")}
                    onChange={(event: any) => {
                      setMinuteOfDeath(event.value)
                    }}
                    className="w-100"
                    theme={(theme) => ({
                      ...theme,

                      colors: {
                        ...theme.colors,
                        primary25: '#fff',
                        primary: '#fff',
                      },
                    })}
                  />


                  <div className="react-select-down"> <img src="img/arrows.png" alt="" /> </div>

                </div>

              </div>
              {isRegisterd && formError.date_of_deathError && (
                <div className="position-relative">
                  <p className="log-error">
                    {formError.date_of_deathError}
                  </p>
                </div>
              )}

            </div>
            <div className="align-items-center ">
              <div className="profile-page-label procpass ">
                <h6 className="date-update">
                  {t("memorial_hall_register.Date_of_carrying_the_coffin_out")} <span className="color-yellow">*</span>
                </h6>
              </div>

              <div className="d-flex date-note">

                <div className="position-relative adjust-row">
                  <DatePicker
                    id="dateOfCarryingCofinOut"
                    selected={dateOfCarryingCofinOut}
                    onChange={(date: Date | null) => setDateOfCarryingCofinOut(date)}
                    isClearable
                    dateFormat="yyyy.MM.dd"
                    placeholderText={t("memorial_hall_register.Placeholder.Date")}
                    locale="ko"
                    minDate={new Date()}
                  />
                  <span className="color-yellow-span cursor-pointer" onClick={() => openDropDownOnIconOrTextByID('dateOfCarryingCofinOut')}>{t("memorial_hall_register.Select")}</span>
                </div>

                <div className="position-relative selector-set-main adjust-row">
                  {/* <select
                    className={hourOfCarryingCofinOut === "" ? 'selector-set minimal' : 'selector-set-gray minimal'}
                    id="carryingCofinOutHour"
                    name="user_information"
                    value={hourOfCarryingCofinOut}
                    onChange={(event: any) => {
                      setHourOfCarryingCofinOut(event.target.value);
                    }}
                  >

                    <option selected>시간</option>
                    {selecthour.map(({ value, label }) =>

                      <option className="redText" value={value} >{label}</option>
                    )}
                  </select>
                  <div className="down-arrow"> <img src="img/arrows.png" alt="" /> </div> */}

                  <Select
                    styles={customStylesmall}
                    options={selecthour}
                    placeholder={t(
                      "memorial_hall_register.Placeholder.Hour"
                    )}
                    name="user_information"
                    // value={donationSerivesAccount.donation_field}
                    select={hourOfCarryingCofinOut}
                    value={selectOption(hourOfCarryingCofinOut, "hourOfCarryingCofinOut")}
                    onChange={(event: any) => {
                      // setMinuteOfDeath(event.value)
                      setHourOfCarryingCofinOut(event.value);
                    }}
                    className="w-100"
                    theme={(theme) => ({
                      ...theme,

                      colors: {
                        ...theme.colors,
                        primary25: '#fff',
                        primary: '#fff',
                      },
                    })}
                  />


                  <div className="react-select-down"> <img src="img/arrows.png" alt="" /> </div>

                </div>

                <div className="position-relative selector-set-main adjust-row">
                  {/* <select
                    className={minuteOfCarryingCofinOut === "" ? 'selector-set minimal' : 'selector-set-gray minimal'}
                    id="carryingCofinOutMinutes"
                    name="user_information"
                    value={minuteOfCarryingCofinOut}
                    onChange={(event: any) => {
                      setMinuteOfCarryingCofinOut(event.target.value);
                    }}
                  >

                    <option selected>분</option>
                    {selectminute.map(({ value, label }) =>

                      <option className="redText" value={value} >{label}</option>
                    )}
                  </select>
                  <div className="down-arrow"> <img src="img/arrows.png" alt="" /> </div> */}

                  <Select
                    styles={customStylesmall}
                    options={selectminute}
                    placeholder={t(
                      "memorial_hall_register.Placeholder.Minute"
                    )}
                    name="user_information"
                    // value={donationSerivesAccount.donation_field}
                    select={minuteOfCarryingCofinOut}
                    value={selectOption(minuteOfCarryingCofinOut, "minuteOfCarryingCofinOut")}
                    onChange={(event: any) => {
                      setMinuteOfCarryingCofinOut(event.value)
                    }}
                    className="w-100"
                    theme={(theme) => ({
                      ...theme,

                      colors: {
                        ...theme.colors,
                        primary25: '#fff',
                        primary: '#fff',
                      },
                    })}
                  />


                  <div className="react-select-down"> <img src="img/arrows.png" alt="" /> </div>

                </div>

              </div>
              {isRegisterd &&
                formError.date_of_carrying_the_coffin_outError && (
                  <div className="position-relative">
                    <p className="log-error">
                      {formError.date_of_carrying_the_coffin_outError}
                    </p>
                  </div>
                )}

            </div>
            <div className="p-relative">
              <InputField
                label={t("memorial_hall_register.Funeral_Address")}
                fromrowStyleclass=""
                name="funeral_Address"
                value={hallRegData.funeral_Address}
                placeholder={t(
                  "memorial_hall_register.Placeholder.Search_funeral_address"
                )}
                type="text"
                lablestyleClass="login-label"
                InputstyleClass="login-input-set-Search-icon form-input-two "
                required="*"
                requiredClass="color-yellow"
                onChange={(event: any) => {
                  handleChnageEvent(event);
                  debouncedChangeHandler(event.target.value)
                }}
              />
              <Buttons
                ButtonStyle="close-btn-suggestion"
                onClick={closeSuggestions}
                children={t(
                  "memorial_hall_register.Search_Address"
                )}
              />
              <img src="./img/search-icon.svg" className="input-Search-icon" alt="" />
            </div>

            {addressSuggestion &&
              <div className="list-dropdown-address">
                {funeralList.map((item: any, index: number) =>
                  <div className="cursor-pointer" onClick={() => selectAddress(item)}
                    ref={funeralList.length === index + 1 ? lastTourListRef : null}
                    key={index}
                  >
                    {item.type_of_operation === "병원" ?
                      <div className="yellow-label">
                        병원장례식장
                      </div>
                      :
                      <div className="sky-label">
                        전문장례식장
                      </div>
                    }
                    <h4>{item.facility_name}</h4>
                    <p>{item.address}</p>
                  </div>
                )}

                {/* {AddressList.map((item:any) =>
                  <div className="cursor-pointer" onClick={() => selectAddress(item)} >
                    {item.Addressstatus === "병원장례식장" ?
                      <div className="yellow-label">
                        병원장례식장
                      </div>
                      :
                      <div className="sky-label">
                        전문장례식장
                      </div>
                    }
                    <h4>{item.Addresstitle}</h4>
                    <p>{item.Addresdetails}</p>
                  </div>
                )} */}
              </div>
            }

            <div className="p-relative">
              <NumberInput
                name="room_number"
                InputstyleClass="Enter-room-number form-input"
                value={hallRegData.room_number}
                placeholder={`${t("memorial_hall_register.Placeholder.Enter_room_number")}`}
                onChange={(event) => {
                  handleChnageEvent(event);
                }}
                maxLength={10}
              />
              <p className="room-number-person">호</p>
            </div>

            {isRegisterd && formError.room_numberError && (
              <div className="position-relative">
                <p className="log-error">{formError.room_numberError}</p>
              </div>
            )}
            <InputField
              label={t("memorial_hall_register.Burial_Plot")}
              fromrowStyleclass=""
              name="burial_plot"
              value={hallRegData.burial_plot}
              placeholder={t(
                "memorial_hall_register.Placeholder.Enter_burial_plot"
              )}
              type="text"
              lablestyleClass="login-label"
              InputstyleClass="login-input form-input"
              required="*"
              requiredClass="color-yellow"
              onChange={(event) => {
                handleChnageEvent(event);
              }}
            />
            {isRegisterd && formError.burial_plotError && (
              <div className="position-relative">
                <p className="log-error">{formError.burial_plotError}</p>
              </div>
            )}
            <div>
              <label>{t("memorial_hall_register.Image")} <span className="color-yellow">*</span></label>
              <div className="d-flex align-items-center form-input">
                <div>
                  {/* <span className={selectedFile?.name ? "" : "placeholder-color"}>{(selectedFile?.name) ? (selectedFile?.name) : `${t("memorial_hall_register.Placeholder.Image")}`}</span> */}
                  <span className={imgSrcName ? "" : "placeholder-color"}>{(imgSrcName) ? (imgSrcName) : `${t("memorial_hall_register.Placeholder.Image")}`}</span>
                </div>
                <div className="ml-auto">
                  <Buttons
                    ButtonStyle="color-yellow-btn"
                    onClick={attechImage}
                    children={t("memorial_hall_register.Attach_Image")}
                  />
                </div>
              </div>
            </div>
            <input
              id="attechImage"
              type="file"
              hidden
              src={imgSrc}
              onChange={(e: any) => {
                if (!e.target.files || e.target.files.length === 0) {
                  setSelectedFile(undefined);
                  return;
                }
                if (e.target.files[0]?.type === "image/jpeg" || e.target.files[0]?.type === "image/png") {
                  setSelectedFile(e.target.files[0]);
                }
              }}
              alt="img"
              accept="*"
              className="login-input"
            />
            {isRegisterd && formError.selectedFileError && (
              <div className="position-relative">
                <p className="log-error">
                  {formError.selectedFileError}
                </p>
              </div>
            )}
            <label className="login-label p-relative">
              {t("memorial_hall_register.Introduction")} <span className="color-yellow">*</span>
            </label>
            <Form.Control
              as="textarea"
              rows={5}
              name="Introduction"
              value={hallRegData.Introduction}
              className="memorial-textarea "

              placeholder={t(
                "memorial_hall_register.Placeholder.Enter_introduction"
              )}
              onChange={(event) => {
                handleChnageEvent(event);
              }}
            />
            {isRegisterd && formError.IntroductionError && (
              <div className="position-relative">
                <p className="log-error">{formError.IntroductionError}</p>
              </div>
            )}
            <div className="memorial-border"></div>

            {/* Registerer Information */}

            <div className="memorial-title-form p-relative">
              {t("memorial_hall_register.Registerer_Information")}
            </div>
            {registerer.map((inputField, index) => (
              <div key={index}>
                <InputField
                  label={t("memorial_hall_register.Name")}
                  fromrowStyleclass=""
                  name="name"
                  value={inputField.name}
                  placeholder={t(
                    "memorial_hall_register.Placeholder.Enter_name"
                  )}
                  required="*"
                  requiredClass="color-yellow"
                  type="text"
                  lablestyleClass="login-label"
                  InputstyleClass="login-input form-input"
                  onChange={(event) => {

                    handleInputChangeRegisterer(index, event, "name");
                  }}
                />
                {isRegisterd && formError.registerername && (
                  <div className="position-relative">
                    <p className="log-error">
                      {formError.registerername}
                    </p>
                  </div>
                )}


                <label className="login-label p-relative">
                  {t("memorial_hall_register.Relationship_to_the_deceased")} <span className="color-yellow">*</span>
                </label>
                <div className="position-relative selector-set-main-full">
                  <Select
                    styles={customStyles}
                    options={relationShipDropDown}
                    placeholder={t(
                      "memorial_hall_register.Placeholder.Select_relationship"
                    )}
                    name="relationship"
                    // value={inputField.relationship}
                    select={inputField.relationship}
                    value={selectOption(inputField.relationship, "relationship")}
                    onChange={(event) => {
                      handleInputChangeRegisterer(index, event, "relationship");
                    }}
                    className="w-100"
                    theme={(theme) => ({
                      ...theme,

                      colors: {
                        ...theme.colors,
                        primary25: '#fff',
                        primary: '#fff',
                      },
                    })}
                  />
                  {/* <select
                    className={inputField.relationship === "" ? 'selector-set w-100 minimal' : 'selector-set-gray w-100 minimal'}
                    id={`registererRelation${index}`}
                    name="relationship"
                    value={inputField.relationship}
                    onChange={(event) => {
                      handleInputChangeRegisterer(index, event, "relationship");
                    }}
                  >
                    <option selected>{t(
                      "memorial_hall_register.Placeholder.Select_relationship"
                    )}</option>
                    {relationShipDropDown.map(({ value, label }) =>

                      <option className="redText" value={value} >{label}</option>
                    )}
                  </select> */}
                  <div className="react-select-down"> <img src="img/arrows.png" alt="" /> </div>
                </div>
                {isRegisterd && formError.registererRelation && (
                  <div className="position-relative">
                    <p className="log-error">
                      {formError.registererRelation}
                    </p>
                  </div>
                )}

                {inputField.relationship === "Other" &&
                  < InputField
                    label=""
                    fromrowStyleclass=""
                    name="relationship_name"
                    value={inputField.relationship_name}
                    placeholder={t(
                      "memorial_hall_register.Placeholder.Enter_name_1"
                    )}
                    requiredClass="color-yellow"
                    type="text"
                    lablestyleClass="login-label"
                    InputstyleClass="login-input form-input"
                    onChange={(event) => {
                      handleInputChangeRegisterer(index, event, "relationship_name");
                    }}
                  />
                }

                {registerer.length > 1 && (
                  <Buttons
                    ButtonStyle="memorial-add-bttn"
                    onClick={() => {
                      handleRemoveRegistererFields(index);
                    }}
                    children={t("memorial_hall_register.Remove")}
                  />
                )}
              </div>
            ))}
            <div className="memorial-ass-btn-div d-flex">
              <Buttons
                ButtonStyle="memorial-add-bttn"
                onClick={() => {
                  handleAddRegistererFields();
                }}
                children={t("memorial_hall_register.Add")}
              />
            </div>
            <div className="memorial-border"></div>

            {/* Invite Family Members */}

            <div className="memorial-title-form p-relative">
              {t("memorial_hall_register.Invite_Family_Members")}
            </div>
            {inviteFamilyMembers.map((inviteFamilyMembersData, index) => (
              <div key={index}>
                <InputField
                  label={t("memorial_hall_register.Family_Member_Name")}
                  fromrowStyleclass=""
                  name="name"
                  value={inviteFamilyMembersData.name}
                  placeholder={t(
                    "memorial_hall_register.Placeholder.Enter_name"
                  )}
                  type="text"
                  lablestyleClass="login-label"
                  InputstyleClass="login-input form-input"
                  onChange={(event) => {
                    handleInputChangeInvitaionFamily(index, event, "name");
                  }}
                />
                <InputField
                  label={t("memorial_hall_register.Email_Address")}
                  fromrowStyleclass=""
                  name="email"
                  value={inviteFamilyMembersData.email}
                  placeholder={t(
                    "memorial_hall_register.Placeholder.Enter_email_address"
                  )}
                  type="email"
                  lablestyleClass="login-label"
                  InputstyleClass="login-input form-input"
                  onChange={(event) => {
                    handleInputChangeInvitaionFamily(index, event, "email");
                  }}
                />
                <label className="login-label p-relative">
                  {t("memorial_hall_register.Relationship_to_the_registerer")}
                </label>
                <div className="position-relative selector-set-main-full">
                  {/* <select
                    className={inviteFamilyMembersData.relationship === "" ? 'selector-set w-100 minimal' : 'selector-set-gray w-100 minimal'}
                    id={`inviteFamilyMembersRelation${index}`}
                    name="relationship"
                    value={inviteFamilyMembersData.relationship}
                    onChange={(event) => {
                      handleInputChangeInvitaionFamily(
                        index,
                        event,
                        "relationship"
                      );
                    }}
                  >

                    <option selected>{t(
                      "memorial_hall_register.Placeholder.Select_relationship"
                    )}</option>
                    {relationShipDropDown.map(({ value, label }) =>

                      <option className="redText" value={value} >{label}</option>
                    )}
                  </select>
                  <div className="down-arrow"> <img src="img/arrows.png" alt="" /> </div> */}

                  <Select
                    styles={customStyles}
                    // defaultValue={flavourOptions[2]}
                    options={relationShipDropDown}
                    name="relationship"
                    // value={moneyAccountData.bank_name}
                    select={inviteFamilyMembersData.relationship}
                    value={selectOption(inviteFamilyMembersData.relationship, "relationship")}
                    onChange={(event) => {
                      handleInputChangeInvitaionFamily(
                        index,
                        event,
                        "relationship"
                      );
                    }}
                    placeholder={t(
                      "memorial_hall_register.Placeholder.Select_relationship"
                    )}
                    className="w-100"
                    theme={(theme) => ({
                      ...theme,

                      colors: {
                        ...theme.colors,
                        primary25: '#fff',
                        primary: '#fff',
                      },
                    })}
                  />
                  <div className="react-select-down"> <img src="img/arrows.png" alt="" /> </div>

                </div>

                {inviteFamilyMembersData.relationship === "Other" &&
                  < InputField
                    label=""
                    fromrowStyleclass=""
                    name="relationship_name"
                    value={inviteFamilyMembersData.relationship_name}
                    placeholder={t(
                      "memorial_hall_register.Placeholder.Enter_name_1"
                    )}
                    requiredClass="color-yellow"
                    type="text"
                    lablestyleClass="login-label"
                    InputstyleClass="login-input form-input"
                    onChange={(event) => {
                      handleInputChangeInvitaionFamily(index, event, "relationship_name");
                    }}
                  />
                }

                {inviteFamilyMembers.length > 1 && (
                  <Buttons
                    ButtonStyle="memorial-add-bttn"
                    onClick={() => {
                      handleRemoveinviteFamilyMembersFields(index);
                    }}
                    children={t("memorial_hall_register.Remove")}
                  />
                )}
              </div>
            ))}

            <div className="memorial-ass-btn-div d-flex">
              <Buttons
                ButtonStyle="memorial-add-bttn"
                onClick={() => {
                  handleAddInvitaionFamilyFields();
                }}
                children={t("memorial_hall_register.Add")}
              />
            </div>
            <div className="memorial-border"></div>

            {/* Apply for memorial money account guide service */}

            <div className="memorial-title-form p-relative">
              {t(
                "memorial_hall_register.Apply_for_memorial_money_account_guide_service"
              )}
            </div>
            <div className="d-md-flex memorial-money-account-guide-service">
              <ul className="ul-text">
                <li>
                  {t(
                    "memorial_hall_register.Memorial_money_account_guide_service_is_displayed_for_3_days"
                  )}{" "}
                  <br />
                  {t(
                    "memorial_hall_register.go_to_duration_settings_at_the_bottom"
                  )}
                </li>
              </ul>
              <div className="set-checkbox-input-2">
                <label
                  className={
                    memorialMoneyAccountGuideSerives
                      ? "login-label-checkbox-checked"
                      : "login-label-checkbox"
                  }
                >
                  <input
                    type="checkbox"
                    checked={memorialMoneyAccountGuideSerives}
                    onChange={(e) => {
                      setmemorialMoneyAccountGuideSerives(e.target.checked);
                    }}
                    className="checkbox-input-2"
                  />
                  {/* {`${t("logIn.Stay_logged_in")}`} */}
                </label>
                {/* <InputField
                  label=""
                  fromrowStyleclass=""
                  name=""
                  checked={memorialMoneyAccountGuideSerives}
                  placeholder=""
                  type="checkbox"
                  lablestyleClass=""
                  InputstyleClass="checkbox-input-2"
                  onChange={(e: any) => {
                    setmemorialMoneyAccountGuideSerives(e.target.checked);
                  }}
                /> */}
              </div>
            </div>
            {memorialMoneyAccountGuideSerives ? (
              <>
                {moneyAccount.map((moneyAccountData, index) => (
                  <div key={index}>
                    <InputField
                      label={t("memorial_hall_register.Applicant_Name")}
                      fromrowStyleclass=""
                      name="name"
                      value={moneyAccountData.name}
                      placeholder={t(
                        "memorial_hall_register.Placeholder.Enter_applicant_name"
                      )}
                      type="text"
                      lablestyleClass="login-label"
                      InputstyleClass="login-input form-input"
                      onChange={(event) => {
                        handleInputChangeApplicant(index, event, "name");
                      }}
                    />

                    <label className="login-label p-relative">
                      {t("memorial_hall_register.Bank")}
                    </label>
                    <div className="position-relative selector-set-main-full bank-selecter">

                      <Select
                        styles={customStyles}
                        // defaultValue={flavourOptions[2]}
                        options={koreanBank}
                        name="bank_name"
                        // value={moneyAccountData.bank_name}
                        select={moneyAccountData.bank_name}
                        value={selectOption(moneyAccountData.bank_name, "bank_name")}
                        onChange={(event) => {
                          handleInputChangeApplicant(index, event, "bank_name");
                        }}
                        placeholder={t(
                          "memorial_hall_register.Placeholder.Select_bank"
                        )}
                        className="w-100"
                        theme={(theme) => ({
                          ...theme,

                          colors: {
                            ...theme.colors,
                            primary25: '#fff',
                            primary: '#fff',
                          },
                        })}
                      />
                      <div className="react-select-down"> <img src="img/arrows.png" alt="" /> </div>
                      {/* <select
                        className={moneyAccountData.bank_name === "" ? 'selector-set w-100 minimal' : 'selector-set-gray w-100 minimal'}
                        id={`moneyAccountbankName${index}`}
                        name="bank_name"
                        value={moneyAccountData.bank_name}
                        onChange={(event) => {
                          handleInputChangeApplicant(index, event, "bank_name");
                        }}
                      >
                        <option selected>{t(
                          "memorial_hall_register.Placeholder.Select_bank"
                        )}</option>
                        {koreanBank.map(({ value, label }) =>
                          <option className="redText" value={value} >{label}</option>
                        )}
                      </select>
                      <div className="down-arrow"> <img src="img/arrows.png" alt="" /> </div> */}
                    </div>
                    <InputField
                      label={t("memorial_hall_register.Account_Number")}
                      fromrowStyleclass=""
                      name="ac_number"
                      value={moneyAccountData.ac_number}
                      placeholder={t(
                        "memorial_hall_register.Placeholder.Enter_account_number"
                      )}
                      type="text"
                      lablestyleClass="login-label"
                      InputstyleClass="login-input form-input"
                      onChange={(event) => {
                        handleInputChangeApplicant(index, event, "ac_number");
                      }}
                    />

                    {moneyAccount.length > 1 && (
                      <Buttons
                        ButtonStyle="memorial-add-bttn"
                        onClick={() => {
                          handleRemoveApplicantFields(index);
                        }}
                        children={t("memorial_hall_register.Remove")}
                      />
                    )}
                  </div>
                ))}
                <div className="memorial-ass-btn-div d-flex">
                  <Buttons
                    ButtonStyle="memorial-add-bttn"
                    onClick={() => {
                      handleAddApplicantFields();
                    }}
                    children={t("memorial_hall_register.Add")}
                  />
                </div>
              </>
            ) : (
              ""
            )}

            <div className="memorial-border"></div>

            {/* Apply for Donation Money Service */}

            <div className="memorial-title-form p-relative">
              {t("memorial_hall_register.Apply_for_Donation_Money_Service")}
            </div>
            <div className="d-md-flex memorial-money-account-guide-service">
              <ul className="ul-text">
                <li>
                  {t(
                    "memorial_hall_register.Donation_money_service_is_displaed_for_3_days"
                  )}{" "}
                  <br />
                  {t(
                    "memorial_hall_register.To_extend_the_duration_go_to_duration_settings_at_the_bottom"
                  )}
                </li>
              </ul>
              <label
                className={
                  donationMoneyService
                    ? "login-label-checkbox-checked"
                    : "login-label-checkbox"
                }
              >
                <input
                  type="checkbox"
                  checked={donationMoneyService}
                  onChange={(e) => {
                    setDonationMoneyService(e.target.checked);
                  }}
                  className="checkbox-input-2"
                />
                {/* {`${t("logIn.Stay_logged_in")}`} */}
              </label>
              {/* <div className="set-checkbox-input-2">
                <InputField
                  label=""
                  fromrowStyleclass=""
                  name=""
                  value=""
                  placeholder=""
                  type="checkbox"
                  lablestyleClass=""
                  InputstyleClass="checkbox-input-2"
                  onChange={(e: any) => {
                    setDonationMoneyService(e.target.checked);
                  }}
                />
              </div> */}
            </div>
            {donationMoneyService ? (
              <>
                {donationSerives.map((donationSerivesAccount, index) => (
                  <div key={index}>
                    <label className="login-label p-relative">
                      {t("memorial_hall_register.Donation_Field")}
                    </label>
                    <div className="position-relative selector-set-main-full bank-selecter">
                      <Select
                        styles={customStyles}
                        options={donationField}
                        placeholder={t(
                          "memorial_hall_register.Placeholder.Select_donation_field"
                        )}
                        name="donation_field"
                        // value={donationSerivesAccount.donation_field}
                        select={donationSerivesAccount.donation_field}
                        value={selectOption(donationSerivesAccount.donation_field, "donation_field")}
                        onChange={(event: any) => {
                          handleChnageEventDonationSerives(
                            index,
                            event,
                            "donation_field"
                          );
                        }}
                        className="w-100"
                        theme={(theme) => ({
                          ...theme,

                          colors: {
                            ...theme.colors,
                            primary25: '#fff',
                            primary: '#fff',
                          },
                        })}
                      />
                      <div className="react-select-down"> <img src="img/arrows.png" alt="" /> </div>
                      {/* <select
                        className={donationSerivesAccount.donation_field === "" ? 'selector-set w-100 minimal' : 'selector-set-gray w-100 minimal'}
                        id={`donationSerivesDonationField${index}`}
                        name="donation_field"
                        value={donationSerivesAccount.donation_field}
                        onChange={(event: any) => {
                          handleChnageEventDonationSerives(
                            index,
                            event,
                            "donation_field"
                          );
                        }}
                      >

                        <option selected>{t(
                          "memorial_hall_register.Placeholder.Select_donation_field"
                        )}</option>
                        {donationField.map(({ value, label }) =>

                          <option className="redText" value={value} >{label}</option>
                        )}
                      </select> */}
                      <div className="down-arrow"> <img src="img/arrows.png" alt="" /> </div>
                    </div>
                    <InputField
                      label={t("memorial_hall_register.Recipient_Organization")}
                      fromrowStyleclass=""
                      name="recipient_organization"
                      value={donationSerivesAccount.recipient_organization}
                      placeholder={t(
                        "memorial_hall_register.Placeholder.Select_recipient_organization"
                      )}
                      type="text"
                      lablestyleClass="login-label"
                      InputstyleClass="login-input form-input"
                      onChange={(event) => {
                        // change_recipient_organization(index,event)
                        handleChnageEventDonationSerives(
                          index,
                          event,
                          "recipient_organization"
                        );
                      }}
                    />
                    <label className="login-label p-relative">
                      {t("memorial_hall_register.Bank")}
                    </label>
                    <div className="position-relative selector-set-main-full">
                      <Select
                        styles={customStyles}
                        options={koreanBank}
                        placeholder={t(
                          "memorial_hall_register.Placeholder.Select_bank"
                        )}
                        name="bank_name"
                        select={donationSerivesAccount.bank_name}
                        value={selectOption(donationSerivesAccount.bank_name, "bank_name")}
                        // value={donationSerivesAccount.bank_name}
                        onChange={(event: any) => {
                          handleChnageEventDonationSerives(
                            index,
                            event,
                            "bank_name"
                          );
                        }}
                        className="w-100"
                        theme={(theme) => ({
                          ...theme,

                          colors: {
                            ...theme.colors,
                            primary25: '#fff',
                            primary: '#fff',
                          },
                        })}
                      />
                      {/* <select
                        className={donationSerivesAccount.bank_name === "" ? 'selector-set w-100 minimal' : 'selector-set-gray w-100 minimal'}
                        id={`donationSerivesBankName${index}`}
                        name="bank_name"
                        value={donationSerivesAccount.bank_name}
                        onChange={(event: any) => {
                          handleChnageEventDonationSerives(
                            index,
                            event,
                            "bank_name"
                          );
                        }}
                      >

                        <option selected>{t(
                          "memorial_hall_register.Placeholder.Select_bank"
                        )}</option>
                        {koreanBank.map(({ value, label }) =>

                          <option className="redText" value={value} >{label}</option>
                        )}
                      </select> */}
                      <div className="react-select-down"> <img src="img/arrows.png" alt="" /> </div>
                    </div>
                    <InputField
                      label={t("memorial_hall_register.Account_Number")}
                      fromrowStyleclass=""
                      name="ac_number"
                      value={donationSerivesAccount.ac_number}
                      placeholder={t(
                        "memorial_hall_register.Placeholder.Enter_account_number"
                      )}
                      type="text"
                      lablestyleClass="login-label"
                      InputstyleClass="login-input form-input"
                      onChange={(event) => {
                        handleChnageEventDonationSerives(
                          index,
                          event,
                          "ac_number"
                        );
                      }}
                    />
                    <label className="login-label p-relative">
                      {t("memorial_hall_register.Introduction")}
                    </label>
                    <Form.Control
                      as="textarea"
                      rows={8}
                      name="Introduction"
                      value={`${ReactHtmlParser(donationSerivesAccount.Introduction)}`}
                      type="text"
                      className="memorial-textarea "
                      placeholder={`${ReactHtmlParser(DonationIntroductionPlaceholder)}`}
                      onChange={(event) => {
                        handleChnageEventDonationSerives(
                          index,
                          event,
                          "Introduction"
                        );
                      }}
                    />
                    <label className="login-label p-relative">
                      {t(
                        "memorial_hall_register.Memorial_&_Donation_Money_Service_Display_Duration"
                      )}
                    </label>
                    <div className="position-relative selector-set-main-full bank-selecter">
                      <Select
                        styles={customStyles}
                        options={serviceDurationDropDown}
                        placeholder={t(
                          "memorial_hall_register.Placeholder.3_days/1_week/1_month"
                        )}
                        name="service_duration"
                        // value={donationSerivesAccount.service_duration}
                        select={donationSerivesAccount.service_duration}
                        value={selectOption(donationSerivesAccount.service_duration, "service_duration")}
                        onChange={(event: any) => {
                          handleChnageEventDonationSerives(
                            index,
                            event,
                            "service_duration"
                          );
                        }}
                        className="w-100"
                        theme={(theme) => ({
                          ...theme,

                          colors: {
                            ...theme.colors,
                            primary25: '#fff',
                            primary: '#fff',
                          },
                        })}
                      />
                      {/* <select
                        className={donationSerivesAccount.service_duration === "" ? 'selector-set w-100 minimal' : 'selector-set-gray w-100 minimal'}
                        id={`donationSerivesServiceDuration${index}`}
                        name="service_duration"
                        value={donationSerivesAccount.service_duration}
                        onChange={(event: any) => {
                          handleChnageEventDonationSerives(
                            index,
                            event,
                            "service_duration"
                          );
                        }}
                      >

                        <option selected>{t(
                          "memorial_hall_register.Placeholder.3_days/1_week/1_month"
                        )}</option>
                        {serviceDurationDropDown.map(({ value, label }) =>

                          <option className="redText" value={value} >{label}</option>
                        )}
                      </select> */}
                      <div className="react-select-down"> <img src="img/arrows.png" alt="" /> </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              ""
            )}

            <Buttons
              ButtonStyle="my-page-save-btn"
              onClick={openModal}
              children={t("memorial_hall_register.Save")}
            />
          </div>
        </div>
      </div>
      {
        isSave && (
          <MemorialHallStatus
            show={isSave}
            onHide={() => {
              setIsSave(false);
            }}
            createHall={createHall}
          />
        )
      }

      {<RequiredInfo
        show={requiredInfoOpen}
        onHide={() => {
          setIsSave(false);
          setRequiredInfoOpen(false)
        }} />}
    </div>
  );
};

export default MemorialHall;
