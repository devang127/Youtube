import React from "react";
import { Link } from "react-router-dom";
import { AnimatedText } from "./AnimatedText";

const Heading = ({ tag = "", tagLink = "", title, description = "", pageHeader = false, textAlign = "start", textWhite = false, blueTag, yellowTag }) => {
  return (
    <div
      className={`heading ${textAlign == "center" ? "_center" : ""} ${textWhite ? "_white" : ""} ${blueTag ? "_blueTag" : " "} ${
        yellowTag ? "_yellowTag" : " "
      }`}
    >
      {tag ? (
        tagLink ? (
          <Link to={tagLink} className="tag-link">
            <h5>{tag}</h5>
          </Link>
        ) : (
          <h5>{tag}</h5>
        )
      ) : (
        ""
      )}
      {title && (pageHeader ? <h1>{title}</h1> : <h2>{title}</h2>)}
      {description ? <p>{description}</p> : ""}
    </div>
  );
};

export default React.memo(Heading);
