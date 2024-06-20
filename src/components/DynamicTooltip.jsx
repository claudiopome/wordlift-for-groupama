import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const DynamicTooltip = ({ children, dataId, baseUrl }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const ids = dataId.split(";").map((p) => encodeURIComponent(p));
      const param = `id[]=${ids.join("&id[]=")}`;

      const response = await fetch(`${baseUrl}?${param}`);
      const json = await response.json();

      // Extract the description and image from the response
      const descriptions = json.map((item) => item.description).filter(Boolean);
      const images = json.map((item) => item.image?.[0]?.url).filter(Boolean);

      if (descriptions.length === 0) {
        setContent("No description available.");
      } else {
        setContent(descriptions.join(" "));
      }

      if (images.length > 0) {
        setImageUrl(images[0]);
      } else {
        setImageUrl(null);
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
          <Box>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="image"
                style={{ width: "100%", height: "auto", marginBottom: "8px" }}
              />
            )}
            <Typography variant="body2">{content}</Typography>
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
