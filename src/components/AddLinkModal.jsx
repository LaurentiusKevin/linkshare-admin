import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const formSchema = yup.object({
  linkLabel: yup.string().required("Page Link is Required"),
  linkUrl: yup.string().required("Page Name is Required"),
  linkIcon: yup.string().required("Description is Required"),
});

export default function AddLinkModal(props) {
  const { visible, setData, data, onSubmit } = props;
  const [isPickIcon, setIsPickIcon] = useState(false);
  const [pageLink, setPageLink] = useState([]);
  const [editLink, setEditLink] = useState({
    visible: false,
    arrayKey: undefined,
    data: {},
  });

  const {
    control,
    setValue,
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

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

  return (
    <Modal show={visible}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Link</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column lg={2}>
              Link Label
            </Form.Label>
            <Col sm={10}>
              <Controller
                control={control}
                name="linkLabel"
                render={({ field }) => <Form.Control {...field} type="text" />}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column lg={2}>
              Link URL
            </Form.Label>
            <Col sm={10}>
              <Controller
                control={control}
                name="linkUrl"
                render={({ field }) => <Form.Control {...field} type="text" />}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column lg={2}>
              Icon
            </Form.Label>
            <Col sm={10}>
              <div className="d-flex gap-3 align-items-center">
                <FontAwesomeIcon icon={getValues("linkIcon")} size="2x" />
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
                    setValue("linkIcon", item);
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
              <Button type="submit" onClick={handleChangeLink}>
                Save
              </Button>
            </Modal.Footer>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
}
