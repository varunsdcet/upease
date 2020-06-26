import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    StatusBar,
    ImageBackground,
    Linking,
    Platform,
    BackHandler,
    Modal,
    PermissionsAndroid
} from 'react-native';
var status ;
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import Carousel,{ Pagination } from 'react-native-snap-carousel';
const window = Dimensions.get('window');
import Button from 'react-native-button';
const GLOBAL = require('./Global');
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import requestCameraAndAudioPermission from './requestCameraAndAudioPermission.js';
import { Dialog, DialogContent, DialogComponent, DialogTitle ,SlideAnimation,DialogButton} from 'react-native-dialog-component';
import moment from 'moment'
import { withNavigationFocus } from 'react-navigation';
import CheckBox from 'react-native-check-box'
import RBSheet from "react-native-raw-bottom-sheet";
import FastImage from 'react-native-fast-image'
import IndicatorCustom from './IndicatorCustom'


class Home extends Component {
    state = {
      activeSlide:0,
      activeSlides:0,
      modalVisible:false,
      isChecked:false,
      myBanners:[],
      visibles:false,
      visible_consult: false,
      myname:'',
      live_details:{},
      response_consult:{},
      myOffers:[],
      moviesList:[],
      speciality:[],
      status :'',
      hospitals:[],
      location:'',
      topDoctor:[],
      newslist:[],
      isshown:false,
      dimage:'',
      membersList:[
      {
        id: 1,
        name: 'Myself',
        image: require('./resources/myself.png'),
        is_sel: '1'
      },
      {
        id: 2,
        name: 'Rahul',
        image: require('./resources/rahul.png'),
        is_sel: '0'
      },
      ],

     wall:'0',

};


    static navigationOptions = ({ navigation }) => {
        return {
            header: () => null,
            animations: {
                setRoot: {
                    waitForRender: false
                }
            }
        }
    }


async requestCameraAndAudioPermission() {
//  this.RBSheet.open()
   try {
       const granted = await PermissionsAndroid.requestMultiple([
           PermissionsAndroid.PERMISSIONS.CAMERA,
           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
       ]);
       if (
           granted["android.permission.RECORD_AUDIO"] ===
           PermissionsAndroid.RESULTS.GRANTED &&
           granted["android.permission.CAMERA"] ===
           PermissionsAndroid.RESULTS.GRANTED
       ) {
           console.log("You can use the cameras & mic");
       } else {
           console.log("Permission denied");
       }
   } catch (err) {
       console.warn(err);
   }
}


  get pagination () {
          const { entries, activeSlide } = this.state;
          return (
              <Pagination
                dotsLength={this.state.myBanners.length}
                activeDotIndex={activeSlide}
                containerStyle={{ alignSelf:'flex-start',backgroundColor: 'transparent', marginTop:-20, marginLeft:-10, }}
                dotStyle={{
                    width: 20,
                    height: 6,
                    borderRadius: 5,
                    marginHorizontal: -5,
                    backgroundColor: '#1976D2'
                }}
                inactiveDotStyle={{
                  backgroundColor: '#DFDFDF'
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
              />
          );
      }



_renderItems = ({item, index}) =>{
        return (
          <TouchableOpacity
          onPress={() =>       this.props.navigation.navigate("ConsultNow")}
          activeOpacity={0.99}>
              <FastImage style={{width:wp('98%'), height:hp('27.5%'),borderRadius:0,marginTop:20,alignSelf:'center'}} source={{uri: item.image, priority: FastImage.priority.high,}}/>
              </TouchableOpacity>
        );
    }

   setModalVisible=(visible)=> {
        this.setState({modalVisible: visible});
    }


_renderItemss = ({item, index})=> {

        return (
          <TouchableOpacity
          onPress={() =>     this.props.navigation.navigate('ConsultNow')}
          activeOpacity={0.99}>
              <FastImage style={{width:wp('85%'), height:hp('15%'),borderRadius:15,marginLeft:-10,marginTop:25}} source={{uri : item.image}}/>
              </TouchableOpacity>
        );
    }

  addMoreAddress=()=>{
      this.setModalVisible(false)
      this.props.navigation.navigate('AddMember')
  }

  renderMembers=({item, index})=>{

     if (item.plusImage) {
          return (
            <>
            <TouchableOpacity onPress={()=> this.addMoreAddress()}>
            <View style={{width:wp(70),  flex:1, height:hp(8),
              backgroundColor:'white', flexDirection:'row', alignItems:'flex-start'            }}>
              <Image style={{height: 55, width:55 , resizeMode:'contain', backgroundColor:'white',alignSelf:'center' ,}}
                source={require("./resources/add_more.png")} />
                    <Text style = {{fontSize:16,fontFamily:'AvenirLTStd-Medium',color:'black',alignSelf:'center',marginLeft:wp(4),}}>
                    Add Member
                    </Text>
            </View>
            </TouchableOpacity>

      <View style={{width: wp(70), flexDirection: 'row', alignItems: 'center' , marginTop: 15}}>

        <CheckBox
            style={{padding: 10, marginTop:-20,}}
            onClick={()=>{
                 this.setState({
                     isChecked:!this.state.isChecked
                 })
               }}
            isChecked={this.state.isChecked}
            checkedImage={<Image source={require('./resources/ic_tick.png')} style={{width:22, height:22, resizeMode:'contain'}}/>}
            unCheckedImage={<Image source={require('./resources/ic_untick.png')} style={{width:22, height:22, resizeMode:'contain'}}/>}
        />

       <Text style={{fontSize: 12, color:'#757575', fontFamily: 'Avenir Roman',width:'85%', backgroundColor:'transparent'}}>
       I hereby declare that I am lawfully authorised to provide the above information on behalf of the owner
        of the information.
        </Text>
      </View>

          <TouchableOpacity style={{width:wp('40%'),borderRadius:5, marginTop:hp('3.5%'),
           backgroundColor:'#1976D2',height:hp('5%'),alignSelf:'center', marginRight:wp('2%')}}
           onPress={()=> this.yesMove()}>
          <View style={{width:'100%', height:hp('5%'), justifyContent:'center',alignItems:'center'}}>
          <Text style = {{color:'white',fontSize: 18,fontFamily:'AvenirLTStd-Heavy',
          alignSelf:'center'}}>
          Next
          </Text>
          </View>

          </TouchableOpacity>

            </>
          );
        }
    return(
      <TouchableOpacity onPress={()=> this.setModalVisible(false)}>
      <View style={{width:wp(70), height:hp(8),flexDirection:'row',marginTop:hp(2), }}>
      <Image style={{width:60, height:60, borderRadius:30,}} source={item.image}/>
      <Text style={{fontFamily:'AvenirLTStd-Medium', marginLeft:wp(4), fontSize:17, alignSelf:'center'}}>{item.name}</Text>
      {item.is_sel== '1' && (
      <Image style={{width:25, height:25, resizeMode:'contain', alignSelf:'center', position:'absolute', right:10}} source={require('./resources/check.png')}/>
      )}
      </View>
       <View style={{width:wp(70), height:0.5,backgroundColor:'#D8D8D8', marginVertical:hp(2) }}/>
       </TouchableOpacity>
      )
}

  yesMove=()=>{
    this.setModalVisible(false)
    this.props.navigation.navigate('ConsultNow')
  }

    selectedFirst = (item, index) =>{
      // this.setModalVisible(true)
      GLOBAL.tag_name = item.name
      GLOBAL.tag_item = item

      this.props.navigation.navigate('ConsultNow')
    }

    selectedFirstCateg = (item, index) =>{
      // this.setModalVisible(true)
      GLOBAL.tag_names = item.name
      GLOBAL.tag_items = item

      this.props.navigation.navigate('ConsultNow')
    }


_handleStateChange = state => {
  this.setState({location:GLOBAL.location})
    var d = new Date()
    GLOBAL.gldate = d.getDate(); // 11
    GLOBAL.glmonth =  d.getMonth()+1; // 0  month is like array so you have to do +1 for correct month
    GLOBAL.glyear =  d.getFullYear(); // 1933

    var time = moment().format('HH:mm')

    GLOBAL.glhour = moment().hour();
    GLOBAL.glminute = moment().minutes();

    console.warn('-->times' + GLOBAL.glhour +'-->'+GLOBAL.glminute)
    console.warn('-->'+ GLOBAL.gldate+'-->'+GLOBAL.glmonth+'-->'+GLOBAL.glyear)

    this.loadHome()
    this.dynamicHome()
 };

    openHospital=(item, index)=>{
//      alert(JSON.stringify(item))

      this.props.navigation.navigate('ChooseHospital')
    }

    openDoctorDetails=(item, index)=>{
      GLOBAL.doc_item = item
      GLOBAL.doc_id = item.id
      this.props.navigation.navigate('DoctorDetails')
    }






_renderItemTopDoctor=({item, index})=>{
  var docName = this.capitalizeFirstLetter(item.name)
  var speName = this.capitalizeFirstLetter(item.specialty)
  var langName = this.capitalizeFirstLetter(item.languages)
  var degrees = item.dr_degree_array.toString()
  var price = parseInt(item.online_consult_price)
  return(
    <TouchableOpacity style={{width:wp('42%'), height:hp(36), margin:15,marginLeft:10,marginRight:5,marginTop:10,marginBottom:10,backgroundColor:'white',}}
    activeOpacity={0.99}
    onPress={()=> this.openDoctorDetails(item, index)}>
      <View style  = {{width:'100%',height:'100%', backgroundColor:'white',shadowColor: "#000",
          elevation:4, flexDirection:'column',borderRadius:5,
      }}>
    <Image style={{width:'93%',backgroundColor:'transparent', height:hp(18), resizeMode:'cover',margin:7}} source={{uri: item.image}}/>

    <View style={{width:wp(14), borderRadius:5,height:hp(3), backgroundColor:'#1976D2',
     justifyContent:'center', position:'absolute', right:10, top:hp(15.5)}}>
    <Text style = {{fontSize:13,fontFamily:'Avenir Roman',color:'white',alignSelf:'center'}}>
    ₹ {price}
    </Text>
    </View>
    <Text style = {{fontSize:15,fontFamily:'AvenirLTStd-Heavy',color:'#1976D2',marginLeft:7, marginTop:5, marginRight:7}}
    numberOfLines={1}>
        {docName}
    </Text>

    <Text style = {{fontSize:14,fontWeight:'bold',fontFamily:'AvenirLTStd-Heavy',color:'black',marginLeft:7, marginTop:3, marginRight:7}}
    numberOfLines={1}>
        {item.experience} years exp
    </Text>

    <Text style = {{fontSize:15,fontFamily:'AvenirLTStd-Medium',color:'gray',marginLeft:7, marginTop:3, marginRight:7}}
    numberOfLines={1}>
        {degrees}
    </Text>

    <Text style = {{fontSize:15,fontFamily:'AvenirLTStd-Medium',color:'black',marginLeft:7, marginTop:3, marginRight:7}}
    numberOfLines={1}>
        {speName}
    </Text>

    <Text style = {{fontSize:15,fontFamily:'AvenirLTStd-Medium',color:'gray',marginLeft:7, marginTop:3, marginRight:7}}
    numberOfLines={1}>
        {langName}
    </Text>

      </View>
    </TouchableOpacity>
  )
}



    _renderItemproducts = ({item, index}) => {
        return (
            <TouchableOpacity style={{width:wp('19%'), margin:10,marginTop:10,marginBottom:30, height:hp('10%')}}
            onPress={() => this.selectedFirst(item, index)}
            activeOpacity={0.99}>
                <View   style  = {{width:'100%', height:'100%',backgroundColor:'white',shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,borderRadius:18,
                    shadowRadius: 3.84,elevation:4, flexDirection:'column',alignItems:'center', justifyContent:'center'
                }}
                >
              <Image source={{uri: item.image}}
                     style  = {{width:35, height:35,alignSelf:'center',resizeMode:'contain'}}/>
                </View>

              <Text style = {{fontSize:15,marginTop:10,fontFamily:'AvenirLTStd-Medium',color:'#222222',textAlign:'left',}}
              numberOfLines={1}>
                  {item.name}
              </Text>

            </TouchableOpacity>
        )
    }


_renderItemHospitalImageList=({item, index})=>{
    return(
            <TouchableOpacity style={{width:wp('29%'), margin:15,marginLeft:10,marginRight:5,marginTop:10,marginBottom:10, height:hp('15%')}}
            onPress={() => this.openHospital(item, index)}
            activeOpacity={0.99}>
                <View   style  = {{width:'100%', height:'100%',backgroundColor:'white',shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,borderRadius:18,
                    shadowRadius: 3.84,elevation:4, flexDirection:'column',alignItems:'center', justifyContent:'center'
                }}
                >
              <Image source={{uri: item.image}}
                     style  = {{width:'80%', height:'80%',alignSelf:'center',resizeMode:'contain'}}/>
                </View>
            </TouchableOpacity>
    )
}

 capitalizeFirstLetter=(string)=> {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

  _renderSpeciality=({item, index})=>{

    var spName = this.capitalizeFirstLetter(item.name.toLowerCase())

    return(
      <TouchableOpacity style={{width:wp('27.5%'), margin:10,marginRight:5,marginTop:10,marginBottom:10, height:hp('16%')}}
      onPress={() => this.selectedFirst(item, index)}
      activeOpacity={0.99}>
          <View   style  = {{width:'100%', height:'100%',backgroundColor:'white',shadowColor: "#000",
              shadowOffset: {
                  width: 0,
                  height: 2,
              },
              shadowOpacity: 0.25,borderRadius:18,padding:0,
              shadowRadius: 3.84,elevation:4, flexDirection:'column', justifyContent:'center'
          }}
          >

      <ImageBackground style={{width:'100%', height:'100%', borderRadius:18}} source={require('./resources/sp_bg.png')}>
        <Image source={{uri: item.image}}
               style  = {{width:42, height:42,resizeMode:'contain', margin:10}}/>

              <Text style = {{fontSize:14,margin:10,fontFamily:'AvenirLTStd-Heavy',color:'#222222',textAlign:'left'}}
              numberOfLines={3}>
                  {spName}
              </Text>

          </ImageBackground>
          </View>
      </TouchableOpacity>
    )
  }


  newsRender=({item, index})=>{

    return(

    <TouchableOpacity style={{width:wp('68%'), height:hp(32),borderRadius:12, margin:10,marginLeft:5,marginRight:10,marginTop:10,marginBottom:10,backgroundColor:'white',}}
    activeOpacity={0.99}
    onPress={()=> this.openNews(item, index)}>
      <View style  = {{width:'100%',height:'100%', backgroundColor:'white',shadowColor: "#000",
          elevation:4, flexDirection:'column',borderRadius:12,
      }}>
    <Image style={{width:'100%',backgroundColor:'transparent',borderTopLeftRadius:12, borderTopRightRadius:12, height:hp(18), resizeMode:'cover',}} source={{uri: item.image}}/>

    <Text style = {{fontSize:12,fontFamily:'AvenirLTStd-Medium',color:'gray',marginLeft:10, marginTop:10,}}
    numberOfLines={1}>
        {item.date}
    </Text>

    <Text style = {{fontSize:17,fontFamily:'AvenirLTStd-Heavy',color:'black',marginLeft:10, marginTop:5, marginRight:7}}
    numberOfLines={1}>
        {item.title}
    </Text>

    <Text style = {{fontSize:14,fontFamily:'Avenir Roman',color:'gray',marginLeft:10, marginTop:5, marginRight:7}}
    numberOfLines={2}>
        {item.subhead}
    </Text>

      </View>
    </TouchableOpacity>

    )
  }

  openNews=(item, index)=>{
    this.props.navigation.navigate('ViewNews', {news_id: item.id})
  }

    showLoading() {
        this.setState({loading: true})
    }

    hideLoading() {
        this.setState({loading: false})
    }

    joinConsult=()=>{
      console.log(JSON.stringify({
                    booking_id: GLOBAL.booking_id,
                    what: "2",
                    from: "user"
                  }))
//      this.setState({visible_consult: false})

      if(GLOBAL.is_chat_or_video_start =='1'){
                const url = GLOBAL.BASE_URL + "start_status_online_consult";

                fetch(url, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },

                  body: JSON.stringify({
                    booking_id: GLOBAL.booking_id,
                    what: "2",
                    from: "user"
                  })
                })
                  .then(response => response.json())
                  .then(responseJson => {
//                    GLOBAL.bookingid = item.chat_g_id;

                    if (responseJson.status == true) {
                      if (GLOBAL.booking_type == "chat") {
                        this.props.navigation.navigate("Chat");
                      } else if(GLOBAL.booking_type == 'audio'){
//                        GLOBAL.bookingid = item.chat_g_id;
                        this.props.navigation.navigate("AudioCall", {
                          channelName: GLOBAL.chat_g_id,
                          onCancel: message => {
                            this.setState({
                              visible: true,
                              message
                            });
                          }
                        });
                      } else {
//                        GLOBAL.bookingid = item.chat_g_id;
                        this.props.navigation.navigate("VideoCall", {
                          channelName: GLOBAL.chat_g_id,
                          onCancel: message => {
                            this.setState({
                              visible: true,
                              message
                            });
                          }
                        });
                      }
                    } else {
                    }
                  })
                  .catch(error => {
                    console.error(error);
                    //this.hideLoading()
                  });

      }else{

                      if (GLOBAL.booking_type == "chat") {
                        this.props.navigation.navigate("Chat");
                      } else if(GLOBAL.booking_type == 'audio'){
//                        GLOBAL.bookingid = item.chat_g_id;
                        this.props.navigation.navigate("AudioCall", {
                          channelName: GLOBAL.chat_g_id,
                          onCancel: message => {
                            this.setState({
                              visible: true,
                              message
                            });
                          }
                        });
                      } else {
//                        GLOBAL.bookingid = item.chat_g_id;
                        this.props.navigation.navigate("VideoCall", {
                          channelName: GLOBAL.chat_g_id,
                          onCancel: message => {
                            this.setState({
                              visible: true,
                              message
                            });
                          }
                        });
                      }

      }
    }


    componentDidMount(){
    // this.loadHome()

//      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    var d = new Date()
    GLOBAL.gldate = d.getDate(); // 11
    GLOBAL.glmonth =  d.getMonth()+1; // 0  month is like array so you have to do +1 for correct month
    GLOBAL.glyear =  d.getFullYear(); // 1933
    GLOBAL.gl_currYear = d.getFullYear();
    var time = moment().format('HH:mm')

    GLOBAL.glhour = moment().hour();
    GLOBAL.glminute = moment().minutes();

    console.warn('-->times' + GLOBAL.glhour +'-->'+GLOBAL.glminute)
    console.warn('-->'+ GLOBAL.gldate+'-->'+GLOBAL.glmonth+'-->'+GLOBAL.glyear)

      if (Platform.OS === 'android') {                    //Request required permissions from Android
          this.requestCameraAndAudioPermission().then(_ => {
              console.log('requested!');
          });
        }


      this.props.navigation.addListener('focus',this._handleStateChange);
        // this.props.navigation.addListener('willBlur',()=>{ //called when screen goes out of focus
    // BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    }


    componentWillUnmount() {
        // BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
      //  NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }


  handleBackButton = () => {
    if (this.props.isFocused) {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit easeMyMed app?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          {
            text: 'OK',
            onPress: () => BackHandler.exitApp()
          }
        ],
        {
          cancelable: false
        }
      );
      return true;
    }
  };

    dynamicHome=()=>{
    const url = GLOBAL.BASE_URL +  'home_user_dynamics'

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "user_id":GLOBAL.user_id
        }),
    }).then((response) => response.json())
        .then((responseJson) => {
           // console.log(JSON.stringify(responseJson))


            if (responseJson.status == true) {

                GLOBAL.startConsultation = responseJson.is_chat_or_video_start
                GLOBAL.chat_g_id = responseJson.chat_g_id
                GLOBAL.startConsuldocBookType = responseJson.booking_type
                GLOBAL.startConsulBid = responseJson.booking_id
                GLOBAL.startConsulId = responseJson.chat_g_id
                GLOBAL.chat_g_id = responseJson.chat_g_id
                GLOBAL.startConsuldocName = responseJson.doctor_name
                GLOBAL.startConsuldocId = responseJson.doctor_id
                GLOBAL.startConsuldocImage = responseJson.doctor_image
 this.setState({dimage:responseJson.doctor_image})
                if(GLOBAL.startConsultation == 0 ){
                //  this.setState({isshown:true})
//this.dialogComponents.show();
                }else{
                          this.setState({isshown:true})
                //   this.dialogComponents.show();
                }

                //recursive call
               this.dynamicHome()
            }

        })
        .catch((error) => {
            console.error(error);
           // this.hideLoading()
        });

    }

    loadHome=()=>{
      const url = GLOBAL.BASE_URL + "home_user";
        this.showLoading()
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: GLOBAL.user_id,

        })
      })
        .then(response => response.json())
        .then(responseJson => {
          // console.log(JSON.stringify(responseJson));
         this.hideLoading();
          if (responseJson.status == true) {

                  this.setState({ myBanners: responseJson.headbanners,
                    moviesList : responseJson.symtoms,
                    myOffers : responseJson.midbanners,
                    speciality: responseJson.specialty,
                    hospitals: responseJson.best_hospital,
                    topDoctor : responseJson.top_doctor,
                    newslist : responseJson.news,
                    myname: responseJson.user_detail.name,
                   })

                  GLOBAL.userDetails = responseJson.user_detail
                  GLOBAL.userDetails.dob = moment(GLOBAL.userDetails.dob, 'DD-MM-YYYY').format('YYYY-MM-DD')
                 // console.log(JSON.stringify(responseJson.user_detail))

                  if(responseJson.user_detail.status=='0'){
                      AsyncStorage.removeItem('userID');
                      this.props
                          .navigation
                          .dispatch(StackActions.reset({
                              index: 0,
                              actions: [
                                  NavigationActions.navigate({
                                      routeName: 'Login',
                                      params: { someParams: 'parameters goes here...' },
                                  }),
                              ],
                          }))
                 }

          } else {
            alert(
              "Something went wrong!"
            );
         }
        })
        .catch(error => {
  //        this.hideLoading();
          console.error(error);
        });

    }


    handleConnectionChange = (isConnected) => {

            this.setState({ status: isConnected });
            if (this.state.status == false){
                alert('You are not connected to Internet')
            }
            console.log(`is connected: ${this.state.status}`);
        }


    buttonOkJoin=()=>{
            this.setState({visible_consult:false})
                this.setState({isshown:false})
            //this.dialogComponents.dismiss()
            this.props.navigation.navigate('Chat')
//                this.joinConsult()
    }

    navigateTo=(scrName)=>{
      this.props.navigation.navigate(scrName)
    }

    render() {
      if(this.state.loading){
        return(
          <IndicatorCustom/>
        )
      }
        return (
        <>
              <ScrollView style={styles.container}
              nestedScrollEnabled={true}>
              <StatusBar backgroundColor={'black'}/>
              <View style = {{width :wp('100%'),height:hp('8%'), backgroundColor:'white'}}
              >

                <View style ={{width:wp('100%'),flexDirection:'row',justifyContent:'space-between',height:hp('8%')}}>
                    <View style={{margin:15, width:wp('95%'), height:'auto', flexDirection:'row', elevation:5}}>

                    <Image style={{width:43, height:43, resizeMode:'contain'}}
                    source={require('./resources/logo.png')}/>
                    <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Location')}>
                    <View style={{flexDirection:'column',marginLeft:8 }}>
                    <Text style = {{color:'#222222',fontSize: 14,fontFamily:'AvenirLTStd-Medium',}}>
                    Hi {this.state.myname}
                    </Text>

                    <View style={{flexDirection:'row',}}>
                    <Image style={{width:16, height:16, resizeMode:'contain'}}
                    source={require('./resources/loc.png')}/>


                    <Text style = {{color:'#222222',fontSize: 14,fontFamily:'AvenirLTStd-Heavy', alignSelf:'center'}}>
                    {this.state.location}
                    </Text>

                    </View>
                    </View>
                    </TouchableOpacity>


                    <View style={{width:'25%', flexDirection:'row', alignItems:'center',justifyContent:'center'
                    , height:'100%', backgroundColor:'white',position:'absolute', right:1, top:1}}>

                    <TouchableOpacity
                    onPress={() => this.navigateTo('FindAndBook')}>
                    <Image style={{width:30, height:30, resizeMode:'contain'}}
                    source={require('./resources/ic_search.png')}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={{marginLeft:wp(5)}}
                    onPress={() => this.navigateTo('Notification')}>
                    <Image style={{width:30, height:30, resizeMode:'contain'}}
                    source={require('./resources/notification.png')}/>
                    </TouchableOpacity>

                    </View>
                  </View>

                  </View>
                  </View>


                  <View style = {{width :wp('100%'),alignSelf:'center',alignItems:'center',margin:0,marginTop:hp('0%'), backgroundColor:'#FAFAFA'}}>


                  <Carousel
                             ref={(c) => { this._carousel = c; }}
                             data={this.state.myBanners}
                             renderItem={this._renderItems}
                             sliderWidth={wp('95%')}
                             itemWidth={wp('95%')}
                             layout={'default'} layoutCardOffset={18}
                             onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                           />


                    <View style={{width:wp('93%'), justifyContent:'space-between', flexDirection:'row', marginTop:hp('3%')}}>
                    <Text style = {{color:'black',fontSize: 18,fontFamily:'AvenirLTStd-Heavy',marginLeft:3, marginTop:2,alignSelf:'flex-start'}}>
                    Symptoms
                    </Text>
                    <TouchableOpacity style={{width:wp(19),height:25.5,backgroundColor:'#1976D2', padding:5, borderRadius:20}}
                    onPress={()=>this.props.navigation.navigate('ViewAllSymptoms')}>
                   <Text style = {{color:'white',fontSize: 12,fontFamily:'AvenirLTStd-Medium',alignSelf:'center'}}>
                   View all</Text>
                   </TouchableOpacity>
                    </View>

                    <FlatList style= {{flexGrow:0,marginTop:hp('1%'),marginLeft:3,width:window.width - 10}}
                              data={this.state.moviesList}
                              numColumns={4}
                              keyExtractor = { (item, index) => index.toString() }
                              renderItem={this._renderItemproducts}
                              extraData={this.state}
                    />

                  <Carousel
                             ref={(c) => { this._carousel = c; }}
                             data={this.state.myOffers}
                             renderItem={this._renderItemss}
                             sliderWidth={wp('100%')}
                             itemWidth={wp('85%')}
                             layout={'default'}
                             onSnapToItem={(index) => this.setState({ activeSlides: index }) }
                           />



                    <View style={{width:wp('93%'), justifyContent:'space-between', flexDirection:'row', marginTop:hp('3%')}}>
                    <Text style = {{color:'black',fontSize: 18,fontFamily:'AvenirLTStd-Heavy',marginLeft:5, marginTop:2,alignSelf:'flex-start'}}>
                    Specialities
                    </Text>
                    <TouchableOpacity style={{width:wp(19),height:25.5,backgroundColor:'#1976D2', padding:5, borderRadius:20,}}
                    onPress={()=>this.props.navigation.navigate('ViewAllSpeciality')}>
                   <Text style = {{color:'white',fontSize: 12,fontFamily:'AvenirLTStd-Medium',alignSelf:'center'}}>
                   View all</Text>
                   </TouchableOpacity>
                    </View>


                    <FlatList style={{flexGrow:0,marginTop:10,marginLeft:0}}
                              data={this.state.speciality}
                              nestedScrollEnabled={true}
                              numColumns={3}
                              ref={ref => { this.flatList_Ref = ref;}}
                              keyExtractor = { (item, index) => index.toString() }
                              renderItem={this._renderSpeciality}
                              extraData={this.state}
                    />


                    <View style={{width:wp('93%'), justifyContent:'space-between', flexDirection:'row', marginTop:hp('3%')}}>
                    <Text style = {{color:'black',fontSize: 18,fontFamily:'AvenirLTStd-Heavy',marginLeft:5, marginTop:2,alignSelf:'flex-start'}}>
                    Select Doctors from {`\n`}Best Hospitals
                    </Text>
                    <TouchableOpacity style={{width:wp(19),height:25.5,backgroundColor:'#1976D2', padding:5, borderRadius:20}}
                    onPress={()=>this.props.navigation.navigate('ViewAllHospitals')}>
                   <Text style = {{color:'white',fontSize: 12,fontFamily:'AvenirLTStd-Medium',alignSelf:'center'}}>
                   View all</Text>
                   </TouchableOpacity>
                    </View>



                    <FlatList style={{flexGrow:0,marginTop:10, marginLeft:5, marginRight:5}}
                              data={this.state.hospitals}
                              nestedScrollEnabled={true}
                              ref={ref => { this.flatList_Ref = ref;}}
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}
                              keyExtractor = { (item, index) => index.toString() }
                              renderItem={this._renderItemHospitalImageList}
                              extraData={this.state}
                    />



                    <View style={{width:wp('93%'), justifyContent:'space-between', flexDirection:'row', marginTop:hp('2%')}}>
                    <Text style = {{color:'black',fontSize: 18,fontFamily:'AvenirLTStd-Heavy',marginLeft:5, marginTop:2,alignSelf:'flex-start'}}>
                    Top Doctor's
                    </Text>
                    <TouchableOpacity style={{width:wp(19),height:25.5,backgroundColor:'#1976D2', padding:5, borderRadius:20}}
                    onPress={()=>this.props.navigation.navigate('ChooseDoctor')}>
                   <Text style = {{color:'white',fontSize: 12,fontFamily:'AvenirLTStd-Medium',alignSelf:'center'}}>
                   View all</Text>
                   </TouchableOpacity>
                    </View>



                    <FlatList style= {{flexGrow:0,marginTop:10, marginLeft:5,marginRight:5}}
                              data={this.state.topDoctor}
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}
                              keyExtractor = { (item, index) => index.toString() }
                              renderItem={this._renderItemTopDoctor}
                              extraData ={this.state}
                    />

                    <View style={{width:wp('93%'), justifyContent:'space-between', flexDirection:'row', marginTop:hp('2%')}}>
                    <Text style = {{color:'black',fontSize: 18,fontFamily:'AvenirLTStd-Heavy',marginLeft:5, marginTop:2,alignSelf:'flex-start'}}>
                    News
                    </Text>
                    <TouchableOpacity style={{width:wp(19),height:25.5,backgroundColor:'#1976D2', padding:5, borderRadius:20}}
                    onPress={()=>this.props.navigation.navigate('ViewAllNews')}>
                   <Text style = {{color:'white',fontSize: 12,fontFamily:'AvenirLTStd-Medium',alignSelf:'center'}}>
                   View all</Text>
                   </TouchableOpacity>
                    </View>



                    <FlatList style= {{flexGrow:0,marginLeft:10,marginTop:10, marginBottom:20, marginRight:5}}
                              data={this.state.newslist}
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}
                              keyExtractor = { (item, index) => index.toString() }
                              renderItem={this.newsRender}
                              extraData ={this.state}
                    />


                  </View>


              </ScrollView>


        {this.state.isshown == true && (
          <View style = {{position:'absolute',bottom:0,elevation:12}}>

                      <View style={{flexDirection:'column', width:wp(100),alignSelf:'center',backgroundColor:'white', height:140,elevation:12}}>


                  <Text style = {{color:'black',fontSize: 18,width:'85%',fontFamily:'AvenirLTStd-Medium',fontWeight:'bold', marginTop:15,alignSelf:'center', lineHeight:23}}>
                  Ongoing Consultation
                  </Text>
<View style = {{ flexDirection:'row'}}>
<Image style = {{width:50,height:50,margin:10}}
source={{uri: this.state.dimage, priority: FastImage.priority.high,}}/>
                  <Text style = {{color:'gray',fontSize: 16,width:'65%',fontFamily:'Avenir Roman', marginTop:10, lineHeight:23}}>
                  You have an ongoing consultation please join
                  </Text>



                  <TouchableOpacity
                  onPress={() =>       this.buttonOkJoin()}
                  activeOpacity={0.99}>
                  <Image style={{height: 55, width:55 , resizeMode:'contain', backgroundColor:'white',alignSelf:'center' ,}}
                    source={require("./resources/call.png")} />
                    </TouchableOpacity>


                      </View>
                      </View>

                      </View>
        )}




       <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={300}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center"
            }
          }}
        >
        <Text>asd</Text>
        </RBSheet>

        <Modal
           animationType="slide"
           transparent={true}
           visible={this.state.modalVisible}
           onRequestClose={() => {
//             Alert.alert('Modal has been closed.');
             this.setModalVisible(!this.state.modalVisible)
           }}>
               <TouchableOpacity style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  alignItems: 'center', borderRadius:0}}
                  activeOpacity={1}
                  onPressOut={() => {this.setModalVisible(true)}}
                  >
                  <View style={{width: wp(80),backgroundColor: 'white',height: hp(60), borderRadius:18}}>
                    <View style={{width: '100%',  backgroundColor:'white', borderRadius:18}}>
                    <View style={{flexDirection:'row', width:'100%', backgroundColor:'white', height:60,
                     borderTopLeftRadius:18, borderTopRightRadius:18, borderTopLeftWidth:1,justifyContent:'center',alignItems:'center',
                     borderTopRightWidth:1, borderTopRightColor:'transparent', borderTopLeftColor:'transparent'}}>
                    <Text style={{fontSize: 18, color:'#1E1F20', fontFamily: 'AvenirLTStd-Heavy',marginTop:hp(2), alignSelf:'center', textAlign:'center'}}>Who is the Patient?</Text>
                     </View>

          <FlatList style= {{flexGrow:0,marginBottom:10, alignSelf:'center'}}
                    data={[...this.state.membersList, {plusImage : true}]}
                    numColumns={1}
                    extraData={this.state}
                    keyExtractor = { (item, index) => index.toString() }
                    renderItem={this.renderMembers}/>

                      </View>
                  </View>
              </TouchableOpacity>
         </Modal>


</>
        );
    }
}
export default Home;

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor :'white',
        width:wp('100%'),
    },
    loading: {
        position: 'absolute',
        left: window.width/2 - 30,
        top: window.height/2,
        opacity: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },

})
