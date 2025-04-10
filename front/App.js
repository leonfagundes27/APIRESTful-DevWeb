import { StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';

export default function App() {

  let addUser = () => {
    let PORT = 3000
    fetch(`http://localhost:${PORT}/add/`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Leon'
      }),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
  }

  return (
    <View>
      <Button
        title="ADICIONAR USUÁRIO"
        onPress={() => addUser()}
      />
    </View>
  );
}

const styles = StyleSheet.create({

});
