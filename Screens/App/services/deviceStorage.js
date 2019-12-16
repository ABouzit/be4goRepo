import { AsyncStorage } from 'react-native';

const deviceStorage = {
  async saveKey(key, valueToSave) {
    try {
      var mytoke = await AsyncStorage.setItem(key, valueToSave);
      console.log("(((((((((((((((((((((((((((((((((("+mytoke);
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  },

  async loadJWT() {
    try {
      const value = await AsyncStorage.getItem('id_token');
      console.log("ommmmmmmmmmmae))))"+value)
      if (value !== null) {
        this.setState({
          jwt: value,
          loading: false
        });
        return Promise.resolve(value)
      } else {
        this.setState({
          loading: false
        });
        return Promise.resolve("error");
      }
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
      return Promise.resolve("error")
    }
  },

  async deleteJWT() {
    try{
      await AsyncStorage.removeItem('id_token')
      .then(
        () => {
          this.setState({
            jwt: ''
          })
        }
      );
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  }};


export default deviceStorage;
