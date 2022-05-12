import { useReducer, useEffect, useRef, useState } from "react";
import { urlBuildReducer, initialState } from "../Reducers/urlBuildReducer";
import SimpleSnackbar from "./Snackbar";
import {
  Link,
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tooltip,
  IconButton,
  InputBase,
  Divider,
  ButtonGroup,
  Grow,
  Card,
  CardHeader,
} from "@mui/material";
import {
  ContentCopy,
  HelpOutlineOutlined,
  LinkRounded,
  AddCircleOutlineTwoTone,
} from "@mui/icons-material";
import useSnackbar from "../Hooks/useSnackbar";
import { convertAndExportToCsv, socialIconHandler } from "../Utils";
import { SET_ERROR, SET_MESSAGE } from "../Reducers/actionTypes";
import { CampaignDrivers } from "./Specialized/CampaignDrivers";
import { BusinessUnitsSelect } from "./Specialized/BusinessUnitsSelect";
import { TherapeuticAreasSelect } from "./Specialized/TherapeuticAreasSelect";
import { UrlInput } from "./Specialized/UrlInput";
import { CampaignNameInput } from "./Specialized/CampaignNameInput";
import { BitlyIcon } from "../bitlyIcon";
import { drivers } from "../internal";
import { CampaignCard } from "./CampaignCard";

export default function Form() {
  const [state, dispatch] = useReducer(urlBuildReducer, initialState);
  const [increment, setIncrement] = useState(1);
  const { isOpen, alertType, message, openSnackBar } = useSnackbar();
  const fieldRef = useRef(null);

  const devUrl = "http://localhost:9999/.netlify/functions/url-shorten";
  const prodUrl =
    "https://effulgent-cocada-e3d151.netlify.app/.netlify/functions/url-shorten";

  useEffect(() => {
    if (state.errors !== "") {
      openSnackBar(state.errors, "error");
    } else if (state.messages !== "") {
      openSnackBar(state.messages, "success");
    }
    return () => {
      dispatch({ type: SET_ERROR, value: "" });
      dispatch({ type: SET_MESSAGE, value: "" });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.errors, state.messages]);

  return (
    <>
      {isOpen ? (
        <SimpleSnackbar type={alertType} message={message} isOpen={true} />
      ) : null}
      <Paper elevation={5}>
        <Container>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignContent="center"
            alignItems="stretch"
            rowGap={1.75}
            sx={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "8pt",
            }}
          >
            <Typography sx={{ fontWeight: 800 }} variant="h3">
              Campaign URL Builder
            </Typography>

            <UrlInput dispatchHandler={dispatch} formState={state} />
            <CampaignNameInput formState={state} dispatchHandler={dispatch} />
            <BusinessUnitsSelect formState={state} dispatchHandler={dispatch} />
            <TherapeuticAreasSelect
              formState={state}
              dispatchHandler={dispatch}
            />
            <CampaignDrivers
              driverId={10000}
              formState={state}
              dispatchHandler={dispatch}
            />

            {state.generatedDrivers &&
              state.generatedDrivers.map((d, i) => {
                return (
                  <CampaignDrivers
                    key={i}
                    driverId={parseInt(Object.keys(d)[0])}
                    dispatchHandler={dispatch}
                    formState={state}
                  />
                );
              })}

            <Box>
              <Button
                variant="text"
                size="medium"
                onClick={() => {
                  setIncrement(increment + 1);
                  let id = increment;
                  dispatch({ type: "ADD_NEW_DRIVER", driverId: id });
                }}
                endIcon={
                  <AddCircleOutlineTwoTone fontSize="small" color="primary" />
                }
              >
                Add Additional Driver?
              </Button>
            </Box>

            <Grid item>
              <Box sx={{ paddingTop: "1rem" }}>
                <Button
                  fullWidth
                  onClick={() => dispatch({ type: "GENERATE_URL_CAMPAIGN" })}
                  variant="contained"
                >
                  Generate URL Campaign
                </Button>
              </Box>
            </Grid>

            <Divider>
              <Typography variant="button" fontWeight={"bold"}>
                Results
              </Typography>
            </Divider>

            {state.campaignList.length > 0 &&
              state.campaignList.map((c) => {
                console.log(c)
                return (
                <CampaignCard
                  id={c.id}
                  subheader={c.createdAt}
                  dispatchHandler={dispatch}
                  title={c.name}
                  urlList={c.urls}
                />)
              })}

            <Grid item>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <Button
                  // disabled={state.bitlyAccessTokenField === ""}
                  variant="outlined"
                  color="warning"
                  onClick={async () => {
                    let data = await fetch(
                      process.env.NODE_ENV === "development" ? devUrl : prodUrl,
                      {
                        method: "POST",
                        body: JSON.stringify(
                          state.urlCollection.map((u) => u.href)
                        ),
                      }
                    );

                    let response = await data.json();

                    dispatch({
                      type: "SHORTEN_URLS",
                      value: response,
                    });
                  }}
                  endIcon={
                    <BitlyIcon htmlColor="#e4def" sx={{ paddingTop: "2px" }} />
                  }
                >
                  Shorten ALL URLs
                </Button>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <HelpOutlineOutlined fontSize="small" color="secondary" />
                  <Link
                    underline="always"
                    variant="body2"
                    style={{ textAlign: "right", textDecoration: "none" }}
                    href="mailto:babruzese@medscapelive.com"
                  >
                    Issues with the URL builder? Get in touch!
                  </Link>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    </>
  );
}
