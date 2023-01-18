import type { NextPage } from "next";
import { AdminLayout } from "@layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { Button, ButtonGroup, Card, Col, Row } from "react-bootstrap";
import { Bar, Line } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import React from "react";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler
);

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const Home: NextPage = () => (
  <AdminLayout>
    <Row>
      <Col sm={12}>
        <Card
          className="mb-4 text-white"
          style={{ backgroundColor: "#0b434c" }}
        >
          <Card.Body>
            <div className="d-flex justify-content-center">
              <div className="text-center">
                <div>Total Customer</div>
                <h4>100</h4>
              </div>
            </div>
            <Row className="text-dark justify-content-center">
              <Col sm={12} md={3} lg={2}>
                <Card>
                  <Card.Body>
                    <div>This Day</div>
                    <h3>
                      100
                      <FontAwesomeIcon
                        icon={faArrowUp}
                        className="text-success"
                        size="sm"
                      />
                    </h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={12} md={3} lg={2}>
                <Card>
                  <Card.Body>
                    <div>This Week</div>
                    <h3>
                      100
                      <FontAwesomeIcon
                        icon={faArrowDown}
                        className="text-danger"
                        size="sm"
                      />
                    </h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={12} md={3} lg={2}>
                <Card>
                  <Card.Body>
                    <div>This Month</div>
                    <h3>
                      100
                      <FontAwesomeIcon
                        icon={faArrowDown}
                        className="text-danger"
                        size="sm"
                      />
                    </h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>

    <Row className="justify-content-center mb-4">
      <Col sm={4}>
        <Card style={{ backgroundColor: "#188194" }}>
          <Card.Body className="text-center text-white">
            <div>Total Pages Link</div>
            <h4>100</h4>
          </Card.Body>
        </Card>
      </Col>
    </Row>

    <Row>
      <Col sm={12} md={6}>
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between">
              <div>
                <h4 className="mb-0">Traffic</h4>
                <div className="small text-black-50">January - July 2021</div>
              </div>
              <div className="d-none d-md-block">
                <ButtonGroup aria-label="Toolbar with buttons" className="mx-3">
                  <input
                    className="btn-check"
                    id="option1"
                    type="radio"
                    name="options"
                    autoComplete="off"
                  />
                  <label
                    className="btn btn-outline-secondary"
                    htmlFor="option1"
                  >
                    Day
                  </label>
                  <input
                    className="btn-check"
                    id="option2"
                    type="radio"
                    name="options"
                    autoComplete="off"
                    defaultChecked
                  />
                  <label
                    className="btn btn-outline-secondary active"
                    htmlFor="option2"
                  >
                    Month
                  </label>
                  <input
                    className="btn-check"
                    id="option3"
                    type="radio"
                    name="options"
                    autoComplete="off"
                  />
                  <label
                    className="btn btn-outline-secondary"
                    htmlFor="option3"
                  >
                    Year
                  </label>
                </ButtonGroup>
                <Button variant="primary">
                  <FontAwesomeIcon icon={faDownload} fixedWidth />
                </Button>
              </div>
            </div>
            <div
              style={{
                height: "300px",
                marginTop: "40px",
              }}
            >
              <Line
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                  ],
                  datasets: [
                    {
                      label: "My First dataset",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      borderColor: "rgba(13, 202, 240, 1)",
                      pointHoverBackgroundColor: "#fff",
                      borderWidth: 2,
                      data: [
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                      ],
                      fill: true,
                    },
                    {
                      label: "My Second dataset",
                      borderColor: "rgba(25, 135, 84, 1)",
                      pointHoverBackgroundColor: "#fff",
                      borderWidth: 2,
                      data: [
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                      ],
                    },
                    {
                      label: "My Third dataset",
                      borderColor: "rgba(220, 53, 69, 1)",
                      pointHoverBackgroundColor: "#fff",
                      borderWidth: 1,
                      borderDash: [8, 5],
                      data: [65, 65, 65, 65, 65, 65, 65],
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                    y: {
                      beginAtZero: true,
                      max: 250,
                      ticks: {
                        maxTicksLimit: 5,
                        stepSize: Math.ceil(250 / 5),
                      },
                    },
                  },
                  elements: {
                    line: {
                      tension: 0.4,
                    },
                    point: {
                      radius: 0,
                      hitRadius: 10,
                      hoverRadius: 4,
                      hoverBorderWidth: 3,
                    },
                  },
                }}
              />
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={12} md={6}>
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between">
              <div>
                <h4 className="mb-0">Traffic</h4>
                <div className="small text-black-50">January - July 2021</div>
              </div>
              <div className="d-none d-md-block">
                <ButtonGroup aria-label="Toolbar with buttons" className="mx-3">
                  <input
                    className="btn-check"
                    id="option1"
                    type="radio"
                    name="options"
                    autoComplete="off"
                  />
                  <label
                    className="btn btn-outline-secondary"
                    htmlFor="option1"
                  >
                    Day
                  </label>
                  <input
                    className="btn-check"
                    id="option2"
                    type="radio"
                    name="options"
                    autoComplete="off"
                    defaultChecked
                  />
                  <label
                    className="btn btn-outline-secondary active"
                    htmlFor="option2"
                  >
                    Month
                  </label>
                  <input
                    className="btn-check"
                    id="option3"
                    type="radio"
                    name="options"
                    autoComplete="off"
                  />
                  <label
                    className="btn btn-outline-secondary"
                    htmlFor="option3"
                  >
                    Year
                  </label>
                </ButtonGroup>
                <Button variant="primary">
                  <FontAwesomeIcon icon={faDownload} fixedWidth />
                </Button>
              </div>
            </div>
            <div
              style={{
                height: "300px",
                marginTop: "40px",
              }}
            >
              <Line
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                  ],
                  datasets: [
                    {
                      label: "My First dataset",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      borderColor: "rgba(13, 202, 240, 1)",
                      pointHoverBackgroundColor: "#fff",
                      borderWidth: 2,
                      data: [
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                      ],
                      fill: true,
                    },
                    {
                      label: "My Second dataset",
                      borderColor: "rgba(25, 135, 84, 1)",
                      pointHoverBackgroundColor: "#fff",
                      borderWidth: 2,
                      data: [
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                        random(50, 200),
                      ],
                    },
                    {
                      label: "My Third dataset",
                      borderColor: "rgba(220, 53, 69, 1)",
                      pointHoverBackgroundColor: "#fff",
                      borderWidth: 1,
                      borderDash: [8, 5],
                      data: [65, 65, 65, 65, 65, 65, 65],
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                    y: {
                      beginAtZero: true,
                      max: 250,
                      ticks: {
                        maxTicksLimit: 5,
                        stepSize: Math.ceil(250 / 5),
                      },
                    },
                  },
                  elements: {
                    line: {
                      tension: 0.4,
                    },
                    point: {
                      radius: 0,
                      hitRadius: 10,
                      hoverRadius: 4,
                      hoverBorderWidth: 3,
                    },
                  },
                }}
              />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </AdminLayout>
);

export default Home;
