import React, {Component} from 'react';
import {
  StyleSheet,
  Button,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import {SimpleSurvey} from 'react-native-simple-survey';
import {REST_URL, handleBack, HEADERS_CONFIG} from '../AppConfig';
import {connect} from 'remx';
import {store as UserStore} from '../remx/User/store';
import {store} from '../remx/Service/store';
import {Alert} from 'react-native';
import {round} from 'react-native-reanimated';
import * as UserAction from '../remx/User/actions';
import {BackHandler} from 'react-native';

const GREEN = 'rgba(141,196,63,1)';
const ORANGE = 'rgba(203,109,32,1)';
const GREY = 'rgba(241,241,241, 0.8)';
var antiDup = null;

// export default class SurveyScreen extends Component{
//   console.log();
// }

export default class SurveyScreen extends Component {
  static navigationOptions = () => {
    return {
      headerStyle: {
        backgroundColor: GREEN,
        height: 40,
        elevation: 5,
      },
      headerTintColor: '#fff',
      headerTitle: 'Sample Survey',
      headerTitleStyle: {
        flex: 1,
      },
    };
  };

  constructor(props) {
    super(props);

    var data = [];

    this.state = {
      backgroundColor: GREY,
      answersSoFar: '',
      user: UserStore.getUserData(),
      survey: data,
      listQuesioner: [],
      surveyId: `ID${1 + Math.random() * (100 - 1)}`,
    };

    this.getSurvey.bind(this);
    this.saveSurvey.bind(this);
    this.getSurveyElement.bind(this);
    this.itemInfo.bind(this);
    this.itemInput.bind(this);
    this.itemNumericInput.bind(this);
    this.itemGroup.bind(this);
    this.itemMultipleGroup.bind(this);

    this.getSurvey();
  }

  componentDidMount() {
    // disabled back handler
    this.props.navigation.addListener('focus', () => {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBack,
      );
    });

    this.props.navigation.addListener('blur', () => {
      if (this.backHandler) this.backHandler.remove();
    });
  }

  onSurveyFinished(answers) {
    /**
     *  By using the spread operator, array entries with no values, such as info questions, are removed.
     *  This is also where a final cleanup of values, making them ready to insert into your DB or pass along
     *  to the rest of your code, can be done.
     *
     *  Answers are returned in an array, of the form
     *  [
     *  {questionId: string, value: any},
     *  {questionId: string, value: any},
     *  ...
     *  ]
     *  Questions of type selection group are more flexible, the entirity of the 'options' object is returned
     *  to you.
     *
     *  As an example
     *  {
     *      questionId: "favoritePet",
     *      value: {
     *          optionText: "Dogs",
     *          value: "dog"
     *      }
     *  }
     *  This flexibility makes SelectionGroup an incredibly powerful component on its own. If needed it is a
     *  separate NPM package, react-native-selection-group, which has additional features such as multi-selection.
     */

    const infoQuestionsRemoved = [...answers];
    var id = this.state.surveyId;
    var nip = this.state.user.id_employee;
    var data = infoQuestionsRemoved;
    var sendData = {
      id: id,
      nip: nip,
      data: data,
    };

    var id_employee = this.state.user.id_employee;
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    var curDate = year + '-' + month + '-' + date;
    var id_quesioners = [];
    var sequences = [];
    var questions = [];
    var types = [];
    var id_opts = [];
    var opt_names = [];
    var descs = [];
    //console.log(data);
    // console.log(JSON.stringify(sendData));
    if (this.state.listQuesioner.length > 0) {
      for (const ques of this.state.listQuesioner) {
        id_quesioners.push(ques.id_quesioner);
        sequences.push(ques.sequence);
        questions.push(ques.question);
        types.push(ques.type);

        for (const answerQuest of data) {
          if (answerQuest.questionId == ques.id_quesioner) {
            if (answerQuest.value.value) {
              // value with options

              for (const listAbc of ques.list_opt) {
                if (listAbc.id_opt == answerQuest.value.value) {
                  id_opts.push(listAbc.id_opt);
                  opt_names.push(listAbc.opt_name);
                  descs.push(listAbc.opt_desc);
                }
              }
            } else {
              // value no options
              id_opts.push('');
              opt_names.push('');
              descs.push(answerQuest.value);
            }

            break;
          }
        }
      }
    }
    this.saveSurvey(
      id_employee,
      curDate,
      id_quesioners,
      sequences,
      questions,
      types,
      id_opts,
      opt_names,
      descs,
    );

    // Convert from an array to a proper object. This won't work if you have duplicate questionIds
    const answersAsObj = {};
    for (const elem of infoQuestionsRemoved) {
      answersAsObj[elem.questionId] = elem.value;
    }

    // this.props.navigation.navigate('SurveyCompleted');
  }

  /**
   *  After each answer is submitted this function is called. Here you can take additional steps in response to the
   *  user's answers. From updating a 'correct answers' counter to exiting out of an onboarding flow if the user is
   *  is restricted (age, geo-fencing) from your app.
   */
  onAnswerSubmitted(answer) {
    var val = answer.value;
  }

  renderPreviousButton(onPress, enabled) {
    return (
      <View
        style={{flexGrow: 1, maxWidth: 100, marginTop: 10, marginBottom: 10}}>
        <Button
          color={GREEN}
          onPress={onPress}
          disabled={!enabled}
          backgroundColor={GREEN}
          title={'Kembali'}
        />
      </View>
    );
  }

  renderNextButton(onPress, enabled) {
    return (
      <View
        style={{flexGrow: 1, maxWidth: 100, marginTop: 10, marginBottom: 10}}>
        <Button
          color={GREEN}
          onPress={onPress}
          disabled={!enabled}
          backgroundColor={GREEN}
          title={'Lanjutkan'}
        />
      </View>
    );
  }

  renderFinishedButton(onPress, enabled) {
    return (
      <View
        style={{flexGrow: 1, maxWidth: 100, marginTop: 10, marginBottom: 10}}>
        <Button
          title={'Selesai'}
          onPress={onPress}
          disabled={!enabled}
          color={GREEN}
        />
      </View>
    );
  }

  renderButton(data, index, isSelected, onPress) {
    return (
      <View
        key={`selection_button_view_${index}`}
        style={{marginTop: 5, marginBottom: 5, justifyContent: 'flex-start'}}>
        <Button
          title={data.optionText}
          onPress={onPress}
          color={isSelected ? GREEN : ORANGE}
          style={isSelected ? {fontWeight: 'bold'} : {}}
          key={`button_${index}`}
        />
      </View>
    );
  }

  renderQuestionText(questionText) {
    return (
      <View style={{marginLeft: 10, marginRight: 10}}>
        <Text numLines={1} style={styles.questionText}>
          {questionText}
        </Text>
      </View>
    );
  }

  renderTextBox(onChange, value, placeholder, onBlur) {
    return (
      <View>
        <TextInput
          style={styles.textBox}
          onChangeText={(text) => onChange(text)}
          numberOfLines={1}
          underlineColorAndroid={'white'}
          placeholder={placeholder}
          placeholderTextColor={'rgba(184,184,184,1)'}
          value={value}
          multiline
          onBlur={onBlur}
          blurOnSubmit
          returnKeyType="done"
        />
      </View>
    );
  }

  renderNumericInput(onChange, value, placeholder, onBlur) {
    return (
      <TextInput
        style={styles.numericInput}
        onChangeText={(text) => {
          onChange(text);
        }}
        underlineColorAndroid={'white'}
        placeholderTextColor={'rgba(184,184,184,1)'}
        value={String(value)}
        placeholder={placeholder}
        keyboardType={'numeric'}
        onBlur={onBlur}
        maxLength={3}
      />
    );
  }

  renderInfoText(infoText) {
    return (
      <View style={{marginLeft: 10, marginRight: 10}}>
        <Text style={styles.infoText}>{infoText}</Text>
      </View>
    );
  }

  getSurveyElement() {
    if (this.state.survey.length > 0) {
      return (
        <SimpleSurvey
          ref={(s) => {
            this.surveyRef = s;
          }}
          survey={this.state.survey}
          renderSelector={this.renderButton.bind(this)}
          containerStyle={styles.surveyContainer}
          selectionGroupContainerStyle={styles.selectionGroupContainer}
          navButtonContainerStyle={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
          renderPrevious={this.renderPreviousButton.bind(this)}
          renderNext={this.renderNextButton.bind(this)}
          renderFinished={this.renderFinishedButton.bind(this)}
          renderQuestionText={this.renderQuestionText}
          onSurveyFinished={(answers) => this.onSurveyFinished(answers)}
          onAnswerSubmitted={(answer) => this.onAnswerSubmitted(answer)}
          renderTextInput={this.renderTextBox}
          renderNumericInput={this.renderNumericInput}
          renderInfo={this.renderInfoText}
        />
      );
    } else {
      return (
        <Text style={{textAlignVertical: 'center', textAlign: 'center'}}>
          Sedang memuat data..
        </Text>
      );
    }
  }

  getSurvey() {
    let item = this.props;
    let uri = `${REST_URL}/quesioner`;
    console.log(uri);
    // do login process
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status == 'OK') {
          let quesioners = [];
          quesioners.push(this.itemInfo('Selamat datang di laman quesioner.'));

          if (res.list_quesioner.length > 0) {
            for (const item of res.list_quesioner) {
              if (item.list_opt.length > 0) {
                // combobox

                let item_list = [];
                if (item.list_opt.length > 0) {
                  for (const l of item.list_opt) {
                    item_list.push({optionText: l.opt_name, value: l.id_opt});
                  }
                }

                quesioners.push(
                  this.itemGroup(item.question, item.id_quesioner, item_list),
                );
              } else {
                quesioners.push(
                  this.itemInput(
                    item.question,
                    item.id_quesioner,
                    'Silahkan di isi..',
                  ),
                );
              }
            }
          }
          quesioners.push(
            this.itemInfo('Anda telah mengisi quesioner hari ini. Terimakasih'),
          );

          this.setState({
            listQuesioner: res.list_quesioner,
            survey: quesioners,
          });
        } else {
          this.props.navigation.navigate('CheckInOut');
        }
        this.setState({showLoading: false});
      })
      .catch((err) => {
        //this.setState({ showLoading: false });
        Alert.alert('Info', `Gagal memuat data`, [{text: 'Close'}]);
        this.props.navigation.navigate('CheckInOut');
      });
  }

  saveSurvey(
    id_employee,
    curDate,
    id_quesioners,
    sequences,
    questions,
    types,
    id_opts,
    opt_names,
    descs,
  ) {
    var myHeaders = new Headers();

    this.setState({showLoading: true});
    var formdata = new FormData();
    formdata.append('id_employee', id_employee);
    formdata.append('date', curDate);

    for (var i = 0; i < id_quesioners.length; i++) {
      formdata.append('id_quesioner[]', id_quesioners[i]);
      formdata.append('sequence[]', sequences[i]);
      formdata.append('question[]', questions[i]);
      formdata.append('type[]', types[i]);
      formdata.append('id_opt[]', id_opts[i]);
      formdata.append('opt_name[]', opt_names[i]);
      formdata.append('desc[]', descs[i]);
    }

    // console.log(formdata);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    let uri = `${REST_URL}/quesioner/save`;
    fetch(uri, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 'OK') {
          Alert.alert('Info', result.message, [{text: 'Close'}]);
          UserAction.setQuesionerData(0, '0');
        } else {
          Alert.alert('Info', `Gagal simpan data`, [{text: 'Close'}]);
        }
        this.props.navigation.replace('CheckInOut');
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Info', `Gagal simpan data`, [{text: 'Close'}]);
        this.props.navigation.replace('CheckInOut');
      });
  }

  render() {
    return (
      <View
        style={[
          styles.background,
          {backgroundColor: this.state.backgroundColor},
        ]}>
        <View style={styles.container}>{this.getSurveyElement()}</View>
      </View>
    );
  }

  itemInfo(text) {
    return {
      questionType: 'Info',
      questionText: text,
    };
  }

  itemInput(question, questionId, placeholder = '') {
    return {
      questionType: 'TextInput',
      questionText: question,
      questionId: questionId,
      placeholderText: placeholder,
    };
  }

  itemNumericInput(question, questionId, placeholder = '') {
    return {
      questionType: 'NumericInput',
      questionText: question,
      questionId: questionId,
      placeholderText: placeholder,
    };
  }

  itemGroup(question, questionId, optionData = []) {
    /**
         *      Item option value
         *      [{
                    optionText: 'Dogs',
                    value: 'dog'
                }, ... ],
         */
    return {
      questionType: 'SelectionGroup',
      questionText: question,
      questionId: questionId,
      options: optionData,
    };
  }

  itemMultipleGroup(
    question,
    questionId,
    mxMultiSelect = 3,
    mnMultiSelect = 2,
    optionData = [],
  ) {
    /**
         *      Data options list
         *      [{
                    optionText: 'Sticky rice dumplings',
                    value: 'sticky rice dumplings'
                }]
         */
    return {
      questionType: 'MultipleSelectionGroup',
      questionText: question,
      questionId: questionId,
      questionSettings: {
        maxMultiSelect: mxMultiSelect,
        minMultiSelect: mnMultiSelect,
      },
      options: optionData,
    };
  }
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
    height: 30,
    width: 140,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    minWidth: '70%',
    maxWidth: '90%',
    alignItems: 'stretch',
    justifyContent: 'center',

    borderRadius: 10,
    flex: 1,
  },
  answersContainer: {
    width: '90%',
    maxHeight: '20%',
    marginTop: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: 'white',
    elevation: 20,
    borderRadius: 10,
  },
  surveyContainer: {
    width: 'auto',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignContent: 'center',
    padding: 5,
    flexGrow: 0,
    elevation: 20,
  },
  selectionGroupContainer: {
    flexDirection: 'column',
    backgroundColor: 'white',
    alignContent: 'flex-end',
  },
  navButtonText: {
    margin: 10,
    fontSize: 20,
    color: 'white',

    width: 'auto',
  },
  answers: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  navigationButton: {
    minHeight: 40,
    backgroundColor: GREEN,
    padding: 0,
    borderRadius: 100,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    marginBottom: 20,
    fontSize: 20,
  },
  textBox: {
    borderWidth: 1,
    borderColor: 'rgba(204,204,204,1)',
    backgroundColor: 'white',
    borderRadius: 10,

    padding: 10,
    textAlignVertical: 'top',
    marginLeft: 10,
    marginRight: 10,
  },
  numericInput: {
    borderWidth: 1,
    borderColor: 'rgba(204,204,204,1)',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    marginLeft: 10,
    marginRight: 10,
  },
  infoText: {
    marginBottom: 20,
    fontSize: 20,
    marginLeft: 10,
  },
});
