import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { Button, Col, Container, Row } from "react-bootstrap";
import Link from "next/link";
import { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authSignIn } from "../../config/FirebaseAuthentication";
import { FirebaseResponseCode } from "../../config/FirebaseAuthConstants";
import Cookies from "js-cookie";

const formSchema = yup.object({
  email: yup
    .string()
    .required("Email is Required")
    .email("Please enter a valid email address (Ex: johndoe@domain.com)"),
  password: yup
    .string()
    .required("Password is Required")
    .min(6, "Minimum Password is 6 Characters"),
});

const SignInPage = (props) => {
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const Login = (data) => {
    setLoginErrorMessage("");
    authSignIn(data)
      .then((r) => {
        Cookies.set("user", JSON.stringify(r.user), { path: "/" });
        window.location.href = "/admin";
      })
      .catch((e) => {
        setLoginErrorMessage(FirebaseResponseCode[e.code]);
      });
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
      <Container>
        <Row className="justify-content-center align-items-center px-3">
          <Col lg={8}>
            <Row className="justify-content-center">
              <Col md={7} className="bg-white border p-5">
                <div className="">
                  <h1>Login</h1>
                  <p className="text-black-50">Sign In to your account</p>

                  {loginErrorMessage !== "" && (
                    <div className="alert alert-danger">
                      {loginErrorMessage}
                    </div>
                  )}

                  {/*<CForm*/}
                  {/*  buttonLabel="Change Email"*/}
                  {/*  register={register}*/}
                  {/*  handleSubmit={handleSubmit}*/}
                  {/*  onSubmit={Login}*/}
                  {/*  className="change-form"*/}
                  {/*>*/}
                  {/*  <CInputText*/}
                  {/*    name="email"*/}
                  {/*    type="email"*/}
                  {/*    placeholder="Enter your email"*/}
                  {/*    error={errors.email?.message}*/}
                  {/*    autoFocus*/}
                  {/*  />*/}
                  {/*  <CInputText*/}
                  {/*    name="password"*/}
                  {/*    type="password"*/}
                  {/*    placeholder="Enter your email"*/}
                  {/*    error={errors.email?.message}*/}
                  {/*    autoFocus*/}
                  {/*  />*/}
                  {/*</CForm>*/}

                  <form onSubmit={handleSubmit(Login)}>
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FontAwesomeIcon icon={faUser} fixedWidth />
                        </span>
                        <input
                          {...register("email")}
                          placeholder="Email"
                          aria-label="Email"
                          className="form-control"
                        />
                      </div>
                      {errors?.email && (
                        <div className="text-danger">
                          {errors?.email?.message}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FontAwesomeIcon icon={faLock} fixedWidth />
                        </span>
                        <input
                          {...register("password")}
                          placeholder="Password"
                          aria-label="Password"
                          className="form-control"
                          type={showPassword ? "text" : "password"}
                        />
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>
                          {errors.password && (
                            <div className="text-danger fs-6">
                              {errors.password.message}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn text-secondary mb-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "Hide password" : "Show password"}
                        </button>
                      </div>
                    </div>
                    {/*<InputGroup className="mb-3">*/}
                    {/*  <InputGroup.Text>*/}
                    {/*    <FontAwesomeIcon*/}
                    {/*      icon={faUser}*/}
                    {/*      fixedWidth*/}
                    {/*    />*/}
                    {/*  </InputGroup.Text>*/}
                    {/*  <Form.Control*/}
                    {/*    name="username"*/}
                    {/*    required*/}
                    {/*    disabled={submitting}*/}
                    {/*    placeholder="Username"*/}
                    {/*    aria-label="Username"*/}
                    {/*  />*/}
                    {/*</InputGroup>*/}

                    <Row>
                      <Col xs={6}>
                        <Button
                          className="px-4"
                          variant="primary"
                          type="submit"
                        >
                          Login
                        </Button>
                      </Col>
                      <Col xs={6} className="text-end">
                        <Link href="/auth/forget-password">
                          <Button className="px-0" variant="link" type="button">
                            Forgot password?
                          </Button>
                        </Link>
                      </Col>
                    </Row>
                  </form>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignInPage;
