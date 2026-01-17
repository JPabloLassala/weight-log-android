import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import { useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import "../global.css";
import WeightChart from "../components/Chart";
import type { WeightEntry } from "../types/WeightEntry";
import DatePickerField from "./DatePickerField";
import ScaleSvg from "./ScaleSvg";
const tailwindConfig = require("../tailwind.config");

const Gradient = cssInterop(LinearGradient, { className: "style" });
const brandColors = tailwindConfig?.theme?.extend?.colors?.brand;
const accentColors = tailwindConfig?.theme?.extend?.colors?.accent;

const buildSeedEntries = (): WeightEntry[] => {
  const today = new Date();
  const weights = [80.2, 79.6, 78.9, 78.4, 77.8];

  return weights.map((weightValue, index) => {
    const entryDate = new Date(today);
    entryDate.setDate(today.getDate() - (weights.length - 1 - index) * 7);
    const entryIso = entryDate.toISOString();

    return {
      id: `seed-${index + 1}`,
      weight: weightValue,
      date: entryIso,
      createdAt: entryIso,
    };
  });
};

const seedEntries = buildSeedEntries();

export default function Index() {
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date());
  const [entries, setEntries] = useState<WeightEntry[]>(seedEntries);

  const sortedEntries = useMemo(
    () =>
      [...entries].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [entries],
  );
  const chartData = useMemo(
    () =>
      sortedEntries.map((entry) => ({
        x: new Date(entry.date),
        y: entry.weight,
      })),
    [sortedEntries],
  );
  const currentEntry = sortedEntries[sortedEntries.length - 1];
  const totalChange =
    sortedEntries.length > 1
      ? currentEntry.weight - sortedEntries[0].weight
      : 0;

  const handleAddEntry = () => {
    const normalized = weight.replace(",", ".");
    const parsedWeight = Number.parseFloat(normalized);
    if (!Number.isFinite(parsedWeight)) {
      return;
    }

    const entryDate = new Date(date);
    const entryIso = entryDate.toISOString();
    const nextEntry: WeightEntry = {
      id: `${entryDate.getTime()}-${Math.round(parsedWeight * 10)}`,
      weight: parsedWeight,
      date: entryIso,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [...prev, nextEntry]);
    setWeight("");
  };

  return (
    <View className="flex flex-1 flex-col items-center justify-start">
      <Gradient
        colors={[brandColors?.teal, brandColors?.tealAccent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex w-full flex-row pb-12 pt-14 items-center gap-3 px-4"
      >
        <View className="flex items-center justify-center rounded-xl bg-primary-foreground/20 p-4 bg-teal-400 backdrop-blur">
          <ScaleSvg color="#fff" style={{ transform: [{ scale: 1.2 }] }} />
        </View>
        <View className="flex flex-col gap-1">
          <Text className="text-white text-3xl font-semibold">
            Weight Tracker
          </Text>
          <Text className="text-white">Track your progress</Text>
        </View>
      </Gradient>
      <View className="mx-auto max-w-lg flex w-full px-6 gap-2">
        <View
          id="form-container"
          className="-mt-4 mb-6 space-y-4 flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm shadow-slate-200"
        >
          <View className="flex flex-row gap-3">
            <View className="flex-1 space-y-2">
              <Text className="text-sm font-medium text-slate-500">
                Weight (kg)
              </Text>
              <TextInput
                className="h-12 w-full rounded-md border border-slate-200 bg-white px-3 text-lg font-medium text-slate-900"
                keyboardType="decimal-pad"
                placeholder="70.5"
                placeholderTextColor="#94a3b8"
                value={weight}
                onChangeText={setWeight}
                inputMode="decimal"
              />
            </View>
            <DatePickerField date={date} onChange={setDate} />
          </View>
          <TouchableOpacity activeOpacity={0.85} onPress={handleAddEntry}>
            <Gradient
              colors={[brandColors?.teal, brandColors?.tealAccent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="inline-flex h-12 w-full flex-row items-center justify-center gap-2 rounded-xl px-4"
            >
              <FontAwesome name="plus" size={18} color="#fff" />
              <Text className="text-base font-semibold text-white">
                Add Entry
              </Text>
            </Gradient>
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-center justify-between gap-4">
          <View className="-mt-4 mb-6 space-y-4 flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm shadow-slate-200 flex-1">
            <Text>Current</Text>
            <Text className="text-4xl font-semibold">
              {currentEntry ? currentEntry.weight.toFixed(1) : "--"}
            </Text>
            <Text>kg</Text>
          </View>
          <View className="-mt-4 mb-6 space-y-4 flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm shadow-slate-200 flex-1">
            <Text>Change</Text>
            <View className="flex flex-row items-center gap-2">
              <FontAwesome6
                name={totalChange >= 0 ? "arrow-trend-up" : "arrow-trend-down"}
                size={24}
                color={accentColors?.orange ?? "#f6a623"}
              />
              <Text
                className="text-4xl font-semibold"
                style={{ color: accentColors?.orange ?? "#f6a623" }}
              >
                {totalChange >= 0 ? "+" : ""}
                {totalChange.toFixed(1)}
              </Text>
            </View>
            <Text>kg total</Text>
          </View>
        </View>
        <View className="flex flex-row items-center justify-between gap-4">
          <View className="-mt-4 mb-6 space-y-4 flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm shadow-slate-200 flex-1">
            <Text className="text-xl uppercase font-semibold text-slate-500">
              Progress
            </Text>
            <WeightChart
              data={chartData}
              lineColor={brandColors?.teal ?? "#11c8b0"}
              accentColor={brandColors?.tealAccent ?? "#3adfce"}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
