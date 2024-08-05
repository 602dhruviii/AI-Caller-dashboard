"use client";
import dynamic from "next/dynamic";
import React from "react";
import TableThree from "../Tables/TableThree";
import CardDataStats from "../CardDataStats";


const ECommerce: React.FC = () => {
  return (
    <div style={{height:"100%"}}>
      <div>
        <CardDataStats title="Total Agents"></CardDataStats>
      </div>
      <br/>
      <div>
        <div>
        <TableThree />
        </div>
      </div>
    </div>
  );
};

export default ECommerce;
