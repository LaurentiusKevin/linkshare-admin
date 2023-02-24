import { AdminLayout } from "@layout";
import React, { useEffect, useState } from "react";
import {
  getPagesByUid,
  getProfileByUid,
} from "../../../../config/FirebaseFirestore";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCopy, faEye } from "@fortawesome/free-solid-svg-icons";
import { LINKSHARE_DOMAIN } from "../../../../config/constants";
import ClickToCopy from "../../../../utils/click-to-copy";
import {FirebaseTimestamp} from "../../../../utils/firebase-timestamp";

export default function CustomerPageList(props) {
  const router = useRouter();
  const [pagesData, setPagesData] = useState([]);
  const [profileData, setProfileData] = useState({ email: "", name: "" });

  const getPage = async (uid) => {
    const pages = await getPagesByUid(uid);

    let listPage = [];
    pages?.forEach((item) => {
      listPage.push({
        ...item.data(),
        createdAt: FirebaseTimestamp(item),
      });
    });
    // @ts-ignore
    setPagesData(listPage);
  };

  const getCustomer = (uid) => {
    getProfileByUid(uid).then((item) => {
      setProfileData(item.data());
    });
  };

  useEffect(() => {
    if (router.query.slug !== undefined) {
      getCustomer(router.query.slug);
      getPage(router.query.slug);
    }
  }, [router.query]);

  // @ts-ignore
  return (
    <AdminLayout>
      <Link href="/admin/customers">
        <Button variant={"light"} className="mb-3">
          <FontAwesomeIcon icon={faCaretLeft} /> Back
        </Button>
      </Link>
      <div className="d-flex flex-column gap-3">
        <Row>
          <Col md={4}>
            <Card style={{ backgroundColor: "#0b434c" }}>
              <Card.Body>
                <div className="d-flex text-white">
                  <div>{profileData?.email}</div>
                  <div>{profileData?.name}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Card>
          <Card.Body>
            <Table responsive bordered hover>
              <thead className="bg-light">
                <tr>
                  <th>Name Pages</th>
                  <th>Link Pages</th>
                  <th>Views</th>
                  <th>Banned</th>
                  <th>Created Date</th>
                  <th style={{ width: "10px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pagesData.map((item, key) => (
                  <tr key={key}>
                    <td>{item?.name ?? ""}</td>
                    <td className="d-flex align-items-center gap-2">
                      <Link
                        href={LINKSHARE_DOMAIN + item?.url ?? ""}
                        style={{ color: "##0b434c" }}
                      >
                        {LINKSHARE_DOMAIN + item?.url ?? ""}
                      </Link>
                      <Button
                        variant="light"
                        onClick={() =>
                          ClickToCopy({
                            text: LINKSHARE_DOMAIN + item?.url ?? "",
                          })
                        }
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </Button>
                    </td>
                    <td>{item?.totalView ?? "0"}</td>
                    <td>
                      {item?.status === "active" || item?.status === undefined
                        ? "Off"
                        : "On"}
                    </td>
                    <td>{item?.createdAt}</td>
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
      </div>
    </AdminLayout>
  );
}
