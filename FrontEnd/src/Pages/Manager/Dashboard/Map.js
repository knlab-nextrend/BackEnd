import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5geodata_lang_KO from "@amcharts/amcharts5-geodata/lang/KO";
function Map({getCountryMapChartData}) {
  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);
    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        //panX: "rotateX",
        projection: am5map.geoEquirectangular(),
      })
    );
    // let polygonSeries = chart.series.push(
    //   am5map.MapPolygonSeries.new(root, {
    //     geoJSON: am5geodata_worldLow,
    //     geodataNames: am5geodata_lang_KO,
    //     exclude: ["AQ"],
    //   })
    // );

    // Create polygon series
    var polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        geodataNames: am5geodata_lang_KO,
        exclude: ["AQ"],
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      interactive: true,
    });
    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0x435269),
    });

    polygonSeries.mapPolygons.template.states.create("country-select", {
      fill: am5.color(0x297373),
      stroke: am5.color(0x297373),
    });

    let selectedColumn;
    polygonSeries.mapPolygons.template.events.on("click", function (ev) {
      console.log("Clicked on a column", ev.target);
      /*
        let country = ev.target;

        if (selectedColumn) {
          country.states.applyAnimate("default");
          selectedColumn = undefined;
        }
        
        country.states.applyAnimate("country-select");
        selectedColumn = country;
*/
      var country = ev.target.dataItem.dataContext.name;
      var map;
      console.log(country);
      polygonSeries.zoomToDataItem(ev.target.dataItem);
      polygonSeries.hide();
      polygonSeries.show();
      getCountryMapChartData(country)
    });

    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
    return () => {
      root.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
}

export default Map;
