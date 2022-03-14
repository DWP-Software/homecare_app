import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {useDispatch, useSelector} from 'react-redux';
import { endpoint } from '../../../config/API/service';
import {getInProgress, getPastOrders} from '../../../redux/action';
import { getData } from '../../../utils';
import ItemListFood from '../ItemListFood';
import Axios  from 'axios';
import { COLOR_BASE_PRIMARY_TEXT, COLOR_BASE_SECOND_TEXT, COLOR_ORANGE, FONT_BOLD, FONT_REGULAR } from '../../../styles';

const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={styles.tabIndicator}
    style={styles.tabBarStyle}
    tabStyle={styles.tabStyle}
    renderLabel={({route, focused}) => (
      <Text style={styles.tabText(focused)}>{route.title}</Text>
    )}
  />
);

const InProgress = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [data, setData] = useState([])
  const {inProgress} = useSelector((state) => state.orderReducer);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getInProgress());
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getInProgress());
    setRefreshing(false);
  };

  const getInProgress = () => (dispatch) => {
    getData('token').then((resToken) => {
        Axios.get(endpoint.order_income, {
          headers: {
            Authorization: resToken.value,
          },
        })
        .then((res) => {
          setData(res.data.data.orders)
        })
        .catch((err) => {
          showMessage(
            `${err} on In Progress API` ||
              'Terjadi Kesalahan di In Progress API',
          );
        });
    });
  };
  

  const ListItem = (item) => {
    return (
      <TouchableOpacity
      onPress={
        () => navigation.navigate('OrderDetail', {id : item.id})}
      >
        <View style={styles.conterItem}>
          <View style={{flexDirection : 'row', justifyContent :'space-between'}}>
           <Text style={styles.txtName}>{item.orderServices[0].service.name}</Text>
           <Text  style={styles.txtPrice}>{item.orderServices[0].quantity} {item.orderServices[0].service.base_unit}</Text>
          </View>
          <Text style={styles.txtContent}>{item.nurseUser.name}</Text>
          <View style={{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
          <Text style={styles.txtDate}> {item.createdAt}</Text>
            <Text style={styles.status(item.statusColorBackground, item.statusColorForeground)}>{item.statusText}</Text>
            </View>
        </View>
        </TouchableOpacity>
    )
}
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.containerInProgress}>
      <FlatList
            data={data}
            numColumns={1}
            renderItem={({ item }) => ListItem(item)}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
      </View>
    </ScrollView>
  );
};

const PastOrders = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [data, setData] = useState([])
  const {pastOrders} = useSelector((state) => state.orderReducer);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getPastOrders());
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getPastOrders());
    setRefreshing(false);
  };
  
  const getPastOrders = () => (dispatch) => {
    getData('token').then((resToken) => {
        Axios.get(endpoint.order, {
          headers: {
            Authorization: resToken.value,
          },
        })
        .then((res) => {
          console.log("data",res.data.data.orders )
          setData(res.data.data.orders)
        })
        .catch((err) => {
          showMessage(
            `${err} on In Progress API` ||
              'Terjadi Kesalahan di In Progress API',
          );
        });
    });
  };

  const ListItem = (item) => {
    return (
      <TouchableOpacity
      onPress={
        () => navigation.navigate('OrderDetail', {id : item.id})}
      >
        <View style={styles.conterItem}>
          <View style={{flexDirection : 'row', justifyContent :'space-between'}}>
           <Text style={styles.txtName}>{item.orderServices[0].service.name}</Text>
           <Text  style={styles.txtPrice}>{item.orderServices[0].quantity} {item.orderServices[0].service.base_unit}</Text>
          </View>
          <Text style={styles.txtContent}>{item.nurseUser.name}</Text>
          <View style={{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
          <Text style={styles.txtDate}> {item.createdAt}</Text>
            <Text style={styles.status(item.statusColorBackground, item.statusColorForeground)}>{item.statusText}</Text>
            </View>
        </View>
        </TouchableOpacity>
    )
}

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.containerPastOrders}>
      <FlatList
            data={data}
            numColumns={1}
            renderItem={({ item }) => ListItem(item)}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
      </View>
    </ScrollView>
  );
};

const initialLayout = {width: Dimensions.get('window').width};

const OrderTabSection = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: '1', title: 'Pesanan Untukmu'},
    {key: '2', title: 'Pesananmu'},
  ]);

  const renderScene = SceneMap({
    1: InProgress,
    2: PastOrders,
  });

  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={styles.tabView}
    />
  );
};

export default OrderTabSection;

const styles = StyleSheet.create({
  tabView: {backgroundColor: 'white'},
  tabIndicator: {
    backgroundColor: '#020202',
    height: 3,
    width: '15%',
    marginLeft: '3%',
  },
  tabBarStyle: {
    backgroundColor: 'white',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1,
  },
  tabStyle: {width: 'auto'},
  tabText: (focused) => ({
    fontFamily: 'Poppins-Medium',
    color: focused ? '#020202' : '#8D92A3',
  }),
  containerInProgress: {paddingTop: 8},
  containerPastOrders: {paddingTop: 8},
  conterItem: { margin: 5, padding: 15, borderColor: COLOR_BASE_SECOND_TEXT, borderWidth: 1, borderRadius: 12 },
conterBodyItem :  { flexDirection: 'row', margin: 5,},
txtName: { fontSize: 16, fontFamily: FONT_BOLD, color: COLOR_BASE_PRIMARY_TEXT },
txtAdd: { fontSize: 12, fontFamily: FONT_REGULAR, color: COLOR_BASE_SECOND_TEXT },
txtPrice: { fontSize: 14, fontFamily: FONT_BOLD, color: COLOR_ORANGE},
txtDate: { fontSize: 10, fontFamily: FONT_REGULAR, color: COLOR_BASE_SECOND_TEXT},
txtService: { fontSize: 12, fontFamily: FONT_REGULAR, color: COLOR_BASE_PRIMARY_TEXT},
status : (bgColor, txtColor) => ({ backgroundColor: bgColor, color: txtColor, paddingHorizontal: 6, paddingVertical: 7, borderRadius: 10, alignSelf : 'flex-end'})

});
