import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useApi } from "../../../context/apiContext";

interface ChartData {
  category: string;
  goal: number;
  billed: number;
  paid: number;
}

const BarChart: React.FC = () => {
  const chartRef = useRef<am5.Root | null>(null);
  const { apiValue, isLoading, error } = useApi();

  useEffect(() => {
    if (isLoading || error || !apiValue) return;

    // Create root element
    const root: am5.Root = am5.Root.new("barchart");

    root._logo?.dispose();

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panY: false,
        layout: root.verticalLayout,
      }),
    );

    // Create axes
    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: am5xy.AxisRendererY.new(root, {
          inversed: true,
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
        }),
      }),
    );

    yAxis.get("renderer").labels.template.set("visible", false);

    let numberFormatter = am5.NumberFormatter.new(root, {
      numberFormat: "$#,###.##",
    });

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {}),
        numberFormat: "$#,###.##",
        extraTooltipPrecision: 2,
      }),
    );

    xAxis.set("numberFormatter", numberFormatter);

    xAxis.get("renderer").labels.template.setAll({
      fontSize: 12,
    });

    // Add series
    function createSeries(name: string, field: keyof ChartData, color: string) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueXField: field,
          categoryYField: "category",
          sequencedInterpolation: true,
        }),
      );

      series.columns.template.setAll({
        height: am5.percent(70),
        tooltipText: "{name}: ${valueX}",
        fillOpacity: 0.9,
        strokeOpacity: 0,
        fill: am5.color(color),
      });

      return series;
    }

    const goalSeries = createSeries("Goal", "goal", "#2e5a43");
    const billedSeries = createSeries("Billed", "billed", "#7fd3c3");
    const paidSeries = createSeries("Paid", "paid", "#39b585");

    // Add legend
    let legend = chart.children.unshift(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        y: 6,
        layout: root.horizontalLayout,
        paddingTop: 10,
        paddingLeft: 60,
      }),
    );

    legend.data.setAll(chart.series.values);

    const data: ChartData[] = [];
    apiValue.fiveYearSummaryReports?.forEach((report) => {
      data.push({
        category: report.year?.toString() || "",
        goal: report.goal || 0,
        billed: report.billed || 0,
        paid: report.paid || 0,
      });
    });

    yAxis.data.setAll(data);
    goalSeries.data.setAll(data);
    billedSeries.data.setAll(data);
    paidSeries.data.setAll(data);

    // Make stuff animate on load
    chart.appear(1000, 100);

    chartRef.current = root;

    return () => {
      root.dispose();
    };
  }, [apiValue, isLoading, error]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!apiValue) {
    return <div>No data available</div>;
  }

  return <div id="barchart" style={{ width: "550px", height: "500px" }}></div>;
};

export default BarChart;
