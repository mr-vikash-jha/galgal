import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { encode } from 'base-64';

import colorData from './src/color.json';
import zipData from './src/zipcodes.json';

const Form = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDOB] = useState('');
  const [gender, setGender] = useState('');
  const [zip, setZip] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [color, setColor] = useState('');
  const [notes, setNotes] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const validateName = () => /^[A-Z\s']+$/.test(name);
  const validateEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobile = () => /^\d{4}-\d{6}$/.test(mobile);
  const validateDOB = () => /^\d{2}-\d{2}-\d{4}$/.test(dob);
  const validateGender = () => !!gender;
  const validateColor = () => !!color;

  const validateForm = () => {
    return (
      validateName() &&
      validateEmail() &&
      validateMobile() &&
      validateDOB() &&
      validateGender() &&
      validateColor()
    );
  };

  useEffect(() => {
    if (zip.length >= 3) {
      const matchingZip = zipData.zipcode_data.find(
        zipcode => zipcode.zipcode === zip,
      );
      if (matchingZip) {
        setCity(matchingZip.city);
        setState(matchingZip.state);
      } else {
        setCity('');
        setState('');
      }
    } else {
      setCity('');
      setState('');
    }
  }, [zip]);

  const handleSubmit = () => {
    if (validateForm() && !formSubmitted && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        const formData = {
          Name: name,
          Email: email,
          Mobile: mobile,
          DOB: dob,
          Gender: gender,
          ZIP: zip,
          City: city,
          State: state,
          Color: color,
          Notes: notes,
        };
        const encodedData = encode(JSON.stringify(formData));
        alert(encodedData);
        setFormSubmitted(true);
        setIsLoading(false);
      }, 2000);
    }
  };

  const handleShowData = () => {
    if (formSubmitted) {
      setClickCount(clickCount + 1);
      const data = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Mobile: ${mobile}`,
        `DOB: ${dob}`,
        `Gender: ${gender}`,
        `ZIP: ${zip}`,
        `City: ${city}`,
        `State: ${state}`,
        `Color: ${color}`,
        `Notes: ${notes}`,
      ];
      alert(data.join('\n'));
    }
  };

  const handleReset = () => {
    if (formSubmitted) {
      setName('');
      setEmail('');
      setMobile('');
      setDOB('');
      setGender('');
      setZip('');
      setCity('');
      setState('');
      setColor('');
      setNotes('');
      setFormSubmitted(false);
      setClickCount(0);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Name"
            onChangeText={text => setName(text)}
            value={name}
            autoCapitalize="words"
            style={styles.input}
            editable={!formSubmitted}
          />
          {!validateName() && (
            <Text style={styles.validationText}>Please enter a valid name</Text>
          )}
          <TextInput
            placeholder="Email"
            onChangeText={text => setEmail(text)}
            value={email}
            style={styles.input}
            editable={!formSubmitted}
          />
          {!validateEmail() && (
            <Text style={styles.validationText}>Please enter a valid email</Text>
          )}
          <TextInput
            placeholder="Mobile (XXXX-XXXXXX)"
            onChangeText={text => setMobile(text)}
            value={mobile}
            style={styles.input}
            editable={!formSubmitted}
          />
          {!validateMobile() && (
            <Text style={styles.validationText}>
              Please enter a valid mobile number (XXXX-XXXXXX)
            </Text>
          )}
          <TextInput
            placeholder="DOB (DD-MM-YYYY)"
            onChangeText={text => setDOB(text)}
            value={dob}
            style={styles.input}
            editable={!formSubmitted}
          />
          {!validateDOB() && (
            <Text style={styles.validationText}>
              Please enter a valid date of birth (DD-MM-YYYY)
            </Text>
          )}
          <Text style={styles.label}>Gender:</Text>
          <Picker
            selectedValue={gender}
            onValueChange={value => setGender(value)}
            style={styles.picker}
            enabled={!formSubmitted}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
          {!validateGender() && (
            <Text style={styles.validationText}>Please select a gender</Text>
          )}
          <TextInput
            placeholder="ZIP"
            onChangeText={text => setZip(text)}
            value={zip}
            style={styles.input}
            editable={!formSubmitted}
          />
          <TextInput
            placeholder="City"
            value={city}
            style={styles.readOnlyInput}
            editable={false}
          />
          <TextInput
            placeholder="State"
            value={state}
            style={styles.readOnlyInput}
            editable={false}
          />
          <Text style={styles.label}>Color:</Text>
          <Picker
            selectedValue={color}
            onValueChange={value => setColor(value)}
            style={styles.picker}
            enabled={!formSubmitted}
          >
            <Picker.Item label="Select Color" value="" />
            {Object.entries(colorData).map(([colorName, colorCode]) => (
              <Picker.Item key={colorName} label={colorName} value={colorName} />
            ))}
          </Picker>
          {!validateColor() && (
            <Text style={styles.validationText}>Please select a color</Text>
          )}
          <TextInput
            placeholder="Notes"
            onChangeText={text => setNotes(text)}
            value={notes}
            style={styles.textArea}
            multiline
            editable={!formSubmitted}
          />
          <Button
            title="Submit"
            onPress={handleSubmit}
            disabled={!validateForm() || formSubmitted || isLoading}
          />
          {isLoading && <Text style={styles.loadingText}>Loading...</Text>}
          {formSubmitted && (
            <Text style={styles.successText}>Form submitted successfully!</Text>
          )}
          <Button
            title="Show Data"
            onPress={handleShowData}
            disabled={!formSubmitted}
          />
          <Button
            title="Reset"
            onPress={handleReset}
            disabled={!formSubmitted}
          />
        </View>
        <Text style={styles.clickCountText}>
          Click count: {clickCount}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'center',
  },
  formContainer: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  readOnlyInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: '#f0f0f0',
  },
  textArea: {
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  picker: {
    marginBottom: 8,
  },
  validationText: {
    color: 'red',
    marginBottom: 8,
  },
  loadingText: {
    marginTop: 8,
  },
  successText: {
    color: 'green',
    marginTop: 8,
  },
  clickCountText: {
    alignSelf: 'center',
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Form;
