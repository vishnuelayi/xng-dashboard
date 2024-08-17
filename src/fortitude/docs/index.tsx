import { Box, SxProps, useTheme } from "@mui/material";
import { SidebarLayout } from "./components/sidebar_layout";
import { QueryableDocumentationPage, DocumentationPageRenderer } from "./components/page_renderer";
import { SidebarContentGenerator, SidebarItem } from "./components/sidebar_content";
import { SearchMultiselectDemo } from "./demos/search_multiselect";
import { DesignPhilosophy } from "./views/design_philosophy";
import { Home } from "./views/home";
import { useSelectedPage } from "./hooks/use_selected_page";
import MSBClose from "../components/button_close";
import MSBBack from "../components/button_back";
import SearchDemo from "./demos/search";
import RadioTableDemo from "./demos/radio_table";
import TypedSelectDemo from "./demos/typed_select";
import SliderViewportDemo from "./demos/slider_viewport";
import ScrollShadowViewportDemo from "./demos/scroll_shadow_viewport";
import FortitudeGraphicFull from "./assets/fortitude_graphic_full.png";
import BackButtonDemo from "./demos/back_button";
import CloseButtonDemo from "./demos/close_button";
import InputErrorWrapperDemo from "./demos/input_error_wrapper";

export default function FortitudeView() {
  const [selectedPage, setSelectedPage] = useSelectedPage<FortitudeDocLink>({
    basePath: "/xlogs/fortitude/",
    defaultPage: "Home",
  });

  const { palette } = useTheme();

  const CODE_STYLE: SxProps = {
    pre: {
      boxShadow: 1,
      bgcolor: palette.text.primary,
      color: palette.getContrastText(palette.text.primary),
      borderRadius: "4px",
      padding: ".25rem .25rem",
      code: { boxShadow: 0 },
    },
    code: {
      boxShadow: 1,
      bgcolor: palette.text.primary,
      color: palette.getContrastText(palette.text.primary),
      borderRadius: "4px",
      padding: ".25rem .25rem",
    },
  };

  return (
    <Box sx={{ display: "flex", height: "100%", minWidth: "100%", ...CODE_STYLE }}>
      <SidebarLayout collapseOnMobileDependencies={[selectedPage]}>
        <SidebarContentGenerator<FortitudeDocLink>
          items={FORTITUDE_SIDEBAR_CONTENT}
          onLinkClick={(id) => setSelectedPage(id)}
        />
      </SidebarLayout>
      <DocumentationPageRenderer<FortitudeDocLink>
        pages={FORTITUDE_PAGES}
        selectedPage={selectedPage}
      />
    </Box>
  );
}

type FortitudeDocLink =
  | "Home"
  | "Design Philosophy"
  | "Search Multiselect"
  | "Back"
  | "Close"
  | "Scroll Shadow Viewport"
  | "Single-Select (Typed Select)"
  | "Slider Viewport"
  | "Search"
  | "Radio Table"
  | "Input Error Wrapper";

const FORTITUDE_SIDEBAR_CONTENT: SidebarItem<FortitudeDocLink>[] = [
  { type: "header", label: "Welcome" },
  { type: "link", docLink: "Home" },
  { type: "link", docLink: "Design Philosophy" },
  { type: "header", label: "Components" },
  { type: "link", docLink: "Search Multiselect" },
  { type: "link", docLink: "Single-Select (Typed Select)" },
  { type: "link", docLink: "Search" },
  { type: "link", docLink: "Radio Table" },
  { type: "link", docLink: "Back" },
  { type: "link", docLink: "Close" },
  { type: "link", docLink: "Input Error Wrapper" },
  // { type: "header", label: "Composites" },
  { type: "header", label: "Dev-Components" },
  { type: "link", docLink: "Scroll Shadow Viewport" },
  { type: "link", docLink: "Slider Viewport" },
];

const FORTITUDE_PAGES: QueryableDocumentationPage<FortitudeDocLink>[] = [
  {
    identifier: "Home",
    component: <Home preloadedImg={FortitudeGraphicFull} />,
  },
  {
    identifier: "Design Philosophy",
    title: "Our Design Philosophy",
    component: <DesignPhilosophy />,
  },
  {
    component: <SearchMultiselectDemo />,
    title: "MSBSearchMultiselect",
    identifier: "Search Multiselect",
  },
  {
    component: <BackButtonDemo />,
    title: "MSBBack",
    identifier: "Back",
  },
  {
    component: <CloseButtonDemo />,
    title: "MSBClose",
    identifier: "Close",
  },
  {
    component: <SearchDemo />,
    title: "MSBSearch",
    identifier: "Search",
  },
  {
    component: <RadioTableDemo />,
    title: "MSBRadioTable",
    identifier: "Radio Table",
  },
  {
    component: <TypedSelectDemo />,
    title: "MSBTypedSelect",
    identifier: "Single-Select (Typed Select)",
  },
  {
    component: <SliderViewportDemo />,
    title: "MSBSliderViewport",
    identifier: "Slider Viewport",
  },
  {
    component: <ScrollShadowViewportDemo />,
    title: "MSBScrollShadowViewport",
    identifier: "Scroll Shadow Viewport",
  },
  {
    component: <InputErrorWrapperDemo />,
    title: "InputErrorWrapper",
    identifier: "Input Error Wrapper",
  },
];
