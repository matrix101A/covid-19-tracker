import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import { colors } from "@material-ui/core";
import { green } from "@material-ui/core/colors";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
        },
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType, country }) {
  const [data, setData] = useState({});
  const [color, setColor] = useState("red");

  const url =
    country.country === undefined
      ? "https://disease.sh/v3/covid-19/historical/all?lastdays=120"
      : `https://disease.sh/v3/covid-19/historical/` +
        `${country.country}` +
        `?lastdays=120`;

  useEffect(() => {
    console.log(casesType);
    switch (casesType) {
      case "deaths":
        setColor("rgb(85, 204, 234)");
        break;
      case "recovered":
        setColor(" rgb(121, 198, 121)");
        break;
      default:
        setColor("rgb(245, 103, 124)");
    }
    console.log("color is", color);
    const fetchData = async () => {
      await fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data1) => {
          let chartData = {};
          if (country.country === undefined) {
            chartData = buildChartData(data1, casesType);
          } else {
            chartData = buildChartData(data1.timeline, casesType);
          }
          setData(chartData);

          // buildChart(chartData);
        });
    };

    fetchData();
  }, [casesType, country]);
  console.log("color shouls be ", color);
  return (
    <div className="line__graph">
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: color,

                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;
