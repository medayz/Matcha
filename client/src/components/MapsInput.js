import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";

const styleW = {
  width: "100%"
}

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2)
  }
}));

export default function GoogleMaps(props) {
  const classes = useStyles();
  // const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyBc39oUNubkrmDpYhBqBtxjmTDhYcllEec&libraries=places",
        document.querySelector("head"),
        "google-maps"
      );
    }

    loaded.current = true;
  }

  // const handleChange = event => {
  //   setInputValue(event.target.value);
  //   props.filteringHandler(inputValue);
  // };

  const fetch = React.useMemo(
    () =>
      throttle((input, callback) => {
        autocompleteService.current.getPlacePredictions(input, callback);
      }, 200),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (props.inputValue === "") {
      setOptions([]);
      return undefined;
    }

    fetch({ input: props.inputValue }, results => {
      if (active) {
        setOptions(results || []);
      }
    });

    return () => {
      active = false;
    };
  }, [props.inputValue, fetch]);

  return (
    <Autocomplete
      
      id="google-map-demo"
      style={{ width: "100%" }}
      getOptionLabel={option => option.description}
      filterOptions={x => x}
      options={options}
      autoComplete
      includeInputInList
      freeSolo
      disableOpenOnFocus
      renderInput={params => (
        <TextField
          {...params}
          label="Add a location"
          variant="outlined"
          style={styleW}
          onChange={(e) => props.handleChange(e)}
          onBlur={(e) => props.handleChange(e)}
        />
      )}
      renderOption={option => {
        const matches =
          option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map(match => [match.offset, match.offset + match.length])
        );

        return (
          <Grid container alignItems="center" style={styleW}>
            <Grid item>
              <LocationOnIcon className={classes.icon} />
            </Grid>
            <Grid item xs>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{ fontWeight: part.highlight ? 700 : 400 }}
                >
                  {part.text}
                </span>
              ))}

              <Typography variant="body2" color="textSecondary">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
