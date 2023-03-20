import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
} from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RoundIconBtn from "../components/RoundIconButton";

const MainScreen = ({ renderedCalendarNotes }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [date, setDate] = useState(new Date());
  const dayNow = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const [calendarNotes, setCalendarNotes] = useState(renderedCalendarNotes);
  const [toDoList, setToDoList] = useState(renderedCalendarNotes.toDoNotes);
  var year = date.getFullYear();
  var month = date.getMonth();
  var firstDay = new Date(year, month, 1).getDay();
  var maxDays = nDays[month];

  if (month == 1) {
    // February
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
      maxDays += 1;
    }
  }
  var numberOfDays = [];
  var n = firstDay;
  for (var i = 1; i < maxDays + 1; i++) {
    if (n > 6) {
      n = 0;
    }
    var day = weekDays[n];
    numberOfDays.push({
      name: i + ". " + day,
      id: i + "." + month + "." + year,
    });
    n++;
  }
  const findCalendarNotes = async () => {
    const result = await AsyncStorage.getItem("calendarNotes");
    if (result !== null) setCalendarNotes(JSON.parse(result));
  };
  const findToDoNotes = async () => {
    const result = await AsyncStorage.getItem("calendarNotes");
    const parsedResult = JSON.parse(result);
    if (result !== null) setToDoList(parsedResult.toDoNotes);
  };

  setMonth = (month) => {
    let monthNo = months.indexOf(month); // get month number
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).set("month", monthNo); // change month value
  };
  changeMonth = async (n) => {
    var newDateMs = date.setMonth(date.getMonth() + n);
    const newDate = new Date(newDateMs);
    setDate(newDate);
  };
  const renderItem = ({ item, index }) => {
    if (
      item.id ==
      `${dayNow.getDate()}.${dayNow.getMonth()}.${dayNow.getFullYear()}`
    ) {
      return (
        <View>
          <View style={styles.violetBackground}>
            {item.name.slice(-3) == "Sun" || item.name.slice(-3) == "Sat" ? (
              <Text style={styles.dayStyle("#be8eb3", "bold")}>
                {item.name}
              </Text>
            ) : (
              <Text style={styles.dayStyle("#5e5ea1", "bold")}>
                {item.name}
              </Text>
            )}
          </View>
          {renderNote(item, index)}
        </View>
      );
    } else {
      return (
        <View>
          <View style={styles.violetBackground}>
            {item.name.slice(-3) == "Sun" || item.name.slice(-3) == "Sat" ? (
              <Text style={styles.dayStyle("#613858", "normal")}>
                {item.name}
              </Text>
            ) : (
              <Text style={styles.dayStyle("#2f2f50", "normal")}>
                {item.name}
              </Text>
            )}
          </View>
          {renderNote(item, index)}
        </View>
      );
    }
  };
  const renderNote = (item, index) => {
    var currentYear = date.getFullYear();
    var currentMonth = months[date.getMonth()];
    if (calendarNotes[currentYear] !== undefined) {
      if (calendarNotes[currentYear][currentMonth] !== undefined) {
        if (calendarNotes[currentYear][currentMonth][index] !== undefined) {
          return (
            <TextInput
              editable
              onChangeText={(text) =>
                handleOnChangeTest(text, currentYear, currentMonth, index)
              }
              defaultValue={calendarNotes[currentYear][currentMonth][index]}
              placeholder="Note"
              textAlignVertical="top"
              style={[styles.textInputStyle(windowWidth)]}
              multiline={true}
            />
          );
        } else {
          return (
            <TextInput
              onChangeText={(text) =>
                handleOnChangeTest(text, currentYear, currentMonth, index)
              }
              placeholder="Note"
              textAlignVertical="top"
              style={[styles.textInputStyle(windowWidth)]}
              multiline={true}
            />
          );
        }
      } else {
        return (
          <TextInput
            onChangeText={(text) =>
              handleOnChangeTest(text, currentYear, currentMonth, index)
            }
            placeholder="Note"
            textAlignVertical="top"
            style={[styles.textInputStyle(windowWidth)]}
            multiline={true}
          />
        );
      }
    } else {
      return (
        <TextInput
          onChangeText={(text) =>
            handleOnChangeTest(text, currentYear, currentMonth, index)
          }
          placeholder="Note"
          textAlignVertical="top"
          style={[styles.textInputStyle(windowWidth)]}
          multiline
        />
      );
    }
  };
  const handleOnChangeTest = async (text, currentYear, currentMonth, index) => {
    if (calendarNotes[currentYear] === undefined) {
      calendarNotes[currentYear] = {};
    }
    if (calendarNotes[currentYear][currentMonth] === undefined) {
      calendarNotes[currentYear][currentMonth] = {};
    }
    calendarNotes[currentYear][currentMonth][index] = String(text);
    await AsyncStorage.setItem("calendarNotes", JSON.stringify(calendarNotes));
    findCalendarNotes();
  };

  const handleOnChangeToDoList = async (text) => {
    calendarNotes.toDoNotes = String(text);
    await AsyncStorage.setItem("calendarNotes", JSON.stringify(calendarNotes));
    findToDoNotes();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const ITEM_WIDTH = windowWidth / 4;
  const getItemLayout = (_, index) => {
    return {
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * (index - 1),
      index,
    };
  };
  const keyExtractor = (item) => item.id;
  return (
    <>
      <StatusBar />
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <Text style={styles.textTop}>{date.getFullYear()}</Text>
          <Text style={styles.textTop}>{months[date.getMonth()]}</Text>
        </View>
      </TouchableWithoutFeedback>
      <SafeAreaView style={styles.flatListContainer}>
        <FlatList
          data={numberOfDays}
          horizontal={true}
          initialScrollIndex={date.getDate() - 1}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          keyExtractor={keyExtractor}
        />
      </SafeAreaView>
      <View style={styles.toDoStyle(windowHeight)}>
        <View style={styles.lightVioletBackground}>
          <Text style={styles.textTop}>To Do</Text>
        </View>
        <TextInput
          onChangeText={(text) => handleOnChangeToDoList(text)}
          defaultValue={toDoList}
          placeholder="To Do List"
          textAlignVertical="top"
          style={[styles.textToDoStyle]}
          multiline={true}
        />
      </View>
      <RoundIconBtn
        onPress={() => changeMonth(-1)}
        antIconName={"left"}
        style={styles.leftBtn}
      />
      <RoundIconBtn
        onPress={() => changeMonth(+1)}
        antIconName={"right"}
        style={styles.rightBtn}
      />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    paddingTop: 20,
    backgroundColor: "#1c1c30",
    color: "white",
    alignItems: "center",
  },
  textTop: {
    fontWeight: "bold",
    fontSize: 22,
    color: "white",
    letterSpacing: 1,
  },
  flatListContainer: {
    flex: 1,
    color: "white",
  },
  violetBackground: {
    backgroundColor: "#1c1c30",
  },
  lightVioletBackground: {
    backgroundColor: "#2f2f50",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: "center",
  },
  dayStyle: (bcgColor, weight) => {
    return {
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      textAlign: "center",
      backgroundColor: bcgColor,
      borderColor: "#1c1c30",
      color: "white",
      fontWeight: weight,
    };
  },
  textInputStyle: (windowWidth) => {
    return {
      flex: 1,
      width: windowWidth / 4,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: "#1c1c30",
      paddingTop: 5,
      paddingBottom: 0,
      paddingLeft: 3,
      padingRight: 2,
    };
  },
  toDoStyle: (windowHeight) => {
    return {
      height: windowHeight / 4.5,
    };
  },
  textToDoStyle: {
    flex: 1,
    paddingLeft: 10,
    padingRight: 10,
  },
  leftBtn: {
    position: "absolute",
    left: 25,
    top: 20,
    zIndex: 1,
    backgroundColor: "#2f2f50",
    color: "white",
  },
  rightBtn: {
    position: "absolute",
    right: 25,
    top: 20,
    zIndex: 1,
    backgroundColor: "#2f2f50",
    color: "white",
  },
});
export default MainScreen;
