import React, { useLayoutEffect, useRef } from "react";
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
} from "@mui/material";
import { DataItem } from "../types";
import { useApi } from "../../../context/apiContext";




const ConsentChart: React.FC = () => {
  const chartRef = useRef<am5.Root | null>(null);
  const [data, setData] = React.useState<DataItem[] | []>([]);
  const { apiValue } = useApi();

  useLayoutEffect(() => {
    // Create root element
    const root: am5.Root = am5.Root.new("consent");

    root._logo?.dispose();

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    const colors: { [key: string]: am5.Color } = {
      "Parent Consent: No": am5.color("#B85741"),
      'Parent Consent: Refused': am5.color("#6FC8D6"),
      "Parent Consent: Date": am5.color("#3E4C59"),
      'Parent Consent: Unidentified': am5.color("#3cb48c"),
    };

    // Create chart
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50),
      }),
    );

    // Create series
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
      visible: false,
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

    const data: DataItem[] =
    apiValue?.billingBlockSummaryReports?.[3]?.billingBlockSummaries?.map((item) => ({
      category: item.blockType ?? "",
      value: item.dollarAmount ?? 0,
    })) ?? [];

  setData(data);

    // Set data
    series.data.setAll(data);

    const legend = chart.children.unshift(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        useDefaultMarker: true,
      }),
    );

    legend.labels.template.setAll({
      fontSize: 12,
      text: "{category}",
    });

    legend.markers.template.setAll({
      width: 16, // Set smaller marker width
      height: 12,
      // Set smaller marker height
    });

    legend.valueLabels.template.setAll({
      forceHidden: true, // Remove the percentage values
    });
    legend.data.setAll(series.dataItems);

    // Play initial series animation
    series.appear(1000, 100);

    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div>
      
      <div id="consent" style={{ width: "100%", height: "400px" }}></div>

      <TableContainer component={Paper} >
        <Table>
          <TableBody>
            {data.map((row,index) => (
              <TableRow key={row.category}  sx={{
                backgroundColor: index % 2 ? "#f9f9f9" : "white", // alternate row colors
              }}>
                <TableCell component="th" scope="row">
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

export default ConsentChart;
