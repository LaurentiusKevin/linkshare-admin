import { AdminLayout } from "../../../layout";
import { Button, Card, Table } from "react-bootstrap";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faEye } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import React, { useEffect, useState } from "react";
import { getAllPages, getPagesByUid } from "../../../config/FirebaseFirestore";
import { useRouter } from "next/router";

export default function AllPagesList() {
  const router = useRouter();
  const [pagesData, setPagesData] = useState([]);

  const getPage = async () => {
    const pages = await getAllPages();

    let listPage = [];
    pages?.forEach((item) => {
      listPage.push(item.data());
    });
    // @ts-ignore
    setPagesData(listPage);
  };

  useEffect(() => {
    if (router.isReady) {
      getPage();
    }
  }, [router.isReady]);

  return (
    <AdminLayout>
      <Link href="/admin/all-pages/add">
        <Button variant={"dark"} className="mb-3">
          Add Page
        </Button>
      </Link>
      <Card className="mb-5">
        <Card.Header>Page List</Card.Header>
        <Card.Body>
          <Table responsive bordered hover>
            <thead className="bg-light">
              <tr>
                <th>Name Pages</th>
                <th>Link Pages</th>
                <th>Views</th>
                <th>Status</th>
                <th style={{ width: "10px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pagesData.map((item, key) => (
                <tr key={key}>
                  <td>{item?.name ?? ""}</td>
                  <td>
                    <Link
                      href={window.location.host + "/" + item?.url ?? ""}
                      style={{ color: "##0b434c" }}
                    >
                      {window.location.host + "/" + item?.url ?? ""}
                    </Link>
                  </td>
                  <td></td>
                  <td></td>
                  <td>
                    <Link href={`/admin/customers/${item.uid}/${item.url}`}>
                      <Button variant="link" color="secondary">
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </AdminLayout>
  );
}
