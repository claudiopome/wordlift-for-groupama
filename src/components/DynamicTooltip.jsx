import React, { useState } from "react";

import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

import "../index.css";

const DynamicTooltip = ({ children, dataId, baseUrl }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageOrientation, setImageOrientation] = useState("");
  const [pageUrl, setPageUrl] = useState(null);
  const [error, setError] = useState(null);

  const isMobile = useMediaQuery("(max-width:600px)");
  const charLimit = isMobile ? 100 : 200; // Example limits for mobile and desktop

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
      const urls = json.map((item) => item.url).filter(Boolean);

      if (descriptions.length === 0) {
        setContent("No description available.");
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

      if (urls.length > 0) {
        setPageUrl(urls[0]);
      } else {
        setPageUrl(null);
      }
    } catch (err) {
      setError("Error loading content");
    } finally {
      setLoading(false);
    }
  };

  const handleTooltipOpen = () => {
    console.log("Tooltip opened");
    setOpen(true);
    if (!content && !loading && !error) {
      fetchData();
    }
  };

  const handleTooltipClose = () => {
    console.log("Tooltip closed");
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
            backgroundColor: "rgb(255, 255, 255)",
            color: "rgba(0, 0, 0, 0.87)",
            boxShadow:
              "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px",
          },
        },
      }}
      title={
        <Box className="tooltip-content">
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography>{error}</Typography>
          ) : (
            <Box display="flex" flexDirection="row" alignItems="flex-start">
              <Box className="tooltip-text" flex={1}>
                <Typography variant="body2">{content}</Typography>
                {pageUrl && (
                  <Box display="flex" alignItems="center" mt={1}>
                    <a href={pageUrl} target="_blank" rel="noopener noreferrer">
                      <ArrowCircleRightIcon />
                    </a>
                  </Box>
                )}
              </Box>
              {imageUrl && (
                <Box
                  component="img"
                  src={imageUrl}
                  alt="Tooltip Image"
                  className={`tooltip-image ${imageOrientation}`}
                />
              )}
            </Box>
          )}
        </Box>
      }
      arrow
      interactive
    >
      {children}
    </Tooltip>
  );
};

export default DynamicTooltip;
