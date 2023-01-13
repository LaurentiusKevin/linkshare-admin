export default function IndexPage() {
  return <></>;
}

export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: "/admin",
    },
  };
}
