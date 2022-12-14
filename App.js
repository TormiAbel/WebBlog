import { ActivityIndicator, FlatList, StyleSheet, Text, View, Image, TextInput, Button, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

const BlogPostPreview = ({ id, title, content, imageUrl, navigation }) => {
  return (
    <View onClick={() => navigation.navigate('Details', { id, title, content, imageUrl })}>
      <Text style={{ fontSize: "32" }}>{title}</Text>
      <Text>{content}</Text>
      <Image
        style={{ width: 100, height: 100 }}
        source={{
          uri: imageUrl
        }}
      />
    </View>
  );
};

const BlogListScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getPostsFromApi = async () => {
    try {
      const response = await fetch('http://localhost:3000/posts');
      const json = await response.json();
      setData(json.posts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPostsFromApi();
  }, []);

  if (isLoading) {
    return <View style={styles.container}><ActivityIndicator /></View>
  }

  return <FlatList
    data={data}
    keyExtractor={({ id }, index) => id}
    renderItem={({ item }) => (
      <BlogPostPreview
        id={item.id}
        title={item.title}
        content={item.content}
        imageUrl={item.imageUrl}
        navigation={navigation}
      />
    )}
  />

}

const BlogDetailsScreen = () => {
  return (
    <View style={styles.container}>
      <BlogPostDetails
        id="1"
        title="kitty moment"
        content="i love "
        imageUrl="https://github.com/mxrguspxrt/mobile/raw/main/cat1.jpeg"
      />
    </View>
  );
}

const BlogPostDetails = ({ id, title, content, imageUrl }) => {
  const [name, onChangeName] = React.useState("jaik");
  const [comment, onChangeComment] = React.useState("tere, ma olen jaik");

  const sendComment = () => {
    fetch('http://localhost:3000/add-comment', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        comment,
        postId: id
      })
    });
  }

  const getCommentsFromApi = async () => {
    try {
      const response = await fetch('http://localhost:3000/post/:postId/comments');
      const json = await response.json();
      setData(json.posts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCommentsFromApi();
  }, []);

  return (
    <SafeAreaView>
      <Text style={{ fontSize: "32" }}>{title}</Text>
      <Text>{content}</Text>
      <Image
        style={{ width: 200, height: 200 }}
        source={{
          uri: imageUrl
        }}
      />
      <Text>Add comments here</Text>
      <Text>Name:</Text>
      <TextInput style={{ border: "1px solid black" }} value={name} onChangeText={onChangeName} />
      <Text>Comment:</Text>
      <TextInput style={{ border: "1px solid black" }} value={comment} onChangeText={onChangeComment} />
      <Button onPress={() => sendComment()} title="Send comment " />
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="guufi"
          component={BlogListScreen}
          options={{ title: 'The fitnessgram pacer test is a multi-stage aerobic capacity test' }}
        />
        <Stack.Screen name="Details" component={BlogDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}