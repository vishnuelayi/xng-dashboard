import React, { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useApi } from "../../../context/apiContext";

const ServiceAreaGraph: React.FC = () => {
  const { apiValue, isLoading, error } = useApi();
  

  useEffect(() => {
    if (isLoading) return;
    if (error) {
      console.error("Error loading API data:", error);
      return;
    }

    const root: am5.Root = am5.Root.new("chartdiv");

    root._logo?.dispose();

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingLeft: 20,
        paddingBottom: 5,
        layout: root.verticalLayout,
        
       
      }),
    );

    // chart.set("scrollbarX", am5.Scrollbar.new(root, {
    //   orientation: "horizontal"
    // }));

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

    //dummy data
    let data =
      apiValue?.serviceAreaReimbursementReports?.map((item) => ({
        serviceCategory: item.serviceCategory,
        goal: item.goal,
        billed: item.billed,
        paid: item.paid,
      })) || [];

      let xRenderer = am5xy.AxisRendererX.new(root, {
        cellStartLocation: 0.1,
        cellEndLocation: 0.9,
        minorGridEnabled: true,
        minGridDistance: 30,
        // This moves the labels below the chart
      });

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "serviceCategory",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      }),
    );

   
    xAxis.get("renderer").labels.template.setAll({
      oversizedBehavior: "wrap",
      maxWidth: 120,
      textAlign: "center",
      inside: false,
      fontSize: 12,
      dy: 15 // Adjust this value to move labels further down
    });

    xAxis.get("renderer").labels.template.setAll({
    
      fontSize: 14,
      fontWeight:"bold" 
    });

    xRenderer.grid.template.setAll({ location: 1 });

    xAxis.data.setAll(data);

    let numberFormatter = am5.NumberFormatter.new(root, {
      numberFormat: "$#,###.##",
    });

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
        numberFormat: "$#,###.##",
        extraTooltipPrecision: 2
      }),
    );

    yAxis.set("numberFormatter", numberFormatter);

    yAxis.get("renderer").labels.template.setAll({
      fontSize:12 // or a numeric value
    });

    const makeSeries = (name: string, fieldName: string, color: am5.Color) => {
      let series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: "serviceCategory",
          fill: color,
        }),
      );

      series.columns.template.setAll({
        tooltipText: "{name}, {categoryX}:{valueY}",
        width: am5.percent(90),
        tooltipY: 0,
        strokeOpacity: 0,
        fill: color,
      });

      series.data.setAll(data);

      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: 0,
            centerX: am5.p50,
            populateText: true,
          }),
        });
      });

      legend.data.push(series);
    };

    console.log(data);

    makeSeries("Goal", "goal", am5.color(0x2c5545));
    makeSeries("Billed", "billed", am5.color(0x6fc8d6));
    makeSeries("Paid", "paid", am5.color(0x3cb48c));

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [apiValue, isLoading, error]);

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error loading data</div>;

  return <div id="chartdiv" style={{ width: "100%", height: "400px" }} />;
};

export default ServiceAreaGraph;
