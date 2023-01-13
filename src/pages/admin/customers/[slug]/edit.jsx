import { AdminLayout } from "@layout";
import { Button, Card } from "react-bootstrap";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getProfileByUid,
  storeProfile,
} from "../../../../config/FirebaseFirestore";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

const formSchema = yup.object({
  email: yup
    .string()
    .required("Email is Required")
    .email("Please enter a valid email address (Ex: johndoe@domain.com)"),
  username: yup.string().required("Username is Required"),
  phoneNumber: yup.string().required("Phone Number is Required"),
  address: yup.string().required("Address is Required"),
});

export default function CustomerEditPage(props) {
  const { Swal } = props;
  const router = useRouter();
  const [uid, setUid] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const getCustomer = useCallback(() => {
    getProfileByUid(uid).then((item) => {
      setValue("email", item?.data()?.email ?? "");
      setValue("username", item?.data()?.username ?? "");
      setValue("phoneNumber", item?.data()?.phoneNumber ?? "");
      setValue("address", item?.data()?.address ?? "");
    });
  }, [setValue, uid]);

  const editCustomer = (data) => {
    const profile = {
      uid: router.query.slug,
      ...data,
    };

    storeProfile(profile).then((item) => {
      Swal.fire({
        title: "User Profile saved",
        icon: "success",
      }).then(async () => {
        window.location.href = "/admin/customers";
      });
    });
  };

  useEffect(() => {
    getCustomer(router.query.slug);
  }, [getCustomer, router.query.slug]);

  return (
    <AdminLayout>
      <Card className="mb-5">
        <Card.Header>Edit Customer</Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit(editCustomer)}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                {...register("email")}
                type="email"
                className="form-control"
                readOnly
              />
              {errors?.email && (
                <small className="ms-3 text-danger">
                  {errors?.email?.message}
                </small>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                {...register("username")}
                type="text"
                className="form-control"
              />
              {errors?.username && (
                <small className="ms-3 text-danger">
                  {errors?.username?.message}
                </small>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                {...register("phoneNumber")}
                type="text"
                className="form-control"
              />
              {errors?.phoneNumber && (
                <small className="ms-3 text-danger">
                  {errors?.phoneNumber?.message}
                </small>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <textarea {...register("address")} className="form-control" />
              {errors?.address && (
                <small className="ms-3 text-danger">
                  {errors?.address?.message}
                </small>
              )}
            </div>

            <Button type="submit">Simpan</Button>
          </form>
        </Card.Body>
      </Card>
    </AdminLayout>
  );
}
