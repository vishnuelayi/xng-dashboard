import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Box, Typography } from "@mui/material";
import { useApi } from "../../../context/apiContext";

interface ChartData {
  category: string;
  value: number;
}

const PaidVsGoalChart: React.FC = () => {
  const chartRef = useRef<am5.Root | null>(null);

  const { apiValue, isLoading, error } = useApi();

  const paid: number = apiValue?.reimbursementGoalReports?.[0]?.paid || 0;
  const goal: number = apiValue?.reimbursementGoalReports?.[0]?.goal || 0;

  useLayoutEffect(() => {
    const root: am5.Root = am5.Root.new("paidVsGoalChart");
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
      }),
    );

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 30,
          cellStartLocation: 0.1,
          cellEndLocation: 0.9
        }),
        categoryField: "category",
      }),
    );

    let numberFormatter = am5.NumberFormatter.new(root, {
      numberFormat: "$#,###.##",
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        numberFormat: "$#,###.##",
        extraTooltipPrecision: 2,
      }),
    );

    yAxis.set("numberFormatter", numberFormatter);

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Value",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        categoryXField: "category",
      }),
    );

    const data: ChartData[] = [
      { category: "Paid", value: paid || 0 },
      { category: "Goal", value: goal || 0 },
    ];

    xAxis.data.setAll(data);
    series.data.setAll(data);

    series.columns.template.setAll({
      fillOpacity: 1,
      strokeOpacity: 0,
      tooltipText: "{categoryX}: ${valueY}",
      tooltipY: 0,
      
    });

    const tooltip = am5.Tooltip.new(root, {
      labelText: "{categoryX}: ${valueY}",
    });

    series.set("tooltip", tooltip);

    series.columns.template.adapters.add("fill", (fill, target) => {
      if (target.dataItem) {
        const item = target.dataItem.dataContext as ChartData;
        return item.category === "Paid" ? am5.color(0x3cb48c) : am5.color(0x2C5545);
      }
      return fill;
    });

 

    yAxis.get("renderer").labels.template.setAll({
      fontSize: 12,
      fill: am5.color(0x000000),
    });

    xAxis.get("renderer").labels.template.setAll({
      fontSize: 15,
      fill: am5.color(0x000000),
      centerY: am5.p100,
      centerX: am5.p50,
      paddingTop: 10,
    });

    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, [paid, goal]); // Add paid and goal to the dependency array

  return (
    <Box sx={{ width: "50%" }}>
      <Typography variant="body1" align="center" gutterBottom fontWeight="bold">
        This Year
      </Typography>
      <div id="paidVsGoalChart" style={{ width: "100%", height: "300px" }} />
    </Box>
  );
};

export default PaidVsGoalChart;
