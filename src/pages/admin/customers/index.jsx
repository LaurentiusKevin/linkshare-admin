import { AdminLayout } from "@layout";
import React, { useEffect, useState } from "react";
import { getAllProfile } from "../../../config/FirebaseFirestore";
import {Button, Card, Col, Form, InputGroup, Row, Table} from "react-bootstrap";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FirebaseTimestamp } from "../../../utils/firebase-timestamp";
import {useProfileList} from "../../../hooks/profile";
import Skeleton from "react-loading-skeleton";

export default function CustomersPage() {
  const [profileData, setProfileData] = useState([]);
  const [paginateMeta, setPaginateMeta] = useState({});
  const [dataOrder, setDataOrder] = useState({column: 'email', direction: 'asc'})
  const [payload, setPayload] = useState({
    startData: 0,
    limit: 10,
    orderDirection: 'asc',
    orderColumn: 'email'
  })

  // const getProfile = () => {
  //   getAllProfile(dataOrder).then((items) => {
  //     let profile = [];
  //     items?.forEach((item) => {
  //       profile.push({
  //         id: item.id,
  //         ...item.data(),
  //         createdAt: FirebaseTimestamp(item),
  //       });
  //     });
  //     setProfileData(profile);
  //     setPaginateMeta(items?.metadata)
  //   });
  // };

  const {
    isLoading,
    isError,
    isFetching,
    isPreviousData,
    error,
    data
  } = useProfileList(process.env.NEXT_PUBLIC_DOMAIN, payload)

  // useEffect(() => {
  //   console.log(data.data.data.profile)
  // }, [data]);

  return (
    <AdminLayout>
      <Link href="/admin/customers/add">
        <Button variant="dark" className="mb-3">
          Add Customer
        </Button>
      </Link>
      <Card>
        <Card.Header>Customer List</Card.Header>
        <Card.Body>
          <Row className="justify-content-end mb-3">
            <Col sm={12} md={3} lg={2}>
              <Form.Group className="mb-3">
                <Form.Label>Order by</Form.Label>
                <Form.Select
                  onChange={e => {
                    setDataOrder(prevState => ({
                      ...prevState,
                      column: e.target.value
                    }))
                  }}
                >
                  <option value="email">Email</option>
                  <option value="username">Username</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col sm={12} md={3} lg={2}>
              <Form.Group className="mb-3">
                <Form.Label>Direction</Form.Label>
                <Form.Select
                  onChange={e => {
                    setDataOrder(prevState => ({
                      ...prevState,
                      direction: e.target.value
                    }))
                  }}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Table responsive bordered hover>
            <thead className="bg-light">
              <tr>
                <th className={dataOrder?.column === 'email' && 'text-warning'}>Email</th>
                <th className={dataOrder?.column === 'username' && 'text-warning'}>Username</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {isLoading ? (
              <>
                <tr>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                </tr>
              </>
            ) : data.data.data.profile.map((item, key) => (
              <tr key={key}>
                <td>{item.email ?? ""}</td>
                <td>{item.username ?? ""}</td>
                <td>{item.phoneNumber ?? ""}</td>
                <td>{item.address ?? ""}</td>
                <td>{item.createdAt ?? ""}</td>
                <td>{item.status ?? "active"}</td>
                <td>
                  <Link href={`/admin/customers/${item.id}`}>
                    <Button variant="link" color="secondary">
                      <FontAwesomeIcon icon={faEye} />
                    </Button>
                  </Link>
                  <Link href={`/admin/customers/${item.id}/edit`}>
                    <Button variant="link" color="secondary">
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-end gap-2">
            <Button
              disabled={payload.startData === 0}
              onClick={() => {
                setPayload({
                  ...payload,
                  startData: payload.startData - 1
                })
              }}
            >Prev</Button>
            <Button
              disabled={data?.data?.data?.metadata?.nextPage !== true}
              onClick={() => {
                setPayload({
                  ...payload,
                  startData: payload.startData + 1
                })
              }}
            >Next</Button>
          </div>
          {/*<Pagination meta={paginateMeta} />*/}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
}
