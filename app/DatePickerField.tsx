import FontAwesome from "@expo/vector-icons/FontAwesome";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRef, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

type Props = {
  date: Date;
  onChange: (date: Date) => void;
};

export default function DatePickerField({ date, onChange }: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const webDateInputRef = useRef<any>(null);
  const isWeb = Platform.OS === "web";

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);

  const handleNativeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    console.log("Date picker event:", event, "selectedDate:", selectedDate);
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (event.type === "set" && selectedDate) {
      onChange(selectedDate);
    }
  };

  const handleWebDateChange = (value: string) => {
    const next = new Date(value);
    if (!Number.isNaN(next.getTime())) {
      onChange(next);
    }
  };

  const openDatePicker = () => {
    console.log("Open date picker tap");
    if (isWeb) {
      const input = webDateInputRef.current;
      if (input?.showPicker) {
        input.showPicker();
      } else if (input?.click) {
        input.click();
      }
    } else {
      setShowDatePicker(true);
    }
  };

  return (
    <View className="flex-1 space-y-2">
      <Text className="text-sm font-medium text-slate-500">Date</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        className="inline-flex h-12 w-full flex-row items-center justify-start gap-2 rounded-md border border-slate-200 bg-white px-4"
        onPress={openDatePicker}
      >
        <FontAwesome name="calendar" size={16} color="#64748b" />
        <Text className="text-base font-medium text-slate-900">
          {dateLabel}
        </Text>
      </TouchableOpacity>
      {isWeb && (
        <input
          ref={webDateInputRef}
          type="date"
          onChange={(e: any) => handleWebDateChange(e.target.value)}
          style={{
            position: "absolute",
            opacity: 0,
            width: 0,
            height: 0,
          }}
        />
      )}
      {!isWeb && showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleNativeChange}
        />
      )}
    </View>
  );
}
