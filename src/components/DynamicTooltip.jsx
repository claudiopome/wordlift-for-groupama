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
      } else {
        setImageUrl(null);
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
      title={
        loading ? (
          <Box display="flex" alignItems="center">
            <CircularProgress size={24} />
            <Typography variant="body2" ml={2}>
              Loading...
            </Typography>
          </Box>
        ) : error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : content ? (
          <Box
            display="flex"
            flexDirection={imageOrientation === "horizontal" ? "column" : "row"}
          >
            {imageUrl && (
              <Box
                component="img"
                src={imageUrl}
                alt="Tooltip Image"
                className={`tooltip-image ${imageOrientation}`}
              />
            )}
            <Typography variant="body2" component="span">
              {content}
            </Typography>
            {pageUrl && (
              <Box display="flex" alignItems="center" mt={1}>
                <a href={pageUrl} target="_blank" rel="noopener noreferrer">
                  <ArrowCircleRightIcon
                    style={{ marginLeft: "8px", display: "inline" }}
                  />
                </a>
              </Box>
            )}
          </Box>
        ) : (
          <Typography variant="body2">No content available</Typography>
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
