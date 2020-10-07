import React from "react";
import Loader from "react-loader-spinner";

const LoadingSpinner = () => (
  <div
    style={{
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Loader type="ThreeDots" color="#24292e" />
  </div>
);

export default LoadingSpinner;
