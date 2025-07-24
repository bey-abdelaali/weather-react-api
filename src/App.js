import logo from "./logo.svg";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// react
import { useEffect, useState } from "react";
// MATERIAL UI COMPONENTS
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";
// External laibrairies
import { useTranslation } from "react-i18next";
import axios from "axios";
import moment from "moment";
import "moment/min/locales";
moment.locale("ar-dz");

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});

let cancelAxios = null;
function App() {
  const { t, i18n } = useTranslation();
  console.log("Rendering component mounting");
  const [dateAndTime, setDateAndTime] = useState("");
  const [locale, setLocale] = useState("ar");
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });
  function handleLanguageClick() {
    if (locale == "ar") {
      moment.locale("en");
      i18n.changeLanguage("en");
      setLocale("en");
    } else {
      moment.locale("ar-dz");
      i18n.changeLanguage("ar");
      setLocale("ar");
    }
    setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
  }
  useEffect(() => {
    i18n.changeLanguage("ar");
  }, []);
  useEffect(() => {
    setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=36.7538&lon=3.0476&appid=0a3f1d989b84e640ece59f66388229b3",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then((response) => {
        // handle success
        const responceTemp = Math.round(response.data.main.temp - 273.15);
        const responceTempMin = Math.round(
          response.data.main.temp_min - 273.15
        );
        const responceTempMax = Math.round(
          response.data.main.temp_max - 273.15
        );
        const description = response.data.weather[0].description;
        const responseIcon = response.data.weather[0].icon;
        setTemp({
          number: responceTemp,
          min: responceTempMin,
          max: responceTempMax,
          description: description,
          icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
        });
        console.log("response ", response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    return () => {
      console.log("canceling");
      cancelAxios();
    };
  }, []);
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          {/* CONTENT CONTAINER */}
          <div
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {/* CARD */}
            <div
              dir="rtl"
              style={{
                width: "100%",
                background: "rgb(28 52 91 / 36%)",
                color: "white",
                padding: "10px",
                borderRadius: "15px",
                boxShadow: "0px 11px 1px rgba(0,0,0,0.05)",
              }}
            >
              {/* CONTENT */}
              <div>
                {/* CITY & TIME */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "start",
                  }}
                  dir="rtl"
                >
                  <Typography
                    variant="h2"
                    style={{
                      marginRight: "20px",
                      fontWeight: "600",
                    }}
                  >
                    {t("Algiers")}
                  </Typography>

                  <Typography variant="h5" style={{ marginRight: "20px" }}>
                    {/* الخميس 24-07-2025 */}
                    {dateAndTime}
                  </Typography>
                </div>
                {/* == CITY & TIME == */}

                <hr />

                {/* CONTAINER OF DEGREE + CLOUD ICON */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  {/* DEGREE & DESCRIPTION */}
                  <div>
                    {/* TEMP */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h1" style={{ textAlign: "right" }}>
                        {temp.number}
                      </Typography>

                      <img src={temp.icon} />
                    </div>
                    {/*== TEMP ==*/}

                    <Typography variant="h6">{t(temp.description)}</Typography>

                    {/* MIN & MAX */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h5>
                        {t("Min")}: {temp.min}
                      </h5>
                      <h5 style={{ margin: "0px 5px" }}>|</h5>
                      <h5>
                        {t("Max")}: {temp.max}
                      </h5>
                    </div>
                  </div>
                  {/*== DEGREE & DESCRIPTION ==*/}

                  <CloudIcon
                    style={{
                      fontSize: "200px",
                      color: "white",
                    }}
                  />
                </div>
                {/*= CONTAINER OF DEGREE + CLOUD ICON ==*/}
              </div>
              {/* == CONTENT == */}
            </div>
            {/*== CARD ==*/}

            {/* TRANSLATION CONTAINER */}
            <div
              dir="rtl"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                marginTop: "20px",
              }}
            >
              <Button
                onClick={handleLanguageClick}
                style={{ color: "white" }}
                variant="text"
              >
                {locale == "ar" ? "إنجليزي" : "Arabic"}
              </Button>
            </div>
            {/*== TRANSLATION CONTAINER ==*/}
          </div>
          {/*== CONTENT CONTAINER ==*/}
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
