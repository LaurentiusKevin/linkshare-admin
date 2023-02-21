import { AdminLayout } from "@layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { Button, ButtonGroup, Card, Col, Row, Spinner } from "react-bootstrap";
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
import React, { useEffect, useState } from "react";
import {
  getAllCustomerStatistics,
  getAllView,
  getCustomerStatistics,
  getTotalPage,
} from "../../config/FirebaseFirestore";
import moment from "moment";
import Skeleton from "react-loading-skeleton";

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

interface Statistics {
  current: number;
  previous: number;
}

interface StatisticsV2 {
  total: number;
  previous: number;
}
interface CustomerStatistics {
  totalCustomer: Statistics;
  daily: StatisticsV2;
  weekly: Statistics;
  monthly: Statistics;
}

const defaultStatisticsValue: CustomerStatistics = {
  totalCustomer: {
    current: 0,
    previous: 0,
  },
  daily: {
    total: 0,
    previous: 0,
  },
  weekly: {
    current: 0,
    previous: 0,
  },
  monthly: {
    current: 0,
    previous: 0,
  },
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState({viewHistory: true, customerHistory: true, totalPage: true, customerStatistic: true})
  const [hourlyViewLabel, setHourlyViewLabel] = useState<string[]>([]);
  const [hourlyViewData, setHourlyViewData] = useState<number[]>([]);
  const [monthlyCustomerLabel, setMonthlyCustomerLabel] = useState<string[]>(
    []
  );
  const [monthlyCustomerData, setMonthlyCustomerData] = useState<number[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [customerStatistics, setCustomerStatistics] =
    useState<CustomerStatistics>(defaultStatisticsValue);

  useEffect(() => {
    getAllView().then((response) => {
      let label: string[] = [];
      let data: number[] = [];
      response?.forEach((item) => {
        label.push(moment(item.data().timestamp.toDate()).format("MMM YYYY"));
        data.push(item.data().totalView);
      });
      setHourlyViewLabel(label.reverse());
      setHourlyViewData(data.reverse());
      setIsLoading(prevState => ({
        ...prevState,
        viewHistory: false
      }))
    });
    getAllCustomerStatistics().then((response) => {
      let title: string = '';
      let label: string[] = [];
      let data: number[] = [];
      response?.forEach((item) => {
        label.push(moment(item.data().timestamp.toDate()).format("MMM YYYY"));
        data.push(item.data().totalCustomer);
      });
      setMonthlyCustomerLabel(label.reverse());
      setMonthlyCustomerData(data.reverse());
      setIsLoading(prevState => ({
        ...prevState,
        customerHistory: false
      }))
    });
    getTotalPage().then((response: React.SetStateAction<number>) => {
      setTotalPage(response);
      setIsLoading(prevState => ({
        ...prevState,
        totalPage: false
      }))
    });
    getCustomerStatistics().then((response: any) => {
      setCustomerStatistics(response);
      setIsLoading(prevState => ({
        ...prevState,
        customerStatistic: false
      }))
    });
  }, []);
  return (
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
                  {isLoading.customerStatistic ? (
                    <Spinner animation="border" role="status" className="mt-1">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : <h4>{customerStatistics.totalCustomer.current}</h4>}
                </div>
              </div>
              <Row className="text-dark justify-content-center">
                <Col sm={12} md={3} lg={2}>
                  <Card>
                    <Card.Body>
                      <div>This Day</div>
                      {isLoading.customerStatistic ? (
                        <Spinner animation="border" role="status" className="mt-1">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      ) : (
                        <h3>
                          {customerStatistics.daily?.total ?? 0}
                          <IconStatistics
                            current={customerStatistics.daily?.total ?? 0}
                            previous={customerStatistics.daily?.previous}
                          />
                        </h3>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={12} md={3} lg={2}>
                  <Card>
                    <Card.Body>
                      <div>This Week</div>
                      {isLoading.customerStatistic ? (
                        <Spinner animation="border" role="status" className="mt-1">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      ) : (
                        <h3>
                          {customerStatistics.weekly.current}
                          <IconStatistics
                            current={customerStatistics.weekly.current}
                            previous={customerStatistics.weekly.previous}
                          />
                        </h3>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={12} md={3} lg={2}>
                  <Card>
                    <Card.Body>
                      <div>This Month</div>
                      {isLoading.customerStatistic ? (
                        <Spinner animation="border" role="status" className="mt-1">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      ) : (
                        <h3>
                          {customerStatistics.monthly.current}
                          <IconStatistics
                            current={customerStatistics.monthly.current}
                            previous={customerStatistics.monthly.previous}
                          />
                        </h3>
                      )}
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
              {isLoading.viewHistory ? (
                <Spinner animation="border" role="status" className="mt-1">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : <h4>{totalPage}</h4>}
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
                  <h4 className="mb-0">View Page Update Activity</h4>
                  {isLoading.viewHistory ? <Skeleton /> : (
                    <div className="small text-black-50">
                      {hourlyViewLabel[0]} - {hourlyViewLabel.slice(-1)}
                    </div>
                  )}
                </div>
              </div>
              {isLoading.viewHistory ? <Skeleton height={300} /> : (
                <div
                  style={{
                    height: "300px",
                    marginTop: "40px",
                  }}
                >
                  <Line
                    data={{
                      labels: hourlyViewLabel,
                      datasets: [
                        {
                          label: "Hourly View",
                          borderColor: "rgba(25, 135, 84, 1)",
                          pointHoverBackgroundColor: "#fff",
                          borderWidth: 2,
                          data: hourlyViewData,
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
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={6}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">Customer Update Activity</h4>
                  {isLoading.customerHistory ? <Skeleton /> : (
                    <div className="small text-black-50">{monthlyCustomerLabel[0]} - {monthlyCustomerLabel.slice(-1)}
                    </div>
                  )}
                </div>
              </div>
              {isLoading.customerHistory ? <Skeleton height={300} /> : (<div
                  style={{
                    height: "300px",
                    marginTop: "40px",
                  }}
                >
                  <Line
                    data={{
                      labels: monthlyCustomerLabel,
                      datasets: [
                        {
                          borderColor: "rgba(25, 135, 84, 1)",
                          pointHoverBackgroundColor: "#fff",
                          borderWidth: 2,
                          data: monthlyCustomerData,
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
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
}

interface IconStatisticsInterface {
  current: number;
  previous: number;
}
function IconStatistics(props: IconStatisticsInterface) {
  const { current, previous } = props;

  return (
    <>
      {current > previous && (
        <FontAwesomeIcon icon={faArrowUp} className="text-success" size="sm" />
      )}
      {current < previous && (
        <FontAwesomeIcon icon={faArrowDown} className="text-danger" size="sm" />
      )}
    </>
  );
}
