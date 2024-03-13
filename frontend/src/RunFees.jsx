import { Container, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonChalkboard } from "@fortawesome/free-solid-svg-icons";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { faChargingStation } from "@fortawesome/free-solid-svg-icons";
import { faCarBattery } from "@fortawesome/free-solid-svg-icons";
import { faGaugeHigh } from "@fortawesome/free-solid-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faFilePen } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";

const RunFees = ({ defaultFees }) => {
  const [download, setDownload] = useState(null);
  const [file, setFile] = useState(null);
  const [typeOfFee, setTypeOfFee] = useState("");
  const [typeOfSheet, setTypeOfSheet] = useState("");
  const [group, setGroup] = useState("");

  const handleGroup = (e) => {
    setGroup(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmitFile = async (type) => {
    setTypeOfFee(type);

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const url = `https://fee-gen-4.onrender.com/runfees/${type}/${group}`;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "multipart/form-data",
        responseType: "blob",
      },
      data: formData,
    };

    try {
      const response = await axios.patch(url, formData, options);
      if (response.status !== 200) {
        // Assuming you handle error responses differently than success responses
        alert("Error occurred while processing the file");
      } else {
        // Successful response
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        setDownload(url);
      }
    } catch (error) {
      console.error("An error occurred while processing the file:", error);
    }
  };

  const onUpdate = async (type) => {
    setTypeOfSheet(type);

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const url = `https://fee-gen-4.onrender.com/update/${type}`;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };

    try {
      const response = await axios.patch(url, formData, options);
      if (response.status !== 200) {
        // Assuming you handle error responses differently than success responses
        alert("Error occurred while processing the file");
      } else {
        // Successful response
        const data = await response.data;
        alert(data.message);
      }
    } catch (error) {
      console.error("An error occurred while processing the file:", error);
    }
  };

  return (
    <Container fluid className="main-body">
      <Row className="big-row">
        <Col xs={7} className="fees">
          <div className="instructions">
            <div className="with-icons">
              <h2>Instructions</h2>
              <FontAwesomeIcon
                icon={faPersonChalkboard}
                color="#e2fdaf"
                className="icons"
              />
            </div>
            <ul>
              <li>Update tenants and rents sheets every month.</li>
              <li>Ensure that all sheets are unmerged before uploading.</li>
            </ul>
          </div>
          <h3>RUN FEES</h3>
          <Row className="run-fees">
            <Col xs={3} className="child">
              <Form
                className="in-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmitFile("leasing");
                }}
              >
                <div className="with-icons">
                  <Form.Label className="label">Leasing Fee</Form.Label>
                  <FontAwesomeIcon
                    icon={faChargingStation}
                    color="#e2fdaf"
                    className="icons"
                  />
                </div>
                <Form.Select onChange={handleGroup}>
                  <option>Select Group</option>
                  <option value="A">Group A</option>
                  <option value="B">Group B</option>
                </Form.Select>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
                <div className="buttons">
                  <Button type="submit">Run</Button>
                  {download && typeOfFee === "leasing" && (
                    <a href={download}>
                      <Button>
                        Download
                        <FontAwesomeIcon
                          icon={faDownload}
                          color="#ffffff"
                          className="icons"
                        />
                      </Button>
                    </a>
                  )}
                </div>
              </Form>
            </Col>
            <Col xs={3} className="child">
              <Form
                className="in-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmitFile("retention");
                }}
              >
                <div className="with-icons">
                  <Form.Label className="label">Retention Fee</Form.Label>
                  <FontAwesomeIcon
                    icon={faCarBattery}
                    color="#e2fdaf"
                    className="icons"
                  />
                </div>
                <Form.Select onChange={handleGroup}>
                  <option>Select Group</option>
                  <option value="A">Group A</option>
                  <option value="B">Group B</option>
                </Form.Select>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
                <div className="buttons">
                  <Button type="submit">Run</Button>
                  {download && typeOfFee === "retention" && (
                    <a href={download}>
                      <Button>
                        Download
                        <FontAwesomeIcon
                          icon={faDownload}
                          color="#ffffff"
                          className="icons"
                        />
                      </Button>
                    </a>
                  )}
                </div>
              </Form>
            </Col>
            <Col xs={3} className="child">
              <Form
                className="in-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmitFile("transaction");
                }}
              >
                <div className="with-icons">
                  <Form.Label className="label">Transaction Fee</Form.Label>
                  <FontAwesomeIcon
                    icon={faGaugeHigh}
                    color="#e2fdaf"
                    className="icons"
                  />
                </div>
                <Form.Select onChange={handleGroup}>
                  <option>Select Group</option>
                  <option value="A">Group A</option>
                  <option value="B">Group B</option>
                </Form.Select>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
                <div className="buttons">
                  <Button type="submit">Run</Button>
                  {download && typeOfFee === "transaction" && (
                    <a href={download}>
                      <Button>
                        Download
                        <FontAwesomeIcon
                          icon={faDownload}
                          color="#ffffff"
                          className="icons"
                        />
                      </Button>
                    </a>
                  )}
                </div>
              </Form>
            </Col>
          </Row>
        </Col>
        <Col className="documents">
          <div className="my-documents">
            <div className="with-icons">
              <h2>My Documents</h2>
              <FontAwesomeIcon
                icon={faFolder}
                color="#e2fdaf"
                className="icons"
              />
            </div>
            <div className="schedules-sheets">
              <ul className="schedules">
                <li>{defaultFees.tenantsRents}</li>
                <li>{defaultFees.LARS}</li>
                <li>{defaultFees.transSchedule}</li>
              </ul>
              <ul className="sheets">
                <li>{defaultFees.leasingFee}</li>
                <li>{defaultFees.retentionFee}</li>
                <li>{defaultFees.transFee}</li>
              </ul>
            </div>
          </div>
          <div className="dividing-line"></div>
          <div className="update-schedules">
            <div className="with-icons">
              <h2>Update Schedules</h2>
              <FontAwesomeIcon
                icon={faFilePen}
                color="#e2fdaf"
                className="icons"
              />
            </div>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdate("rent");
              }}
            >
              <Form.Label className="label">
                Update Tenants' Rents schedule
              </Form.Label>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>
              <Button type="submit">Upload</Button>
            </Form>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdate("LARS");
              }}
            >
              <Form.Label className="label">
                Update Leasing and Rention Schedule
              </Form.Label>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>
              <Button type="submit">Upload</Button>
            </Form>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdate("trans");
              }}
            >
              <Form.Label className="label">
                Update Transaction Fee Schedule
              </Form.Label>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>
              <Button type="submit">Upload</Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RunFees;
