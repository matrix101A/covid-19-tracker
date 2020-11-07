import React from "react";
import "./infoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";
function InfoBox({ title, cases, total, active, ...props }) {
  return (
    <Card
      className={`infoBox  ${active && "infoBox--selected"} ${title} `}
      onClick={props.onClick}
    >
      <CardContent>
        <p>{title}</p>
        <h2 className="infoBox__cases">{cases}</h2>
        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
