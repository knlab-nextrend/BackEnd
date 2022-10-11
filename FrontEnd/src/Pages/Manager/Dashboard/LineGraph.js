import React, { useState, useEffect, useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function LineGraph({ lineGraphData, duration, divName }) {
  const [graphDuration, setGraphDuration] = useState("day");
  useEffect(() => {
    switch (duration) {
      case "daily":
        setGraphDuration("day");
        break;
      case "weekly":
        setGraphDuration("week");
        break;
      case "month":
        setGraphDuration("month");
        break;
    }
  }, [duration]);

  useLayoutEffect(() => {
    var root = am5.Root.new(divName);
    root.setThemes([am5themes_Animated.new(root)]);
    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
        maxTooltipDistance: 0,
      })
    );

    // Create Y-axis
    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        extraMax: 0.1,
        maxDeviation: 0.1,
        extraTooltipPrecision: 1,
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Create X-Axis
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "day", count: 1 },
        
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
      })
    );

    xAxis.get("dateFormats")["day"] = "MM/dd";
    xAxis.get("periodChangeDateFormats")["day"] = "MMMM";

    var series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "작업량",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 5,
          fill: am5.color(0x435269),
        }),
      });
    });

    series.strokes.template.set("strokeWidth", 5);

    series
      .get("tooltip")
      .label.set("text", "[bold]{name}[/]\n{valueX.formatDate()}: {valueY}");
    series.data.setAll(lineGraphData); // 데이터 적용

    // Pre-zoom X axis
   /* series.events.once("datavalidated", (ev, target) => {
      xAxis.zoomToDates(new Date(2021, 0, 1), new Date(2022, 0, 1));
    });*/

    // Add legend
    var legend = chart.children.push(am5.Legend.new(root, {}));
    legend.data.setAll(chart.series.values);

    // Add cursor
    // chart.set(
    //   "cursor",
    //   am5xy.XYCursor.new(root, {
    //     behavior: "zoomXY",
    //     xAxis: xAxis,
    //   })
    // );

    // xAxis.set(
    //   "tooltip",
    //   am5.Tooltip.new(root, {
    //     themeTags: ["axis"],
    //   })
    // );

    // yAxis.set(
    //   "tooltip",
    //   am5.Tooltip.new(root, {
    //     themeTags: ["axis"],
    //   })
    // );
    // Add cursor
    var cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        xAxis: xAxis,
      })
    );
    cursor.lineY.set("visible", false);

    cursor.events.on("cursormoved", function (ev) {
      var x = ev.target.getPrivate("positionX");
      var y = ev.target.getPrivate("positionY");

      var dateX = xAxis.positionToDate(x);
      var valueY = xAxis.positionToValue(y);
    });

    // add scrollbar
    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, {
        orientation: "horizontal",
      })
    );

    return () => {
      root.dispose();
    };
  }, [lineGraphData, graphDuration]);

  return <div id={divName} style={{ width: "100%", height: "500px" }}></div>;
}

export default LineGraph;
