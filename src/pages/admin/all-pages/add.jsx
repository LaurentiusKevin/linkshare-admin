import { AdminLayout } from "../../../layout";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getPage, storePage } from "../../../config/FirebaseFirestore";
import Link from "next/link";
import { Button, Card, Col, Form, Modal, Row, InputGroup } from "react-bootstrap";
import { LINKSHARE_DOMAIN } from "../../../config/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import * as yup from "yup";
import { getImage, uploadImage } from "../../../config/FirebaseStorage";
import AddLinkModal from "../../../components/AddLinkModal";

const formSchema = yup.object({
  url: yup.string().required("Page Link is Required"),
  name: yup.string().required("Page Name is Required"),
  description: yup.string().required("Description is Required"),
  logoImage: yup.string().required("Logo Image is Required"),
  backgroundImage: yup.string().required("Background Image is Required"),
});

export default function AddPages(props) {
  const router = useRouter();
  const [pagesDetail, setPagesDetail] = useState([]);
  const [pageLink, setPageLink] = useState([]);
  const [isLinkEdit, setIsLinkEdit] = useState(false);
  const [editLink, setEditLink] = useState({
    visible: false,
    arrayKey: undefined,
    data: {},
  });
  const logoFileInput = useRef();
  const backgroundFileInput = useRef();
  const [imageFile, setImageFile] = useState({
    logoImage: undefined,
    backgroundImage: undefined,
  });

  const { Swal } = props;

  const {
    control,
    setValue,
    handleSubmit,
    register,
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
  };

  const getCustomer = (uid) => {
    getProfileByUid(uid).then((item) => {
      setProfileData(item.data());
    });
  };

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

  const handleAddLink = (data) => {
    // console.log(data);
  };

  const handleSave = async (data) => {
    data = {
      ...data,
      link: pageLink,
    };
    console.log("", data);
    await storePage("", data).then((response) => {
      router.push(`/admin/all-pages`);
    });
  };

  // const handleSave = (data) => {
  //   authRegister({ email: data.email, password: data.password })
  //     .then((response) => {
  //       storeProfile({
  //         uid: response.user.uid,
  //         url: data.url,
  //         name: data.name,
  //         description: data.description,
  //         address: data.address,
  //       })
  //         .then((profileResponse) => {
  //           toast.success("Customer created");
  //           window.location.href = "/admin/customers";
  //         })
  //         .catch((e) => {
  //           toast.error(FirebaseResponseCode[e.code]);
  //         });
  //     })
  //     .catch((e) => {
  //       toast.error(FirebaseResponseCode[e.code]);
  //     });
  // };




  const onFileChange = (input, fileType) => {
    Swal.showLoading();
    let filename = `page-image/${self.crypto.randomUUID()}.jpg`;
    uploadImage(filename, input.target.files[0]).then((e) => {
      getImage(filename).then((url) => {
        Swal.close();
        if (fileType === "logoImage") {
          setValue("logoImage", url);
          setImageFile({
            ...imageFile,
            logoImage: url,
          });
        }
        if (fileType === "backgroundImage") {
          setValue("backgroundImage", url);
          setImageFile({
            ...imageFile,
            backgroundImage: url,
          });
        }
      });
    });
  };

  return (
    <AdminLayout>
      <div className="d-flex flex-column gap-3">
        <h4>Add Page</h4>
        <Link href={`/admin/all-pages`}>
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
                  Logo Image
                </Form.Label>
                <Col sm={10}>
                  <Image
                    src={imageFile.logoImage ?? "/assets/img/img-add.png"}
                    alt={pagesDetail.name ?? "logo-image"}
                    width={100}
                    height={100}
                    onClick={() => {
                      logoFileInput.current.click();
                    }}
                    className="rounded-3"
                  />
                  <input
                    {...register("logoImage")}
                    type="file"
                    className="form-control d-none"
                    ref={logoFileInput}
                    onChange={(e) => {
                      onFileChange(e, "logoImage");
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column lg={2}>
                  Background Image
                </Form.Label>
                <Col sm={10}>
                  <Image
                    src={imageFile.backgroundImage ?? "/assets/img/img-add.png"}
                    alt={pagesDetail.name ?? "logo-image"}
                    width={150}
                    height={150}
                    onClick={() => {
                      backgroundFileInput.current.click();
                    }}
                  />
                  <input
                    {...register("backgroundImage")}
                    type="file"
                    className="form-control d-none"
                    ref={backgroundFileInput}
                    onChange={(e) => {
                      onFileChange(e, "backgroundImage");
                    }}
                  />
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
                  {/* <Card
                      className="bg-light"
                      // key={`page-link-${key}`}
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
                            <FontAwesomeIcon size="2x" />
                          </Col>
                          <Col>{}</Col>
                        </Row>
                      </Card.Body>
                    </Card> */}
                  {/* {pageLink?.map((item, key) => (
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
                            <FontAwesomeIcon icon={item.linkIcon} size="2x" />
                          </Col>
                          <Col>{item.linkLabel}</Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))} */}
                </Col>
              </Form.Group>
              
              <div className="d-flex justify-content-end">
                <Button type="submit" variant="primary">
                  Save
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
      <AddLinkModal
        visible={editLink.visible}
        setData={handleAddLink}
        onSubmit={handleAddLink}
      />
    </AdminLayout>
  );
}
