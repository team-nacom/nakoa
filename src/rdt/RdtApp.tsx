import React, { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import {
  Tree,
  NodeModel,
  DragLayerMonitorProps,
  MultiBackend,
  getBackendOptions,
  DndProvider
} from "@minoru/react-dnd-treeview";
import { CustomData } from "./types";
import { CustomNode } from "./CustomNode";
import { CustomDragPreview } from "./CustomDragPreview";
import { theme } from "./theme";
import styles from "./App.module.css";
import SampleData from "./sample_data.json";

function App() {
  const [treeData, setTreeData] = useState<NodeModel<CustomData>[]>(SampleData);
  const handleDrop = (newTree: NodeModel<CustomData>[]) => setTreeData(newTree);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <div className={styles.app}>
          <Tree<CustomData>
            tree={treeData}
            rootId={0}
            hasGrip={true}
            render={(
              node: NodeModel<CustomData>,
              { depth, isOpen, onToggle, gripRef }
            ) => (
              <CustomNode
                node={node}
                depth={depth}
                isOpen={isOpen}
                onToggle={onToggle}
                gripRef={gripRef}
              />
            )}
            dragPreviewRender={(
              monitorProps: DragLayerMonitorProps<CustomData>
            ) => <CustomDragPreview monitorProps={monitorProps} />}
            onDrop={handleDrop}
            classes={{
              root: styles.treeRoot,
              draggingSource: styles.draggingSource,
              dropTarget: styles.dropTarget
            }}
          />
        </div>
      </DndProvider>
    </ThemeProvider>
  );
}

export default App;
