import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Card } from "react-bootstrap";

export default function LinkCardComponent(props: any) {
  const { asLink, label, keyData, editLink, linkIcon, linkUrl } = props;

  const LinkDetail = () => {
    return (
      <Card
        key={keyData}
        style={{ backgroundColor: "#0b434c" }}
        onClick={() => {
          if (editLink instanceof Function) {
            editLink(keyData);
          }
        }}
      >
        <Card.Body>
          <div className="d-flex gap-3">
            <FontAwesomeIcon icon={linkIcon} size="2x" className="text-white" />
            <div className="text-white fw-bolder">{label}</div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <>
      {asLink === true ? (
        <Link href={linkUrl} target="_blank">
          <LinkDetail />
        </Link>
      ) : (
        <LinkDetail />
      )}
    </>
  );
}
