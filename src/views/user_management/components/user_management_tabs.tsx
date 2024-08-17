import { Box, Tab, Tabs } from "@mui/material";
import React from "react";

type Props = {
  tabs: { label: string; content: React.ReactNode }[];
  componentBetweenTabsAndContent?: React.ReactNode;
  selectedTabIndex: number;
  disableInteraction?: boolean;
  contentOverrideOnDisable?: React.ReactNode;
  setSelectedTabIndex: (value: number) => void;
};

const UserManagementTabs = (props: Props) => {
  return (
    <Box sx={{ opacity: props.disableInteraction ? 0.8 : 1 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={props.selectedTabIndex}
          scrollButtons="auto"
          variant="scrollable"
          onChange={(_, value) =>
            !props.disableInteraction && props.setSelectedTabIndex(value as number)
          }
          sx={{
            ".MuiTabs-flexContainer": { gap: 2 },
            // width: '100%',
          }}
        >
          {props.tabs.map((tab, i) => (
            <Tab
              key={i}
              label={tab.label}
              id={`tab-${i}`}
              sx={{
                textTransform: "capitalize",
                alignItems: "start",
                fontWeight: props.selectedTabIndex === i ? "700" : "500",
                padding: "0",
              }}
            />
          ))}
        </Tabs>
      </Box>
      <Box component={"ul"} sx={{ listStyle: "none", padding: 0, maxWidth: "1920" }}>
        {props.componentBetweenTabsAndContent}
        {props.tabs.map((tab, i) => (
          <Box
            key={i}
            component={"li"}
            // hidden={selectedTabIndex !== i}
            display={props.selectedTabIndex === i ? "block" : "none"}
            id={`tabpanel-${i}`}
            aria-labelledby={`tab-${i}`}
          >
            {/* This is to ensure the child component does not get rendered at all if the tab isnt selected */}
            {props.disableInteraction && props.contentOverrideOnDisable ? props.contentOverrideOnDisable : props.selectedTabIndex === i ? tab.content : undefined}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UserManagementTabs;
