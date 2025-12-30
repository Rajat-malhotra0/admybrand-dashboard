const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

async function testUpload() {
  try {
    console.log('Testing file upload...');
    
    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream('test-influencer.csv'));
    form.append('dataType', 'influencers');
    form.append('platform', 'Instagram');
    
    console.log('Sending request to upload endpoint...');
    
    // Send the request
    const response = await axios.post('http://localhost:5000/api/upload/file', form, {
      headers: form.getHeaders()
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.status === 201) {
      console.log('✅ Upload successful!');
    } else {
      console.log('❌ Upload failed!');
    }
    
  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
}

testUpload();
