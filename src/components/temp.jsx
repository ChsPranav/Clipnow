import {
  MDBInput,
  MDBBtn,
  MDBCol,
  MDBRow,
  MDBContainer,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { useState, React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDatabase,
  ref,
  set,
  child,
  onValue,
  remove,
} from "firebase/database";
import "./temp.css";
function Temp() {
  const [clipid, setClipid] = useState("");
  const [message, setMessage] = useState("");
  const [tempidexist, setTempidexist] = useState(false);
  const [status, setStatus] = useState("");

  const [clipurl, setClipurl] = useState("");
  const [disperr, setDisperr] = useState(false);
  const navigate = useNavigate();

  const setmessage = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    //get id from the url using props
    const url = window.location.href;
    const id = url.substring(url.lastIndexOf("/") + 1);
    setClipid(id);
    setClipurl(window.location.href);
    const db = getDatabase();
    onValue(ref(db, "/Tempusers/" + id), async (snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        await setClipid(snapshot.val().clipid);
        await setMessage(snapshot.val().message);
        setTimeout(async () => {
          setTempidexist(true);
          // if(clipid!=='' && message!=='') {
          //     await setStatus(snapshot.val().status);
          //     await setTempidexist(true);
          // } else {
          //     console.log('error');
          //     // setClipid(snapshot.val().clipid);
          //     // setMessage(snapshot.val().message);
          //     // setStatus(snapshot.val().status);
          //     // setTempidexist(true);
          // }
          if (status === "deleted") {
            setMessage("");
            await remove(ref(db, "/Tempusers/" + id));
            setTempidexist(false);
            Window.location.href = "/";
          }
        }, 5000);
      } else {
        // refresh page
        // alert('Sorry, this clip is not available anymore');
        // window.location.href = '/';
      }
    });
  }, [status, clipurl]);

  const createClipart = (e) => {
    e.preventDefault();
    //upload the id and message to realtime database
    const dbRef = ref(getDatabase());
    if (clipid !== "") {
      set(child(dbRef, `Tempusers/${clipid}`), {
        clipid: clipid,
        message: message,
        status: "created",
        time: new Date().toLocaleString(),
      });
      //   alert("Your clipart has been created");
      // if (message !== "") {
      setClipurl(window.location.href);
      // }
    } else {
      alert("Please enter your clipid");
      const url = window.location.href;
      const id = url.substring(url.lastIndexOf("/") + 1);
      setClipid(id);
    }
  };

  const deleteClipart = (e) => {
    e.preventDefault();
    const dbRef = ref(getDatabase());
    if (clipid !== "") {
      set(child(dbRef, `Tempusers/${clipid}`), {
        clipid: clipid,
        message: "",
        status: "deleted",
        time: new Date().toLocaleString(),
      });
      //   alert("Your clipart has been deleted");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } else {
      alert("Please enter your clipid");
      const url = window.location.href;
      const id = url.substring(url.lastIndexOf("/") + 1);
      setClipid(id);
    }
  };

  const displayError = (e) => {
    e.preventDefault();
    setDisperr(true);
  };

  return (
    <div className="container mt-4">
      <h4 className="text_center">
        <Link to="/">CLIPNOW</Link>
      </h4>
      <h5 className="text_center">Here's your clip ready! Create it.</h5>
      <div>
        <MDBRow className="d-flex justify-content-center mt-5">
          <MDBCol md="6">
            <MDBInput
              id="clipid"
              wrapperClass={disperr ? "mb-0" : "mb-4"}
              label="Your CLIP-ID"
              value={clipid}
              onDoubleClick={displayError}
              readonly
            />
            {disperr && (
              <MDBContainer className="disperr mb-4 text-start fst-italic">
                Clip-ID cannot be changed
              </MDBContainer>
            )}

            <MDBInput
              wrapperClass="mb-4"
              textarea
              id="message"
              rows={4}
              label="Message"
              value={message}
              onChange={setmessage}
            />
            {tempidexist ? (
              <div>
                <span>
                  {clipurl && (
                    <p className="fst-italic">
                      Share this Clip-URL to access your data:
                      <a href={clipurl} target="_blank">
                        {clipurl}
                      </a>
                    </p>
                  )}
                </span>
                <MDBBtn type="submit" className="mb-4" onClick={createClipart}>
                  Update
                </MDBBtn>
                &emsp;
                <MDBBtn type="submit" className="mb-4" onClick={deleteClipart}>
                  Delete Clipart
                </MDBBtn>
              </div>
            ) : (
              <MDBBtn type="submit" className="mb-4" onClick={createClipart}>
                Create Clip
              </MDBBtn>
            )}
          </MDBCol>
        </MDBRow>
      </div>
    </div>
  );
}

export default Temp;
