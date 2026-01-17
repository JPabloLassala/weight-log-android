import { format } from "date-fns";
import { useMemo } from "react";
import { useWindowDimensions, View } from "react-native";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
} from "victory-native";

type ChartPoint = {
  x: Date;
  y: number;
};

type Props = {
  data: ChartPoint[];
  lineColor?: string;
  accentColor?: string;
};

const axisLine = "#e2e8f0";
const tickLabel = "#64748b";
const yLandmarkStep = 20;
const defaultMaxLandmark = 100;
const defaultMinLandmark = 0;
const yPadding = 10;
const minLandmarks = 4;
const tickMultiple = 5;

const xAxisStyle = {
  axis: { stroke: axisLine },
  tickLabels: { fill: tickLabel, fontSize: 11, padding: 6 },
  grid: { stroke: axisLine, strokeDasharray: "4,4" },
};

const yAxisStyle = {
  axis: { stroke: axisLine },
  tickLabels: { fill: tickLabel, fontSize: 11, padding: 6 },
  grid: { stroke: axisLine, strokeDasharray: "4,4" },
};

export default function WeightChart({
  data,
  lineColor = "#11c8b0",
  accentColor = "#3adfce",
}: Props) {
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(380, Math.max(240, width - 80));
  const sortedData = useMemo(
    () => [...data].sort((a, b) => a.x.getTime() - b.x.getTime()),
    [data],
  );
  const xTickValues = useMemo(() => {
    const ticks: Date[] = [];
    const seen = new Set<number>();
    sortedData.forEach((point) => {
      const timestamp = point.x.getTime();
      if (!seen.has(timestamp)) {
        seen.add(timestamp);
        ticks.push(point.x);
      }
    });
    return ticks;
  }, [sortedData]);
  const yAxisConfig = useMemo(() => {
    if (sortedData.length === 0) {
      const steps = defaultMaxLandmark / yLandmarkStep;
      return {
        min: defaultMinLandmark,
        max: defaultMaxLandmark,
        ticks: Array.from(
          { length: steps + 1 },
          (_, index) => index * yLandmarkStep,
        ),
      };
    }

    const minWeight = sortedData.reduce(
      (min, point) => Math.min(min, point.y),
      Number.POSITIVE_INFINITY,
    );
    const maxWeight = sortedData.reduce(
      (max, point) => Math.max(max, point.y),
      Number.NEGATIVE_INFINITY,
    );

    const minDomain = minWeight - yPadding;
    const maxDomain = maxWeight + yPadding;
    const minTick = Math.ceil(minDomain / tickMultiple) * tickMultiple;
    const maxTick = Math.floor(maxDomain / tickMultiple) * tickMultiple;
    const tickRange = Math.max(0, maxTick - minTick);
    let step = Math.max(
      tickMultiple,
      Math.floor(tickRange / (minLandmarks - 1)),
    );
    step = Math.max(tickMultiple, Math.floor(step / tickMultiple) * tickMultiple);
    const ticks: number[] = [];

    for (let tick = minTick; tick <= maxTick; tick += step) {
      ticks.push(tick);
    }
    if (ticks.length < minLandmarks && minTick <= maxTick) {
      ticks.length = 0;
      for (let tick = minTick; tick <= maxTick; tick += tickMultiple) {
        ticks.push(tick);
      }
    }

    return {
      min: minDomain,
      max: maxDomain,
      ticks,
    };
  }, [sortedData]);
  const lastPoint = sortedData.length ? sortedData[sortedData.length - 1] : null;
  const yDomainMin = yAxisConfig.min;
  const yDomainMax = yAxisConfig.max;
  const yTickValues = yAxisConfig.ticks;

  return (
    <View className="w-full items-center">
      <VictoryChart
        width={chartWidth}
        height={200}
        padding={{ top: 16, bottom: 40, left: 48, right: 16 }}
        domainPadding={{ x: 12, y: 8 }}
        scale={{ x: "time" }}
        domain={{ y: [yDomainMin, yDomainMax] }}
      >
        <VictoryAxis
          tickValues={xTickValues}
          tickFormat={(value) => format(new Date(value), "dd/MM")}
          style={xAxisStyle}
        />
        <VictoryAxis dependentAxis tickValues={yTickValues} style={yAxisStyle} />
        <VictoryLine
          data={sortedData}
          interpolation="monotoneX"
          style={{ data: { stroke: lineColor, strokeWidth: 2 } }}
        />
        <VictoryScatter
          data={lastPoint ? [lastPoint] : []}
          size={4}
          style={{ data: { fill: accentColor } }}
        />
      </VictoryChart>
    </View>
  );
}
