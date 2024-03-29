import { AdminLayout } from "../../../layout";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import Link from "next/link";
import sortBy from 'sort-by';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEye } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { getAllPages, getPagesByUid } from "../../../config/FirebaseFirestore";
import { useRouter } from "next/router";
import ClickToCopy from "../../../utils/click-to-copy";
import { LINKSHARE_DOMAIN } from "../../../config/constants";
import Skeleton from "react-loading-skeleton";

export default function AllPagesList(props) {
  const router = useRouter();
  const [pagesData, setPagesData] = useState([]);
  const [pagesLoading, setPagesLoading] = useState(true)

  const getPage = async () => {
    const pages = await getAllPages(true);
    setPagesData(pages);
    setPagesLoading(false)
  };

  pagesData.sort(sortBy('createdAt'));
  pagesData.sort(sortBy('name'));

  useEffect(() => {
    getPage();
  }, [router.isReady]);

  return (
    <AdminLayout>
      <Link href="/admin/all-pages/add">
        <Button variant={"dark"} className="mb-3">
          Add Page
        </Button>
      </Link>
      {/* <div className="d-flex text-white">
                  <div>{pagesData?.email}</div>
                  <div>{pagesData?.username}</div>
                </div> */}
      <Card className="mb-3">
        <Card.Body>
          <Row className="justify-content-end">
            <Col sm={12} md={4} lg={3}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="text" placeholder="Search" />
              </Form.Group>
            </Col>
          </Row>
          <Table responsive bordered hover striped>

            <thead className="bg-light">
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Name Pages</th>
                <th>Link Pages</th>
                <th>Views</th>
                <th>Created Date</th>
                <th>Banned</th>
                <th style={{ width: "10px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
            {pagesLoading && (
              <>
                <tr>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                </tr>
                <tr>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                </tr>
                <tr>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                </tr>
                <tr>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                </tr>
              </>
            )}
              {pagesLoading !== true && pagesData.map((item, key) => (
                <tr key={key}>
                  <td>
                    {item.profile?.username ?? '-'}
                  </td>
                  <td>
                    {item.profile?.email ?? '-'}
                  </td>
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
                  <td>{item?.totalView ?? 0}</td>
                  <td>{item?.createdAt}</td>
                  <td>{item?.status === "active" ? "Off" : "On"}</td>
                  <td>
                    <Link href={`/admin/all-pages/${item.uid}/${item.url}`}>
                      <Button variant="link" color="secondary">
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/*<ReactPaginate*/}
          {/*  forcePage={pageIndex}*/}
          {/*  pageCount={lastPage}*/}
          {/*  marginPagesDisplayed={1}*/}
          {/*  pageRangeDisplayed={3}*/}
          {/*  containerClassName="pagination mb-0"*/}
          {/*  previousClassName="page-item"*/}
          {/*  pageClassName="page-item"*/}
          {/*  breakClassName="page-item"*/}
          {/*  nextClassName="page-item"*/}
          {/*  previousLinkClassName="page-link"*/}
          {/*  pageLinkClassName="page-link"*/}
          {/*  breakLinkClassName="page-link"*/}
          {/*  nextLinkClassName="page-link"*/}
          {/*  previousLabel="‹"*/}
          {/*  nextLabel="›"*/}
          {/*  activeClassName="active"*/}
          {/*  disabledClassName="disabled"*/}
          {/*  onPageChange={(selectedItem) => {*/}
          {/*    router.push({*/}
          {/*      pathname: router.pathname,*/}
          {/*      query: {*/}
          {/*        ...router.query,*/}
          {/*        page: selectedItem.selected + 1,*/}
          {/*      },*/}
          {/*    });*/}
          {/*  }}*/}
          {/*/>*/}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
}
