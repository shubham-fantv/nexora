import Link from "next/link";
import React from "react";

const CLink = ({ route, handleClick, prefetch = false, children, ...rest }) => {
  const handleLinkClick = (e) => {
    if (e.ctrlKey || e.metaKey) {
      return;
    } else if (handleClick) {
      handleClick();
    }
  };

  return (
    <Link legacyBehavior href={route} prefetch={prefetch} {...rest}>
      <a onClick={handleLinkClick}>{children}</a>
    </Link>
  );
};

export default CLink;
