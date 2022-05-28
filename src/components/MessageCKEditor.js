import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { API } from "../config/API/api.config";
import FroalaEditor from "react-froala-wysiwyg";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AuthStorage from "../helper/AuthStorage";
import STORAGEKEY from "../config/APP/app.config";
import { UserType } from "../helper/Constant";


const MessageCKEditor = (props) => {
  const { is_loggedin } = useSelector((state) => state.login);
  const { userData } = useSelector((state) => state.userData);
  let IFRAME_SRC = '//cdn.iframe.ly/api/iframe';
  let API_KEY = '13c9bd8f21b29e738b1645';
  const { t } = useTranslation();
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [videoSize, setVideoSize] = useState(0);
  const [imageSize, setImageSize] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const getUniqeNo = AuthStorage.getStorageData(STORAGEKEY.uniqeId)
  const id = Math.random().toString(30).slice(2)
  if (!getUniqeNo) {
    AuthStorage.setStorageData(STORAGEKEY.uniqeId, id)
  }

  useEffect(() => {
    setImageSize(0);
    setVideoSize(0);
    setImage("");
    setVideo("");
  }, []);

  useEffect(() => {
    const CharAndWordCount = () => {
      const data = props.data;
      var regex = /\s+/gi;
      const strippedString = data.replace(/(<([^>]+)>)/gi, "");
      var wordCount = strippedString.trim().replace(regex, " ").split(" ").length;
      var totalChars = strippedString.length;
      setWordCount(wordCount);
      setTotalChars(totalChars);
    };

    CharAndWordCount();
  }, [props.data]);

  const handleChange = (event, editor) => {
    if (props?.type === "memorialPost") {
      props.onChange(event, image, video, imageSize, videoSize);
      props.UniqueID(AuthStorage.getStorageData(STORAGEKEY.uniqeId))
    } else {

      const data = editor.getData();

      var regex = /\s+/gi;
      const strippedString = data.replace(/(<([^>]+)>)/gi, "");
      var wordCount = strippedString
        .trim()
        .replace(regex, " ")
        .split(" ").length;
      var totalChars = strippedString.length;
      setWordCount(wordCount);
      setTotalChars(totalChars);
      props.onChange(data);
    }
  };

  return (
    <>
      {props?.type === "memorialPost" ? (
        <FroalaEditor
          tag="textarea"
          model={props.data}
          onModelChange={handleChange}
          config={{
            placeholderText: `${t("MemorialPost.Enter_text")}`,
            language: "ko",
            key: window.location.hostname === "newbizstart.iptime.org" ? "YNB3fH3A7C9A5C4D3E2C-8mardnrzB-9jB-7yA11fe1eB-11B-9qD1yeD-16eF5C4C3G3E2B2C6D6B3A1==" : window.location.hostname === "15.164.99.155" ? "8JF3bB2B6D4E4E3D2A2zH2G1B9C2B1D2F5G2F2G1H4B9B7hE5B4E4E3F2I3B8A4E5D5==" : "",
            videoResponsive: true,
            toolbarButtons: ["insertImage", "insertVideo"],
            // imageEditButtons: ['imageReplace', 'imageAlign', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageStyle', 'imageAlt', 'imageSize'],
            imageEditButtons: [
              "imageDisplay",
              "imageAlign",
              "imageInfo",
              "imageRemove",
            ],
            imageUploadURL: is_loggedin ?
              `${API.endpoint}/memorialHall/memorialHallPostImage?post_type=Album&memorial_id=${props?.hallData?.id}&user_id=${props?.userData?.id}&lang=ko`
              :
              `${API.endpoint}/memorialHall/memorialHallPostImageNon?post_type=Album&memorial_id=${props?.hallData?.id}&random_number=${AuthStorage.getStorageData(STORAGEKEY.uniqeId)}&lang=ko`,

            imageMaxSize: `${props?.userData?.MaxPicturesSize}` * 1024 * 1024,

            videoUploadURL: is_loggedin ?
              `${API.endpoint}/memorialHall/memorialHallPostImage?post_type=Video&memorial_id=${props?.hallData?.id}&user_id=${props?.userData?.id}&lang=ko`
              :
              `${API.endpoint}/memorialHall/memorialHallPostImageNon?post_type=Video&memorial_id=${props?.hallData?.id}&random_number=${AuthStorage.getStorageData(STORAGEKEY.uniqeId)}&lang=ko`,

            videoMaxSize: `${props?.userData?.MaxVideoSize}` * 1024 * 1024,

            events: {
              "video.uploaded": function (response) {

                let newResponse = JSON.parse(response);
                // Return false if you want to stop the video upload.
                setVideo(newResponse?.link);
                setVideoSize(newResponse?.file_size?.toFixed(2));
                setImageSize(0);
                setImage("");
                props.UniqueID(AuthStorage.getStorageData(STORAGEKEY.uniqeId))
              },
              "video.error": function (error, response) {

                let newResponse
                if (error.code !== 5) {
                  newResponse = JSON.parse(response);
                }


                if (newResponse?.message.includes("Memorial Post Video size maximum")) {

                  let x = document.getElementsByClassName("fr-message");
                  if (!is_loggedin) {
                    x[0].innerHTML = `${t(
                      "MemorialPost.Maximum_size_of_video_is_100MB"
                    )}`;
                  }
                  if (is_loggedin) {
                    if (userData.user_type === UserType.Standard) {
                      x[0].innerHTML = `${t(
                        "MemorialPost.Maximum_size_of_video_is_100MB"
                      )}`;
                    }
                    if (userData.user_type === UserType.Basic || userData.user_type === UserType.Premium) {
                      x[0].innerHTML = `${t(
                        "MemorialPost.Maximum_size_of_video_is_500MB"
                      )}`;
                    }
                  }
                  return
                }

                // Bad link.
                if (error.code === 1) {
                }
                // No link in upload response.
                else if (error.code === 2) {
                  if (newResponse?.message === "Memorial Post Video save Max limit execute") {
                    let x = document.getElementsByClassName("fr-message");
                    x[0].innerHTML = `${t(
                      "MemorialPost.Memorial_Post_Video_save_Max_limit_exceeds"
                    )}`;
                  }

                }
                // Error during video upload.
                else if (error.code === 3) {
                  let x = document.getElementsByClassName("fr-message");
                  x[0].innerHTML = `${t("MemorialPost.Something_Went_Wrong")}11`;
                }
                // Parsing response failed.
                else if (error.code === 4) {
                }
                // Video too text-large.
                else if (error.code === 5) {
                  let x = document.getElementsByClassName("fr-message");
                  if (!is_loggedin) {
                    x[0].innerHTML = `${t(
                      "MemorialPost.Maximum_size_of_video_is_100MB"
                    )}`;
                  }
                  if (is_loggedin) {
                    if (userData.user_type === UserType.Standard) {
                      x[0].innerHTML = `${t(
                        "MemorialPost.Maximum_size_of_video_is_100MB"
                      )}`;
                    }
                    if (userData.user_type === UserType.Basic || userData.user_type === UserType.Premium) {
                      x[0].innerHTML = `${t(
                        "MemorialPost.Maximum_size_of_video_is_500MB"
                      )}`;
                    }
                  }
                }
                // Invalid video type.
                else if (error.code === 6) {
                  let x = document.getElementsByClassName("fr-message");
                  x[0].innerHTML = `${t("MemorialPost.Invalid_video_type")}`;
                }
                // Video can be uploaded only to same domain in IE 8 and IE 9.
                else if (error.code === 7) {
                }
              },
              "image.uploaded": function (response) {
                let newResponse = JSON.parse(response);
                // Return false if you want to stop the video upload.
                setImage(newResponse?.link);
                setImageSize(newResponse?.file_size?.toFixed(2));
                setVideoSize(0);
                setVideo("");
                props.UniqueID(AuthStorage.getStorageData(STORAGEKEY.uniqeId))
              },
              "image.error": function (error, response) {
                let newResponse = JSON.parse(response);
                // Bad link.
                if (error.code === 1) {
                }
                // No link in upload response.
                else if (error.code === 2) {
                  if (
                    newResponse?.message ===
                    "Memorial Post Image save Max limit execute"
                  ) {
                    let x = document.getElementsByClassName("fr-message");
                    x[0].innerHTML = `${t(
                      "MemorialPost.Memorial_Post_Image_save_Max_limit_exceeds"
                    )}`;
                  }
                }
                // Error during image upload.
                else if (error.code === 3) {
                  let x = document.getElementsByClassName("fr-message");
                  x[0].innerHTML = `${t("MemorialPost.Something_Went_Wrong")}`;
                }
                // Parsing response failed.
                else if (error.code === 4) {
                }
                // Image too text-large.
                else if (error.code === 5) {
                  let x = document.getElementsByClassName("fr-message");
                  x[0].innerHTML = `${t(
                    "MemorialPost.Maximum_size_of_Image_is_10MB"
                  )}`;
                }
                // Invalid image type.
                else if (error.code === 6) {
                  let x = document.getElementsByClassName("fr-message");
                  x[0].innerHTML = `${t("MemorialPost.Invalid_Image_type")}`;
                }
                // Image can be uploaded only to same domain in IE 8 and IE 9.
                else if (error.code === 7) {
                }
                // Response contains the original server response to the request if available.
              },
            },
            // videoAllowedTypes: ['webm', 'jpg', 'ogg'],
          }}
        />
      ) : (
        <>
          <CKEditor
            editor={ClassicEditor}
            data={props.data}
            onChange={handleChange}

            languages={{ id: "ko", label: "korean" }}
            config={{
              language: { ui: "ko", content: "korean" },
              previewsInData: true,
              allowedContent: true,
              image: {
                toolbar: [
                  "imageStyle:inline",
                  "imageStyle:wrapText",
                  "imageStyle:breakText",
                  "|",
                  "toggleImageCaption",
                  "imageTextAlternative",
                ],
              },
              mediaEmbed: {

                // Previews are always enabled if there’s a provider for a URL (below regex catches all URLs)
                // By default `previewsInData` are disabled, but let’s set it to `false` explicitely to be sure
                previewsInData: true,

                providers: [
                  {
                    // hint: this is just for previews. Get actual HTML codes by making API calls from your CMS
                    name: 'iframely previews',

                    // Match all URLs or just the ones you need:
                    url: /.+/,

                    html: match => {
                      const url = match[0];

                      var iframeUrl = IFRAME_SRC + '?app=1 & omit_script=1&omit_css=true&api_key=' + API_KEY + '&url=' + encodeURIComponent(url);
                      // alternatively, use &key= instead of &api_key with the MD5 hash of your api_key
                      // more about it: https://iframely.com/docs/allow-origins

                      return (
                        // If you need, set maxwidth and other styles for 'iframely-embed' class - it's yours to customize
                        '<div class="iframely-embed">' +
                        '<div class="iframely-responsive">' +
                        `<iframe src="${iframeUrl}" ` +
                        'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                        '</iframe>' +
                        '</div>' +
                        '</div>'
                      );
                    }
                  }
                ]
              },
              ckfinder: {
                uploadUrl: `${API.endpoint}/memorialHall/memorialHallMessageImage?lang=ko`,
                // Enable the XMLHttpRequest.withCredentials property.
                withCredentials: true,
                // Headers sent along with the XMLHttpRequest to the upload server.
                headers: {
                  "X-CSRF-TOKEN": "CSFR-Token",
                  Authorization: "Bearer <JSON Web Token>",
                },
              },
            }}
          />
          <div className="word-counter">
            <p className="mx-2">
              {`${t("MemorialView.Words")}`}: {wordCount}
            </p>
            <p>
              {`${t("MemorialView.Characters")}`}: {totalChars}
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default MessageCKEditor;
