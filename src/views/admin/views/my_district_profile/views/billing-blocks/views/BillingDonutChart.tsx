import React, { JSXElementConstructor, useLayoutEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { DataItem } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import OperationsChart from "../components/OperationsChart";
import ConsentChart from "../components/ConsentChart";
import StudentChart from "../components/StudentChart";
import SessionsChart from "../components/SessionsChart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Dummy data
const data: DataItem[] = [
  { category: "Operations", value: 3224.12 },
  { category: "Consent", value: 2604.16 },
  { category: "Student", value: 6688.35 },
  { category: "Sessions", value: 882.37 },
];

// Main Component
const BillingBlocksChart: React.FC = () => {
  const [currentComponent, setCurrentComponent] = useState<React.ReactElement<
    any,
    string | JSXElementConstructor<any>
  > | null>(<BillingBlocksChartContent onSelect={handleSelect} />);

  function handleSelect(category: string) {
    let NewComponent;
    switch (category) {
      case "Operations":
        NewComponent = OperationsComponent;
        break;
      case "Consent":
        NewComponent = ConsentComponent;
        break;
      case "Student":
        NewComponent = StudentComponent;
        break;
      case "Sessions":
        NewComponent = SessionsComponent;
        break;
      default:
        NewComponent = BillingBlocksChartContent;
        break;
    }
    setCurrentComponent(<NewComponent onSelect={handleSelect} />);
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "auto" }}>
      <AnimatePresence>
        {currentComponent && (
          <motion.div
            // key={
            //   typeof currentComponent.type === "function"
            //     ? currentComponent.type.name
            //     : currentComponent.type
            // }
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "tween", duration: 0.2 }}
          >
            {currentComponent}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

// Chart Content Component
const BillingBlocksChartContent: React.FC<{ onSelect: (category: string) => void }> = ({
  onSelect,
}) => {
  const chartRef = useRef<am5.Root | null>(null);

  useLayoutEffect(() => {
    const root: am5.Root = am5.Root.new("billingblock");
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    const colors: { [key: string]: am5.Color } = {
      Operations: am5.color("#B85741"),
      Consent: am5.color("#6FC8D6"),
      Student: am5.color("#3E4C59"),
      Sessions: am5.color("#3cb48c"),
    };

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50),
      }),
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false,
      }),
    );

    series.labels.template.setAll({
      textType: "circular",
      centerX: 0,
      centerY: 0,
      forceHidden: true,
    });

    series.slices.template.setAll({
      tooltipText: "{category}: ${value}",
      strokeOpacity: 0,
    });

    series.slices.template.adapters.add("fill", (fill, target) => {
      const dataItem = target.dataItem as am5.DataItem<am5percent.IPieSeriesDataItem>;
      if (dataItem) {
        const category = dataItem.get("category");
        if (typeof category === "string" && category in colors) {
          return colors[category];
        }
      }
      return fill;
    });

    series.data.setAll(data);

    const legend = chart.children.unshift(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginBottom: 5,
        paddingBottom: 0,
        useDefaultMarker: true,
      }),
    );

    legend.labels.template.setAll({
      fontSize: 12,
      text: "{category}",
    });

    legend.markers.template.setAll({
      width: 16,
      height: 12,
    });

    legend.valueLabels.template.setAll({
      forceHidden: true,
    });
    legend.data.setAll(series.dataItems);

    series.appear(1000, 100);

    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div>
      <div id="billingblock" style={{ width: "100%", height: "400px" }}></div>

      <TableContainer component={Paper} sx={{ marginTop: 1 }}>
        <Table>
          <TableBody>
            {data.map((row,index) => (
              <TableRow key={row.category} onClick={() => onSelect(row.category)}  sx={{
                backgroundColor: index % 2 ? "#f9f9f9" : "white", // alternate row colors
              }}>
                <TableCell component="th" scope="row" style={{ cursor: "pointer" }}>
                  {row.category}
                </TableCell>
                <TableCell align="right">${row.value.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const OperationsComponent: React.FC<{ onSelect: (category: string) => void }> = ({ onSelect }) => {
  return (
    <Box>
      <Box sx={{ display: "flex",gap:10, alignItems: "center" }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => onSelect("BillingBlocks")}
        sx={{
          color: "#1976d2",
          borderColor: "#1976d2",
          textTransform: "none",
          fontSize: "14px",
          padding: "6px 5px",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.04)",
            borderColor: "#1976d2",
          },
        }}
      >
        Back
      </Button>
      <Typography variant="h6">Operations</Typography>
      </Box>
      
      <OperationsChart />
    </Box>
  );
};

const ConsentComponent: React.FC<{ onSelect: (category: string) => void }> = ({ onSelect }) => {
  return (
    <Box >
      <Box sx={{ display: "flex",gap:10, alignItems: "center" }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => onSelect("BillingBlocks")}
        sx={{
          color: "#1976d2",
          borderColor: "#1976d2",
          textTransform: "none",
          fontSize: "14px",
          padding: "6px 5px",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.04)",
            borderColor: "#1976d2",
          },
        }}
      >
        Back
      </Button>
      <Typography variant="h6">Consent</Typography>
      </Box>
      <ConsentChart />
    </Box>
  );
};

const StudentComponent: React.FC<{ onSelect: (category: string) => void }> = ({ onSelect }) => {
  return (
    <Box>
     <Box sx={{ display: "flex",gap:10, alignItems: "center" }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => onSelect("BillingBlocks")}
        sx={{
          color: "#1976d2",
          borderColor: "#1976d2",
          textTransform: "none",
          fontSize: "14px",
          padding: "6px 5px",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.04)",
            borderColor: "#1976d2",
          },
        }}
      >
        Back
      </Button>
      <Typography variant="h6">Student</Typography>
      </Box>
      <StudentChart />
    </Box>
  );
};

const SessionsComponent: React.FC<{ onSelect: (category: string) => void }> = ({ onSelect }) => {
  return (
    <Box>
     <Box sx={{ display: "flex",gap:10, alignItems: "center" }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => onSelect("BillingBlocks")}
        sx={{
          color: "#1976d2",
          borderColor: "#1976d2",
          textTransform: "none",
          fontSize: "14px",
          padding: "6px 5px",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.04)",
            borderColor: "#1976d2",
          },
        }}
      >
        Back
      </Button>
      <Typography variant="h6">Sessions</Typography>
      </Box>
      <SessionsChart />
    </Box>
  );
};

export default BillingBlocksChart;
