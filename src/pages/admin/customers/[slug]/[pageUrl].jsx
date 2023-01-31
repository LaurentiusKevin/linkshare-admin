import { AdminLayout } from "@layout";
import React, { useEffect, useState } from "react";
import { getPage, storePage } from "../../../../config/FirebaseFirestore";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LINKSHARE_DOMAIN } from "../../../../config/constants";
import ClickToCopy from "../../../../utils/click-to-copy";

const formSchema = yup.object({
  url: yup.string().required("Page Link is Required"),
  name: yup.string().required("Page Name is Required"),
  description: yup.string().required("Description is Required"),
  logoImage: yup.string().required("Logo Image is Required"),
  backgroundImage: yup.string().required("Background Image is Required"),
  status: yup.string().required("Status is Required"),
});

export default function CustomerDetailPage(props) {
  const router = useRouter();
  const [pagesDetail, setPagesDetail] = useState([]);
  const [pageLink, setPageLink] = useState([]);
  const [isLinkEdit, setIsLinkEdit] = useState(false);
  const [editLink, setEditLink] = useState({
    visible: false,
    arrayKey: undefined,
    data: {},
  });
  const [isPickIcon, setIsPickIcon] = useState(false);

  const {
    control,
    setValue,
    getValues,
    getFieldState,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const getDetailPage = async (pageUrl) => {
    const page = await getPage(pageUrl);
    setPagesDetail(page);
    setPageLink(page.link);
    setValue("url", page.url);
    setValue("name", page.name);
    setValue("description", page.description);
    setValue("logoImage", page.logoImage);
    setValue("backgroundImage", page.backgroundImage);
    setValue("status", page.status ?? "active");
  };

  // const getCustomer = (uid) => {
  //   getProfileByUid(uid).then((item) => {
  //     setProfileData(item.data());
  //   });
  // };

  const handleChangeLink = async () => {
    let currentLinks = pageLink;
    currentLinks[editLink.arrayKey] = editLink.data;
    setPageLink(currentLinks);

    setEditLink({
      visible: false,
      arrayKey: undefined,
      data: {},
    });
  };

  const handleEdit = () => {
    setIsLinkEdit(!isLinkEdit);
  };

  const handleSave = async (data) => {
    data = {
      ...data,
      link: pageLink,
    };
    await storePage(router.query.slug, data).then((response) => {
      router.push(`/admin/customers/${router.query.slug}`);
    });
  };

  useEffect(() => {
    if (router.isReady) {
      getDetailPage(router.query.pageUrl);
    }
  }, [router.isReady]);

  // @ts-ignore
  return (
    <AdminLayout>
      <div className="d-flex flex-column gap-3">
        <h4>Page Detail</h4>
        <Link href={`/admin/customers/${router.query.slug}`}>
          <Button type="button" variant="light">
            <FontAwesomeIcon icon={faCaretLeft} /> Back
          </Button>
        </Link>
        <Card className="mb-5">
          <Card.Body>
            <form onSubmit={handleSubmit(handleSave)}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column lg={2}>
                  Page URL
                </Form.Label>
                <Col sm={10}>
                  <InputGroup>
                    <InputGroup.Text id="basic-addon3">
                      {LINKSHARE_DOMAIN}
                    </InputGroup.Text>
                    <Controller
                      control={control}
                      name="url"
                      render={({ field }) => (
                        <Form.Control {...field} type="text" />
                      )}
                    />
                  </InputGroup>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column lg={2}>
                  Page Name
                </Form.Label>
                <Col sm={10}>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <Form.Control {...field} type="text" />
                    )}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column lg={2}>
                  Descriptions
                </Form.Label>
                <Col sm={10}>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      // <Form.Control {...field} type="text" />
                      <textarea {...field} type="text" className="form-control fs-6" />
                    )}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column lg={2}>
                  Banned
                </Form.Label>
                <Col sm={10}>
                  {isLinkEdit ? (
                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Form.Select {...field}>
                          <option value="inactive">On</option>
                          <option value="active">Off</option>
                        </Form.Select>
                      )}
                    />
                  ) : (
                    <>{getValues("status") === "active" ? "Off" : "On"}</>
                  )}
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column lg={2}>
                  Logo Image
                </Form.Label>
                <Col sm={10}>
                  {pagesDetail.logoImage && (
                    <Image
                      src={pagesDetail.logoImage}
                      alt={pagesDetail.name ?? "logo-image"}
                      width={100}
                      height={100}
                    />
                  )}
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column lg={2}>
                  Background Image
                </Form.Label>
                <Col sm={10}>
                  {pagesDetail.backgroundImage && (
                    <Image
                      src={pagesDetail.backgroundImage}
                      alt={pagesDetail.name ?? "logo-image"}
                      width={100}
                      height={150}
                    />
                  )}
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column lg={2}>
                  Your Link
                </Form.Label>
                <Col sm={10}>
                  {isLinkEdit && (
                    <div className="d-flex justify-content-center">
                      <h6>Tap to edit</h6>
                    </div>
                  )}
                  {pageLink?.map((item, key) => (
                    <Card
                      className="bg-light"
                      key={`page-link-${key}`}
                      onClick={() => {
                        if (isLinkEdit) {
                          setEditLink((prevState) => ({
                            visible: !prevState.visible,
                            arrayKey: key,
                            data: item,
                          }));
                        }
                      }}
                    >
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col sm={3} lg={1}>
                            <FontAwesomeIcon icon={item.linkIcon} size="2x" className="align-items-center" />
                          </Col>
                          <Col className="align-items-center">{item.linkLabel}</Col>
                          <Col sm={1} lg={1}>
                            <Button
                              variant="light"
                              onClick={() =>
                                ClickToCopy({
                                  text: item.linkUrl,
                                })
                              }
                              className="align-items-center"
                            >
                              <FontAwesomeIcon icon="fas fa-copy" />
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </Col>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button
                  type={isLinkEdit ? "button" : "submit"}
                  variant="primary"
                  onClick={handleEdit}
                >
                  {isLinkEdit ? "Save" : "Edit"}
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>

        <Modal
          show={editLink.visible}
          onHide={() => setEditLink({ visible: false, data: {} })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Link</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column lg={2}>
                Link Label
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  value={editLink?.data?.linkLabel ?? "-"}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column lg={2}>
                Link URL
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  value={editLink?.data?.linkUrl ?? "-"}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column lg={2}>
                Icon
              </Form.Label>
              <Col sm={10}>
                <div className="d-flex gap-3 align-items-center">
                  <FontAwesomeIcon icon={editLink?.data?.linkIcon} size="2x" />
                  <Button
                    type={"button"}
                    variant={"secondary"}
                    onClick={() => setIsPickIcon(!isPickIcon)}
                  >
                    {isPickIcon ? "Close" : "Choose"}
                  </Button>
                </div>
              </Col>
            </Form.Group>
            {isPickIcon && (
              <div className="d-flex gap-3 flex-wrap justify-content-center border border-3 border-secondary rounded-3 p-2">
                {props.iconList.map((item, key) => (
                  <button
                    key={`icon-list-${key}`}
                    type="button"
                    className="btn btn-outline-primary text-primary-custom"
                    style={{ width: 75, height: 75 }}
                    onClick={() => {
                      setEditLink((prevState) => ({
                        ...prevState,
                        data: {
                          ...prevState.data,
                          linkIcon: item,
                        },
                      }));
                      setIsPickIcon(false);
                    }}
                  >
                    <FontAwesomeIcon key={key} icon={item} size="3x" />
                  </button>
                ))}
              </div>
            )}
            {!isPickIcon && (
              <Modal.Footer className="d-flex justify-content-end">
                <Button type="button" onClick={() => handleChangeLink()}>
                  Save
                </Button>
              </Modal.Footer>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </AdminLayout>
  );
}
