import { createContext, useState } from "react";
import Box from "../../../../design/components-dev/BoxExtended";
import SidebarLayout from "../../../../layouts/SidebarLayout";
import AdminHeaderDistrictSelector from "../../common/admin_header_district_selector";
import SIDEBAR_LAYOUT_BTNS from "../../constants/sidebar_layout_btns";
import { Paper } from "@mui/material";
import { DistrictRef } from "../../../../profile-sdk";
import { XNGSlide, XNGSliderViewport } from "../../../../design/low-level/slider_viewport";
import CampusInformationTableView from "./views/table_view";
import {
  CampusInformationContextStore,
  CampusInformationSlide,
  CampusInformationSlide1Screen,
} from "./types/types";
import { CampusInformationSlide1 } from "./views/slide_1";
import { useFetchTable } from "./hooks/use_fetch_table";
import { ADMIN_VISUAL_STANDARD_SPACING } from "../../constants/spacing";
import  useSidebarLayoutBtns from "../../constants/sidebar_layout_btns";

const REM_SPACING = "1.5rem";

export const CampusInformationContext = createContext<CampusInformationContextStore>({
  district: null,
  setSelectedSlide: () => {},
  setSlide1Screen: () => {},
  table: null,
});

export default function CampusInformation() {
  const [district, setDistrict] = useState<DistrictRef | null>(null);

  const [selectedSlide, setSelectedSlide] = useState<CampusInformationSlide>(0);
  const [slide1Screen, setSlide1Screen] = useState<CampusInformationSlide1Screen>({ id: "add" });

  const table = useFetchTable({ dependencies: { district } });
  const sidebarButtons = useSidebarLayoutBtns()
  const contextStore: CampusInformationContextStore = {
    district,
    setSelectedSlide,
    setSlide1Screen,
    table,
  };

  return (
    <CampusInformationContext.Provider value={contextStore}>
      <SidebarLayout
        sidebarContent={sidebarButtons}
        content={
          <Box
            p={REM_SPACING}
            sx={{
              p: ADMIN_VISUAL_STANDARD_SPACING,
              display: "flex",
              flexDirection: "column",
              gap: REM_SPACING,
            }}
          >
            <AdminHeaderDistrictSelector
              onChange={(d) => {
                setDistrict(d);
              }}
            />

            <Paper
              sx={{
                boxShadow: "3",
                padding: "2rem",
                height: "calc(100vh - 16rem)",
                overflow: "hidden",
              }}
            >
              <XNGSliderViewport selectedSlideIndex={selectedSlide}>
                <XNGSlide>
                  <CampusInformationTableView />
                </XNGSlide>

                <XNGSlide>
                  <CampusInformationSlide1 screen={slide1Screen} />
                </XNGSlide>
              </XNGSliderViewport>
            </Paper>
          </Box>
        }
      />
    </CampusInformationContext.Provider>
  );
}
