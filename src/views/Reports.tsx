import React from "react";

function Reports() {
  return (
    <>
      <MyFunctionalComponent myStringProp="adsf" />
    </>
  );
}

function MyFunctionalComponent(myProps: { myStringProp: string }) {
  return <>{myProps.myStringProp}</>;
}

export default Reports;
