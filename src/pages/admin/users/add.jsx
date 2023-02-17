import { AdminLayout } from "../../../layout";
import Link from "next/link";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { authRegister } from "../../../config/FirebaseAuthentication";
import { storeProfile } from "../../../config/FirebaseFirestore";
import { toast } from "react-toastify";
import { FirebaseResponseCode } from "../../../config/FirebaseAuthConstants";

const formSchema = yup.object({
  email: yup
    .string()
    .required("Email is Required")
    .email("Please enter a valid email address (Ex: johndoe@domain.com)"),
  password: yup
    .string()
    .required("Password is Required")
    .min(6, "Minimum Password is 6 Characters"),
  passwordConfirmation: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Please enter the same value again."),
  phoneNumber: yup
    .string()
    .nullable()
    .min(10, "Minimum Phone is 10 Characters"),
  address: yup.string(),
});

export default function AddCustomerPage(props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
      phoneNumber: "",
      address: "",
    },
  });

  const handleCreateCustomer = (data) => {
    authRegister({ email: data.email, password: data.password })
      .then((response) => {
        storeProfile({
          uid: response.user.uid,
          username: data.email,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
          role: 'admin',
        })
          .then((profileResponse) => {
            toast.success("User created");
            window.location.href = "/admin/users";
          })
          .catch((e) => {
            toast.error(FirebaseResponseCode[e.code]);
          });
      })
      .catch((e) => {
        toast.error(FirebaseResponseCode[e.code]);
      });
  };

  return (
    <AdminLayout>
      <Link href="/admin/customers">
        <Button variant={"light"} className="mb-3">
          <FontAwesomeIcon icon={faCaretLeft} /> Back
        </Button>
      </Link>
      <Card>
        <Card.Header>
          <Card.Title>Add User</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit(handleCreateCustomer)}>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2">
                Email
              </Form.Label>
              <Col sm="10">
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Form.Control {...field} value={field.value} />
                  )}
                />
                {errors?.email && (
                  <small className="text-danger">
                    {errors?.email?.message}
                  </small>
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2">
                Password
              </Form.Label>
              <Col sm="10">
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <Form.Control type="password" {...field} />
                  )}
                />
                {errors?.password && (
                  <small className="text-danger">
                    {errors?.password?.message}
                  </small>
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2">
                Password Confirmation
              </Form.Label>
              <Col sm="10">
                <Controller
                  control={control}
                  name="passwordConfirmation"
                  render={({ field }) => (
                    <Form.Control type="password" {...field} />
                  )}
                />
                {errors?.passwordConfirmation && (
                  <small className="text-danger">
                    {errors?.passwordConfirmation?.message}
                  </small>
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2">
                Phone
              </Form.Label>
              <Col sm="10">
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field }) => <Form.Control {...field} />}
                />
                {errors?.phoneNumber && (
                  <small className="text-danger">
                    {errors?.phoneNumber?.message}
                  </small>
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2">
                Address
              </Form.Label>
              <Col sm="10">
                <Controller
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <Form.Control as="textarea" rows={3} {...field} />
                  )}
                />
                {errors?.address && (
                  <small className="text-danger">
                    {errors?.address?.message}
                  </small>
                )}
              </Col>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </AdminLayout>
  );
}
