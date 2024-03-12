import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";

const DefaultFees = ({ defaultFees }) => {
  const [download, setDownload] = useState(null);
  const [file, setFile] = useState(null);
  const [typeOfFee, setTypeOfFee] = useState("");
  const [group, setGroup] = useState("");

  const handleGroup = (e) => {
    setGroup(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDownload = () => {
    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = download;
    link.setAttribute("download", "Hopeful23.xlsx"); // Set the filename for the download
    document.body.appendChild(link);

    // Trigger the click event to start the download
    link.click();

    // Cleanup
    link.parentNode.removeChild(link);
  };

  const onSubmitFile = async (type) => {
    setTypeOfFee(type);

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const url = `http://127.0.0.1:5000/runfees/${type}/${group}`;
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

  const handleTest = async () => {
    try {
      const response = await axios.get("/downloads", {
        responseType: "blob",
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }, // Important for binary data
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownload(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <Container fluid className="main">
      <Row className="instructions-current">
        <Col>
          <h3>INSTRUCTIONS</h3>
          <ul>
            <li>
              Esnure that all cells in each sheets are unmerged before uploading
            </li>
            <li>Update the tenants and Rents document each month</li>
          </ul>
        </Col>
        <Col>
          <h3>CURRENT FEES AND SCHEDULES</h3>
          <ul>
            <li>{defaultFees.tenantsRents}</li>
            <li>{defaultFees.LARS}</li>
            <li>{defaultFees.transSchedule}</li>
            <li>{defaultFees.leasingFee}</li>
            <li>{defaultFees.retentionFee}</li>
            <li>{defaultFees.transFee}</li>
          </ul>
        </Col>
      </Row>
      <Row className="run-and-update">
        <Col className="fees">
          <h3>RUN FEES</h3>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitFile("leasing");
            }}
          >
            <Form.Label>Leasing Fee</Form.Label>
            <Form.Select
              aria-label="Default select example"
              onChange={handleGroup}
              value={group}
            >
              <option>Select Group</option>
              <option value="A">Group A</option>
              <option value="B">Group B</option>
            </Form.Select>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button type="submit">Run</Button>
          </Form>
          {download && typeOfFee === "leasing" && (
            <a href={download}>Click here to download</a>
          )}
          {/* <Button onClick={upload}>Test 1</Button>
          <Button onClick={see}>Test 2</Button> */}
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitFile("retention");
            }}
          >
            <Form.Label>Retention Fee</Form.Label>
            <Form.Select
              aria-label="Default select example"
              onChange={handleGroup}
              value={group}
            >
              <option>Select Group</option>
              <option value="A">Group A</option>
              <option value="B">Group B</option>
            </Form.Select>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button type="submit">Run</Button>
          </Form>
          {download && typeOfFee === "retention" && (
            <a href={download}>Click here to download</a>
          )}
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitFile("transaction");
            }}
          >
            <Form.Label>Transaction Fee</Form.Label>
            <Form.Select
              aria-label="Default select example"
              onChange={handleGroup}
              value={group}
            >
              <option>Select Group</option>
              <option value="A">Group A</option>
              <option value="B">Group B</option>
            </Form.Select>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button type="submit">Run</Button>
          </Form>
          {download && typeOfFee === "transaction" && (
            <a href={download}>Click here to download</a>
          )}
        </Col>
        {/* UPDATING DEFAULT SCHEDULES */}
        <Col className="fees">
          <h3>UPDATES SCHEDULES</h3>
          <Form>
            <Form.Label>Upload Tenants' Rents schedule</Form.Label>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control type="file" />
            </Form.Group>
            <Button type="submit">Update</Button>
          </Form>
          <Form>
            <Form.Label>Upload Leasing and Rention Fees Schedule</Form.Label>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control type="file" />
            </Form.Group>
            <Button type="submit">Update</Button>
          </Form>
          <Form>
            <Form.Label>Upload Transaction Fee Schedule</Form.Label>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control type="file" />
            </Form.Group>
            <Button type="submit">Update</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default DefaultFees;
