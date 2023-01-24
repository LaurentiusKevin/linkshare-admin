import * as yup from "yup";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPassword } from "../../config/FirebaseAuthentication";

const formSchema = yup.object({
  email: yup
    .string()
    .required("Email is Required")
    .email("Please enter a valid email address (Ex: johndoe@domain.com)"),
});

export default function ForgetPasswordPage(props) {
  const { toast } = props;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleResetPassword = (data) => {
    resetPassword({ email: data.email }).then((response) => {
      toast.success("Reset password sent to your email");
    });
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
      <Container>
        <Row className="justify-content-center align-items-center px-3">
          <Col lg={8}>
            <Row className="justify-content-center">
              <Col md={7} className="bg-white border p-5">
                <h2>Forget Password</h2>
                <p className="text-black-50 mb-4">
                  We will send you email link to reset your password
                </p>
                <Form onSubmit={handleSubmit(handleResetPassword)}>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Email</Form.Label>
                    <Controller
                      control={control}
                      name="email"
                      render={({ field }) => <Form.Control {...field} />}
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
