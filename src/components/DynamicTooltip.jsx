import React, { useState } from "react";

import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

import ArrowCircleIcon from "./ArrowCircleIcon";
import "../index.css";

const DynamicTooltip = ({ children, dataId, baseUrl, anchorLink }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageOrientation, setImageOrientation] = useState("");
  //const [entityLink, setEntityLink] = useState(null);
  const [error, setError] = useState(null);

  const isMobile = useMediaQuery("(max-width:600px)");
  const charLimit = isMobile ? 100 : 200; // Adjust charachter limit for mobile and desktop here

  const fetchData = async () => {
    console.log("Fetching data...");
    setLoading(true);
    setError(null);

    try {
      const ids = dataId.split(";").map((p) => encodeURIComponent(p));
      const param = `id[]=${ids.join("&id[]=")}`;

      const response = await fetch(`${baseUrl}?${param}`);
      const json = await response.json();

      // Extract the description, image, and page URL from the response
      const descriptions = json.map((item) => item.description).filter(Boolean);
      const images = json.map((item) => item.image?.[0]?.url).filter(Boolean);

      if (descriptions.length === 0) {
        setContent("Si è verificato un errore.");
      } else {
        const truncatedContent =
          descriptions[0].length > charLimit
            ? descriptions[0].substring(0, charLimit) + "..."
            : descriptions[0];
        setContent(truncatedContent);
      }

      if (images.length > 0) {
        setImageUrl(images[0]);
        const img = new Image();
        img.src = images[0];
        img.onload = () => {
          if (img.width > img.height) {
            setImageOrientation("horizontal");
          } else {
            setImageOrientation("vertical");
          }
        };
      }
    } catch (err) {
      setError("Si è verificato un errore.");
    } finally {
      setLoading(false);
    }
  };

  const handleTooltipOpen = () => {
    setOpen(true);
    if (!content && !loading && !error) {
      fetchData();
    }
  };

  const handleTooltipClose = () => {
    setOpen(false);
  };

  return (
    <Tooltip
      open={open}
      onOpen={handleTooltipOpen}
      onClose={handleTooltipClose}
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            maxWidth: "345px",
            fontSize: "initial",
            padding: "0",
            backgroundColor: "rgb(255, 255, 255)",
            color: "rgba(0, 0, 0, 0.87)",
            boxShadow:
              "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px",
          },
        },
      }}
      title={
        loading ? (
          <Box display="flex" alignItems="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : content ? (
          <Box
            className={`custom-context-card custom-context-card--${imageOrientation}-image`}
          >
            {imageUrl && (
              <img
                className={`custom-context-card__image`}
                src={imageUrl}
                alt="tooltip image"
              />
            )}
            <Box className={`custom-context-card__description`}>
              <Typography
                className={`custom-context-card__description__text`}
                component="div"
              >
                {content}
              </Typography>
              <a
                className={`custom-context-card__description__anchor`}
                href={anchorLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ArrowCircleIcon />
              </a>
            </Box>
          </Box>
        ) : (
          <Typography
            className={`custom-context-card__description`}
            component="div"
          >
            Si è verificato un errore
          </Typography>
        )
      }
      arrow
      interactive
    >
      {children}
    </Tooltip>
  );
};

export default DynamicTooltip;
