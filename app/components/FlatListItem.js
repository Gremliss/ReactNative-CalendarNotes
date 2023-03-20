class MyListItem extends React.PureComponent {
  render() {
    return (
      <View>
        <Text style={styles.dayStyle}>{item}</Text>
        {renderNote(item, index)}
      </View>
    );
  }
}

export default MyListItem;
