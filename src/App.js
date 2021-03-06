import "./App.css";
import Table from "./components/Table";
import DrawMap from "./components/DrawMap";
import LineGraph from "./components/LineGraph";
import { sortData, PrettyPrintStat } from "./components/utility";
import "./components/map.css";

import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import InfoBox from "./components/card";
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: 40.4796 });
  const [mapZoom, setMapZoom] = useState(2.5);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  const onChangeCountry = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode == "Worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    console.log(url);

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCountry(countryCode);
        setCountryInfo(data);
      });
  };
  return (
    <div className="app">
      <div className="content__left">
        <div className="app__header">
          <h1>COVID 19 Tracker</h1>

          <FormControl className="dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onChangeCountry}
            >
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries.map((country) => {
                return (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronovirus Cases"
            cases={PrettyPrintStat(countryInfo.todayCases)}
            total={countryInfo.cases}
            active={casesType === "cases"}
          />

          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={PrettyPrintStat(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
            active={casesType === "deaths"}
          />

          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={PrettyPrintStat(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
            active={casesType === "recovered"}
          />
        </div>
        <div>
          <DrawMap
            center={mapCenter}
            zoom={mapZoom}
            countries={mapCountries}
            caseType={casesType}
          />
        </div>
      </div>
      <Card className="content__right">
        <h3 className="worldwide__text">
          {country} new {casesType}
        </h3>

        <LineGraph casesType={casesType} country={countryInfo} />
        <CardContent>
          <h1>Live cases by country </h1>
          <Table countries={tableData} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
