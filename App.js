/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  TextInput,
  SafeAreaView,
  FlatList,
  View,
  Text,
  Button,
} from 'react-native';
import {RealmProvider, RealmConsumer} from 'react-realm-context';

const SCHEMA = [
  {
    name: 'Item',
    primaryKey: 'id',
    properties: {
      id: 'int',
      title: 'string',
      description: 'string',
    },
  },
];

class Todo extends React.Component {
  state = {
    title: '',
    description: '',
  };

  handleTextChange = (key, text) => {
    this.setState({[key]: text});
  };

  handleAdd = () => {
    const {realm} = this.props;
    const {title, description} = this.state;
    const oldItems = realm.objects('Item');
    const hasItems = oldItems.length > 0;
    const lastItemId = hasItems ? oldItems[oldItems.length - 1].id : 1;

    realm.write(() => {
      realm.create('Item', {
        id: lastItemId + 1,
        title,
        description,
      });

      this.setState({
        title: '',
        description: '',
      });
    });
  };

  render() {
    const {realm} = this.props;
    const {title, description} = this.state;

    console.log(realm.objects('Item')[0]);

    return (
      <SafeAreaView>
        <View>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={this.handleTextChange.bind(null, 'title')}
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={this.handleTextChange.bind(null, 'description')}
          />
          <Button title="Add item" onPress={this.handleAdd} />
        </View>
        <View>
          <FlatList
            data={realm.objects('Item')}
            renderItem={({item}) => (
              <View>
                <Text style={{fontSize: 15}}>{item.title}</Text>
                <Text style={{fontSize: 10}}>{item.description}</Text>
              </View>
            )}
            keyExtractor={({id}) => `a1b${id}`}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const App = () => (
  <>
    <RealmProvider schema={SCHEMA}>
      <RealmConsumer updateOnChange>
        {({realm}) => <Todo realm={realm} />}
      </RealmConsumer>
    </RealmProvider>
  </>
);

export default App;
