import React from "react";
import DynamicTooltip from "./components/DynamicTooltip";
import { Button } from "@mui/material";

function App() {
  return (
    <div>
      <a
        className="wl-entity-page-link"
        href="https://wordlift.io/blog/en/entity/knowledge-graph-conference/"
        data-id="http://data.wordlift.io/wl0216/entity/knowledge_graph_conference;http://www.wikidata.org/entity/Q86935657;https://www.knowledgegraph.tech/"
        aria-expanded="false"
      >
        The Knowledge Graph Conference
      </a>
    </div>
  );
}

export default App;
