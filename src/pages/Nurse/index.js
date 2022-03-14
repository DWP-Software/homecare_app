import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { EmptyNurse, IcAsc, IcBack, IcDesc, IcError, IcHomeOff, IcRadioOff, IcRadioOn, IcSearch, ProfileDummy } from '../../assets';
import { Button, Gap, TextInput } from '../../components';
import ModalCenter from '../../components/molecules/ModalCenter';
import { API_HOST } from '../../config';
import { endpoint } from '../../config/API/service';
import { setLoading } from '../../redux/action';
import { COLOR_BASE_PRIMARY_DARK, COLOR_BASE_PRIMARY_MAIN, COLOR_BASE_PRIMARY_TEXT, COLOR_BASE_SECOND_TEXT, COLOR_ORANGE, COLOR_SHADOW, FONT_BOLD, FONT_MEDIUM, FONT_REGULAR, FONT_TITLE } from '../../styles';
import { getData, showMessage, useForm } from '../../utils';

const Nurse = ({ route, navigation }) => {

    const [form, setForm] = useForm({})
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [service_, setService_] = useState({});
    const [modalError, setModalError] = useState(false);
    const [data, setData] = useState([]);
    const [sort, setSort] = useState([])
    const [filter, setFilter] = useState([])
    const [modalFilter, setModalFilter] = useState(false)
    const [userProfile, setUserProfile] = useState({})
    const [sortClick, setSortClick] = useState({ 'sort': '', 'sortBy': '', label: '' })
    const [filterClick, setfilterClick] = useState('')
    const dispatch = useDispatch();

    useEffect(() => {
        const service = route.params;
        navigation.addListener('focus', () => {
            setService_(service.service)
            _getUserProfile()
            dispatch(_getData(navigation, service.service.id, page, sortClick));
        });
    }, [navigation]);

    const handleModalerror = () => {
        setModalError(!modalError)
    }

    const _getUserProfile = () => {
        getData('userProfile').then((resToken) => {
            setUserProfile(resToken)
        })
    }

    const _getData = (navigation, id, page, sortClick, sort = false, filterClick = null) => (dispatch) => {
        setIsLoading(false)
        getData('token').then((resToken) => {
            dispatch(setLoading(true));
            console.log("endpoint", endpoint.nurse(id, page) + `&sort=${sortClick.sortBy}&${filterClick}`)
            Axios.get(endpoint.nurse(id, page) + `&sort=${sortClick.sortBy}&${filterClick}`, {
                headers: {
                    Authorization: resToken.value,
                },
            })
                .then((res) => {
                    dispatch(setLoading(false));
                    if (!sort) {
                        const list = data.concat(res.data.data.users)
                        setData(list)
                    } else
                        setData(res.data.data.users)

                    setSort(res.data.data.sort)
                    setFilter(res.data.data.filter)
                })
                .catch((err) => {
                    dispatch(setLoading(false));
                    console.log('err', err?.response?.status)
                    const status = err?.response?.status;
                    if (status == 401) {
                        handleModalerror()
                    }
                });
        })
    };

    const onSort = (obj) => {
        if (obj.label == sortClick.label) {
            if (sortClick.sort == '') {
                setSortClick({ sort: 'ASC', sortBy: obj.asc, label: obj.label })
            } else if (sortClick.sort == 'ASC') {
                setSortClick({ sort: 'DESC', sortBy: obj.desc, label: obj.label })
            } else if (sortClick.sort == 'DESC') {
                setSortClick({ sort: '', sortBy: '', label: obj.label })
            }
        } else {
            setSortClick({ sort: 'ASC', sortBy: obj.asc, label: obj.label })
        }
        const p = 1
        setPage(p); // increase page by 1
        dispatch(_getData(navigation, service_.id, p, sortClick, true, filterClick));
        console.log(sortClick)
    }

    const onFilter = (obj, index) => {
        setForm(obj.attribute, index)
        console.log("onclick", obj.attribute)
        console.log("value", index)
        // setfilterClick(`NurseSearch[${obj.attribute}]=${index}`)
    }

    const onApply = () => {
        const p = 1
        setPage(p); // increase page by 1
        const ob = Object.keys(form)
        var fil = ''
        ob.map(item => {
            console.log('item', item)
            fil = `${fil}&NurseSearch[${item}]=${form[item]}`
        })
        setfilterClick(fil)
        dispatch(_getData(navigation, service_.id, p, sortClick, true, fil));
        console.log('filter', fil)
    }
    
    const renderHeader = () => {
        return (
            <View style={styles.container}>
                <View style={styles.containerHeader}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()}>
                        <View style={styles.back}>
                            <IcBack />
                        </View>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.title}>{service_.name}</Text>
                        {service_.description ?
                            <Text style={styles.desc}>{service_.description}</Text>
                            : null}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '80%' }}>
                        <TextInput
                            placeholder={"Cari Perawat berasarkan nama"}
                            value={form.name}
                            onChangeText={(value) => {
                                var fil = `NurseSearch[name]=${value}`
                                setfilterClick(`NurseSearch[name]=${value}`),
                                setForm('name', value)
                                dispatch(_getData(navigation, service_.id, 1, sortClick, true, fil))
                            }}
                        />
                    </View>
                    <Pressable onPress={() => setModalFilter(true)}>
                        <View style={styles.btnSearch}>
                            <IcSearch />
                        </View>
                    </Pressable>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    {sort.map(obj => {
                        return (
                            <Pressable onPress={() => onSort(obj)}>
                                <View style={styles.containerSort}>
                                    <Text style={styles.txtSort}>{obj.label}</Text>
                                    {sortClick.label == obj.label && (
                                        sortClick.sort == 'ASC' ?
                                            <IcAsc />
                                            : sortClick.sort == 'DESC' ? <IcDesc /> : null
                                    )}
                                </View>
                            </Pressable>
                        )
                    })}
                </View>
            </View>
        )
    }

    const renderModalError = () => {
        return (
            <ModalCenter
                visible={modalError}
                onError={true}
                navigation={navigation}
                btnText={"Login Kembali"}
            />

        )
    }

    const renderItem = (item, index) => {
        return (
            <View style={styles.conterItem}>
                <Image source={{ uri: item.photo }} style={{ height: 83, width: 74, borderRadius: 9 }} />
                <View style={{ marginLeft: 10, paddingRight: 30, width: '85%' }}>
                    <Text style={styles.txtName}>{item.name}</Text>
                    <Text style={styles.txtAdd}>{`${item.village.name}, ${item.subdistrict.name}`}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <View>
                            <Text style={styles.txtPrice}>{`Rp${item.price}`}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                {item.badges.map(obj => {
                                    return (
                                        <View style={{ backgroundColor: obj.colorForeground ? obj.colorForeground : '#E5E5E5', borderRadius: 5, padding: 5, marginRight: 3 }}>
                                            <Text style={{ fontSize: 10, fontFamily: FONT_REGULAR }}>{obj.label}</Text>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                        <Button text={"Pesan"} onPress={() => navigation.navigate("SetOrder", { item: item, service: service_, userProfile })} />
                    </View>

                </View>
            </View>
        )
    }

    const renderEmpty = () => {
        return (
            <View style={{ alignItems: 'center', margin: 20, paddingTop: 30 }}>
                <EmptyNurse />
                <Text style={styles.txtTitleModal}>Layanan ini belum memiliki perawat yang dapat kamu pilih</Text>
            </View>
        )
    }

    const renderFooter = () => {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (data.length % 20 != 0) return null;
        return (
            <View style={{ marginBottom: 100 }}>
                <Button text={"Load More"} onPress={handleLoadMore} />
            </View>
        );
    };

    const handleLoadMore = () => {
        if (!isLoading) {
            const p = page + 1
            setPage(p); // increase page by 1
            console.log(filterClick)
            dispatch(_getData(navigation, service_.id, p, sortClick, false, filterClick));
            console.log('page', page)
        }
    };

    return (
        <View style={[styles.page, data.length == 0 && { backgroundColor: 'white' }]}>
            {renderHeader()}
            <View style={styles.containerBody}>
                {data.length > 0 ?
                    <FlatList
                        data={data}
                        renderItem={({ item }) => renderItem(item)}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={isLoading}
                                onRefresh={() => dispatch(_getData(navigation, service_.id, 1, sortClick, true))}
                            />
                        }
                        ListFooterComponent={renderFooter.bind(this)}
                    // onEndReached={handleLoadMore.bind(this)}
                    />
                    : renderEmpty()}
                {renderModalError()}
            </View>
            <ModalCenter
                visible={modalFilter}
                onError={false}
                content={
                    <View>
                        {filter.map(obj => {
                            return (
                                <Pressable onPress={() => console.log('asc', obj.asc)}>
                                    <View style={styles.containerFilter}>
                                        <Text style={[styles.txtFilter, { fontFamily: FONT_BOLD }]}>{obj.label}</Text>
                                        {obj.type == 'radio' ?
                                            obj.value.map((radio, index) => {
                                                return (
                                                    <Pressable onPress={() => onFilter(obj, index)}>
                                                        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                                            {form[obj.attribute] == index ?
                                                                <IcRadioOn />
                                                                :
                                                                <IcRadioOff />
                                                            }
                                                            <Text style={[styles.txtFilter, { fontSize: 14 }]}>{radio}</Text>
                                                        </View>
                                                    </Pressable>
                                                )
                                            })
                                            :
                                            obj.type == 'group' ?
                                                <View style={{ flexDirection: 'row' }}>
                                                    {obj.items.map((item, index) => {
                                                        return (
                                                            <View style={{ padding: 5 }}>
                                                                <TextInput
                                                                    label={item.label}
                                                                    keyboardType={item.type == 'integer' ? 'numeric' : 'text'}
                                                                    value={form[item.attribute]}
                                                                    onChangeText={(value) => { setForm(item.attribute, value) }}
                                                                />
                                                            </View>
                                                        )
                                                    })}
                                                </View>
                                                : null}
                                    </View>
                                </Pressable>
                            )
                        })}
                    </View>
                }
                onPressClose={() =>  setModalFilter(false)}
                onPressButton={() => { onApply(), setModalFilter(false) }}
                btnText={'Terapkan'}
            />
        </View>
    );
};

export default Nurse;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        // backgroundColor : COLOR_SHADOW
    },
    containerSort: { backgroundColor: 'white', borderRadius: 5, padding: 5, marginRight: 5, flexDirection: 'row' },
    containerFilter: { padding: 5, marginRight: 5 },
    container: {
        backgroundColor: COLOR_BASE_PRIMARY_MAIN,
        paddingHorizontal: 24,
        paddingTop: 10,
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
        paddingBottom: 10,
    },
    containerHeader: {
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    conterItem: { flexDirection: 'row', margin: 5, padding: 15, borderColor: COLOR_SHADOW, backgroundColor: 'white', borderWidth: 1, borderRadius: 12 },
    containerBody: {
        height: Dimensions.get('window').height - 150,
        marginHorizontal: 16,
        marginVertical: 18,
    },
    btnSearch: { width: 50, backgroundColor: 'white', padding: 10, margin: 15, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
    title: { ...FONT_TITLE, color: 'white' },
    title2: {
        ...FONT_TITLE, color: 'white', padding: 10,
        marginLeft: -10
    },
    txtSort: { fontFamily: FONT_REGULAR, color: COLOR_BASE_PRIMARY_TEXT, fontSize: 12, marginRight: 5 },
    txtFilter: { fontFamily: FONT_REGULAR, color: COLOR_BASE_PRIMARY_TEXT, fontSize: 16, marginRight: 5, marginLeft: 5 },
    txtName: { fontSize: 16, fontFamily: FONT_BOLD, color: COLOR_BASE_PRIMARY_TEXT },
    txtAdd: { fontSize: 12, fontFamily: FONT_REGULAR, color: COLOR_BASE_PRIMARY_TEXT },
    txtPrice: { fontSize: 14, fontFamily: FONT_BOLD, color: COLOR_ORANGE, marginTop: 7 },
    desc: {
        fontFamily: FONT_REGULAR, fontSize: 12, color: 'white', paddingLeft: 10,
        marginLeft: -10
    },
    back: {
        padding: 10,
        marginLeft: -10,
    },
    txtTitleModal: {
        textAlign: 'center',
        fontFamily: FONT_REGULAR,
        fontSize: 14,
        marginTop: 20,
        color: COLOR_BASE_PRIMARY_TEXT
    },
});
