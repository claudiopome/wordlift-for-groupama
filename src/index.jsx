import React from "react";
import ReactDOM from "react-dom/client";
import DynamicTooltip from "./components/DynamicTooltip";

const initDynamicTooltips = (selector, baseUrl) => {
  const elements = document.querySelectorAll(selector);

  elements.forEach((element) => {
    const dataId = element.getAttribute("data-id");
    const anchorLink = element.getAttribute("href");

    if (dataId) {
      // Create a wrapper div to avoid replacing the original link
      const wrapper = document.createElement("div");
      element.parentNode.insertBefore(wrapper, element);
      wrapper.appendChild(element);

      const root = ReactDOM.createRoot(wrapper);

      root.render(
        <DynamicTooltip
          dataId={dataId}
          baseUrl={baseUrl}
          anchorLink={anchorLink}
        >
          <span dangerouslySetInnerHTML={{ __html: element.outerHTML }} />
        </DynamicTooltip>
      );
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  if (window._wlCloudSettings) {
    const { selector, url } = window._wlCloudSettings;
    initDynamicTooltips(selector, url);
  } else {
    console.error("Error: _wlCloudSettings is not defined.");
  }
});
