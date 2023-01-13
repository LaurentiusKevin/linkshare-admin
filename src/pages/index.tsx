export default function IndexPage() {
  return <></>;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/admin",
    },
  };
}
