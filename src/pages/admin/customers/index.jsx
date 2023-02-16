import { AdminLayout } from "@layout";
import { useEffect, useState } from "react";
import { getAllProfile } from "../../../config/FirebaseFirestore";
import { Button, Card, Table } from "react-bootstrap";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FirebaseTimestamp } from "../../../utils/firebase-timestamp";
import {Pagination} from "../../../components/Pagination";

export default function CustomersPage() {
  const [profileData, setProfileData] = useState([]);
  const [paginateMeta, setPaginateMeta] = useState({});

  const getProfile = () => {
    getAllProfile().then((items) => {
      let profile = [];
      items?.data?.forEach((item) => {
        profile.push({
          id: item.id,
          ...item.data(),
          createdAt: FirebaseTimestamp(item),
        });
      });
      setProfileData(profile);
      setPaginateMeta(items?.metadata)
    });
  };

  useEffect(() => {
    getProfile();
  }, []);

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
          <Table responsive bordered hover>
            <thead className="bg-light">
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {profileData.map((item, key) => (
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
          <Pagination meta={paginateMeta} />
        </Card.Body>
      </Card>
    </AdminLayout>
  );
}
